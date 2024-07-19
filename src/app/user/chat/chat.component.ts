import { Component, ElementRef, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { Observable, map, take } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase/compat';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ScrollToBottomDirective } from 'src/app/services/scroll-to-bottom.directive';
import { LoginService } from 'src/app/core/login/login.service';
// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
//admin.initializeApp();

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

  isChatActive = false;


  chatrooms$: Observable<any[]>;
  chatMessages$!: Observable<any[]>;
  roomId: any[] = [];
  roomMsg: any[] = [];
  chatMessages!: Observable<any[]>;
  chatId: any;
  newForm!: FormGroup;
  UploadedFile!: File;

  userDet: any = '';
  userId: any = '';

  userData: any[] = [];
  selectedUser: any;

  avatar_url: any;
  avatar_name: any;

  to: any;
  body: any;
  title: any;

  showMsg: boolean = false;
  unreadMessagesCount: { [key: string]: number } = {};
  recentmsg: any;
  recentMessages!: any[];
  //lastMessageWithContent: any;
  lastMessageWithContent: { [key: string]: any } = {};
  notifications: { content: string, createdAt: string, avatar_url: any }[] = [];

  constructor(private userSer: UserService, private firestore: AngularFirestore, private router: Router, private afMessaging: AngularFireMessaging, private toastr: ToastrService, private http: HttpClient, private _el: ElementRef, private loginService: LoginService) {
    // Get a reference to the chatrooms collection
    const chatroomsCollection: AngularFirestoreCollection<any> = this.firestore.collection('chatRooms');
    //const chatroomsCollection: AngularFirestoreCollection<any> = this.firestore.collection('chatRooms', ref => ref.orderBy('modifiedAtTimestampInMillis', 'desc'));

    // Query the collection and assign the result to the Observable
    this.chatrooms$ = chatroomsCollection.valueChanges();

    // Subscribe to the Observable and print the result in the console
    this.chatrooms$.subscribe(chatrooms => {

      this.roomId = chatrooms;
      console.log('this.roomId', this.roomId);

      //this.showNotificationSec();


      const createdByUserIds: any[] = chatrooms.map(chatroom => Number(chatroom.createdByUserId));




      this.sortRoomsByRecentMessage();
      this.sendIdsToApi(createdByUserIds);
      this.logUserUnreadMessagesLength(chatrooms);
      //console.log('mhdfkghkdjhgkjjhglkjfd',this.unreadMessagesCount);
    });

    this.bell();

  }

  logUserUnreadMessagesLength(chatrooms: any[]): void {
    let totalUnreadMessages = 0; 
    chatrooms.forEach(chatroom => {
      const adminUnreadMessages = chatroom.userUnreadMessages?.find((userUnread: any) => userUnread.userId == 'admin');
      const unreadMessagesLength = adminUnreadMessages ? adminUnreadMessages?.unreadMessageIds.length : 0;
      this.unreadMessagesCount[chatroom.chatRoomId] = unreadMessagesLength;
      if(unreadMessagesLength == undefined){
        totalUnreadMessages = 0
      } else {
        totalUnreadMessages += unreadMessagesLength;
        this.userSer.totalMessagesSignal.set(totalUnreadMessages)
      }
      localStorage.setItem('unreadMsgs', String(totalUnreadMessages))
      //console.log('mhdfkghkdjhgkjjhglkjfd',this.unreadMessagesCount[chatroom.chatRoomId]);
      //console.log(`Chatroom has ${unreadMessagesLength} unread messages for admin.`);
    });
    
    
    console.log(`Total unread messages for admin: ${totalUnreadMessages}`);
  }



  showNotificationSec() {
    this.userSer.notifySer('/admin/notification').subscribe(response => {
      if (response.success) {
        this.notifications = response.notifications.map((notification: any) => ({
          content: notification.content,
          createdAt: notification.createdAt,
          avatar_url: notification.byUser.avatar_url
        })).reverse();
        this.userSer.setNotifications(this.notifications);
      }
    })
  }




  updateUserPosition(messages: any[]): void {
    if (messages.length > 0) {
      const latestMessage = messages[0];
      const userId = latestMessage.createdByUserId;

      const userIndex = this.roomId.findIndex(room => room.createdByUserId === userId);
      if (userIndex !== -1) {
        const userRoom = this.roomId.splice(userIndex, 1)[0];
        this.roomId.unshift(userRoom);
        //this.syncUserData();  // Sync userData after modifying roomId
      }
    }
  }

  sortRoomsByRecentMessage(): void {
    this.roomId.sort((a, b) => {
      const aTime = a.recentMessage?.messageTimeStampInMillis || 0;
      const bTime = b.recentMessage?.messageTimeStampInMillis || 0;
      return bTime - aTime;
    });
    //this.syncUserData();
  }

  // syncUserData(): void {
  //   // Map userData based on roomId after sorting
  //   this.userData = this.roomId.map(room => {
  //     const user = this.userData.find(u => u.id === room.createdByUserId);
  //     return {
  //       id: room.createdByUserId,
  //       full_name: user ? user.full_name : 'Unknown', // Set to 'Unknown' if user not found
  //       avatar_url: user ? user.avatar_url : null // Set to null if user not found
  //     };
  //   });

  //   // Check if any user data is missing and fetch from API
  //   const missingUserIds = this.roomId
  //     .filter(room => this.userData.find(u => u.id === room.createdByUserId))
  //     .map(room => parseInt(room.createdByUserId, 10)); // Convert strings to numbers

  //   if (missingUserIds.length > 0) {
  //     this.sendIdsToApi(missingUserIds);
  //   }
  // }


  shuffleMessages(): void {
    for (let i = this.roomMsg.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.roomMsg[i], this.roomMsg[j]] = [this.roomMsg[j], this.roomMsg[i]];
    }
  }

  rotateMessages(): void {
    const lastElement = this.roomMsg.pop();
    if (lastElement !== undefined) {
      this.roomMsg.unshift(lastElement);
    }
  }

  swapFirstLastMessages(): void {
    if (this.roomMsg.length > 1) {
      [this.roomMsg[0], this.roomMsg[this.roomMsg.length - 1]] = [this.roomMsg[this.roomMsg.length - 1], this.roomMsg[0]];
    }
  }




  ngOnInit(): void {

    this.initForm();
    this.initBellForm();

    this.userDet = localStorage.getItem('userDetail');
    const parsedData = JSON.parse(this.userDet);
    this.userId = parsedData['id']
    console.log('this.userId', this.userId)

  }

  initForm() {
    this.newForm = new FormGroup({
      message: new FormControl(''),
      file: new FormControl(null),
    })
  }

  avatar_url1: any = 'assets/img/logo.svg';

  // sendIdsToApi(userIds: number[]) {
  //   const data = { userIds };

  //   this.userSer.postAPIJson('/admin/getUsersWithIds', data).subscribe({
  //     next: (resp) => {
  //       // Map the response data according to roomId
  //       console.log('this.roomIdthis.roomIdthis.roomId', this.roomId)
  //       this.userData = this.roomId.map(room => {
  //         const user = resp.users.find((u: { id: any; }) => u.id == room.createdByUserId);

  //         const lastMessageContent = room.recentMessage?.messageContent
  //         console.log('lastMessageContent', lastMessageContent);
  //         const messageTimeStampInMillis = room.recentMessage?.messageTimeStampInMillis

  //         return {
  //           id: room.createdByUserId,
  //           full_name: user ? user.full_name : 'Not Found', // Set to 'Unknown' if user not found
  //           avatar_url: user ? user.avatar_url : null,
  //           fcm_token: user ? user.fcm_token : '',
  //           lastMsg: lastMessageContent,
  //           timestamp: messageTimeStampInMillis
  //         };
  //       });
  //       console.log('this.userData', this.userData);

  //     },
  //     error: (err) => {
  //       console.error('API error:', err);
  //     }
  //   });
  // }

  sendIdsToApi(userIds: number[]) {
    const data = { userIds };
  
    this.userSer.postAPIJson('/admin/getUsersWithIds', data).subscribe({
      next: (resp) => {
        // Map the response data according to roomId
        console.log('this.roomIdthis.roomIdthis.roomId', this.roomId)
        this.userData = this.roomId
          .map(room => {
            const user = resp.users.find((u: { id: any; }) => u.id == room.createdByUserId);
  
            if (!user) {
              // If the user is not found, return null
              return null;
            }
  
            const lastMessageContent = room.recentMessage?.messageContent;
            console.log('lastMessageContent', lastMessageContent);
            const messageTimeStampInMillis = room.recentMessage?.messageTimeStampInMillis;
  
            return {
              id: room.createdByUserId,
              full_name: user.full_name,
              avatar_url: user.avatar_url,
              fcm_token: user.fcm_token,
              lastMsg: lastMessageContent,
              timestamp: messageTimeStampInMillis
            };
          })
          .filter(room => room !== null); // Filter out null values
        
        console.log('this.userData', this.userData);
      },
      error: (err) => {
        console.error('API error:', err);
      }
    });
  }
  


  private fcmUrl = 'https://fcm.googleapis.com/fcm/send';
  private serverKey = 'AAAAFqiUxNk:APA91bHbBMgoR_WN4vitooJEVMF1fCg-NArEddJwUtCWHalJqE_JtiNjL5Mb1n_GoI15jMUaKnU3FvF06Djk-ijqSvaw_i3IiXsDtiIX50KbIPuTQQnu1XooL2lHxg_fAE3f2m0rBq-K';

  sendNotification() {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `key=${this.serverKey}`
    });

    const payload = {
      to: this.to,
      notification: {
        body: this.body,
        //title: this.title
        title: 'Club Loyalty'
      }
    };

    this.http.post(this.fcmUrl, payload, { headers: headers }).subscribe({
      next: (resp) => {
        console.log('notifyresp', resp)
      },
      error: (err) => {
        console.log('err', err)
      }
    })
  }


  selectUser(user: any) {
    this.showMsg = true;
    this.selectedUser = user;
    //console.log('Selected user:', this.selectedUser);
    this.to = user.fcm_token;
    this.title = user.full_name
    this.getChatId(user.id, user.avatar_url, user.full_name);

    // const selectedRoom = this.roomId.find(room => room.createdByUserId === user.id);
    // console.log('selectedRoom', selectedRoom)
    // if (selectedRoom) {
    //   this.updateRecentMessageReadStatusIfVisible(selectedRoom);
    // }
  }


  getChatId(id: any, img: any, name: any) {
    //this.chatId = JSON.stringify(id);
    this.chatId = id;
    this.avatar_url = img;
    this.avatar_name = name;
    this.getChatMsg();
  }


  getChatMsg() {

    const chatroomsMessages: AngularFirestoreCollection<any> = this.firestore.collection('chatRooms').doc(this.chatId).collection("messages", ref =>
      ref.orderBy('messageTimeStampInMillis', 'desc'));

    this.chatMessages$ = chatroomsMessages.valueChanges().pipe(
      map(chatmag => chatmag.reverse())
    );

    this.chatMessages$.subscribe(chatmag => {
      console.log('Chatrooms msg:', chatmag);
      this.roomMsg = chatmag;

      this.updateUserPosition(chatmag);
      console.log('roomMsg', this.roomMsg);

      // this.lastMessageWithContent = this.roomMsg.slice().reverse().find(msg => msg.messageContent);
      // if (this.lastMessageWithContent) {
      //   console.log('Last message with content:', this.lastMessageWithContent);
      // }
      this.categorizeMessages();

      //for unread message
      const selectedRoom = this.roomId.find(room => room.createdByUserId == this.selectedUser.id);
      if (selectedRoom) {
        this.updateRecentMessageReadStatusIfVisible(selectedRoom);
      }
    });
    
  }


  todayMessages: any[] = [];
  yesterdayMessages: any[] = [];
  olderMessages: any[] = [];

  categorizeMessages() {
    const today = new Date().setHours(0, 0, 0, 0);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayTimestamp = yesterday.setHours(0, 0, 0, 0);

    // Reset categorized messages
    this.todayMessages = [];
    this.yesterdayMessages = [];
    this.olderMessages = [];

    // Categorize messages
    this.roomMsg.forEach(message => {
      const msgDate = new Date(message.messageTimeStampInMillis).setHours(0, 0, 0, 0);
      if (msgDate === today) {
        this.todayMessages.push(message);
      } else if (msgDate === yesterdayTimestamp) {
        this.yesterdayMessages.push(message);
      } else {
        this.olderMessages.push(message);
      }
    });
  }




  formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }

  formatTimestamp1(timestamp: number): string {
    const date = new Date(timestamp);
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes} - ${year}-${month}-${day}`;
  }


  ngOnDestroy(){
    this.chatId = null;
  }

  // handleCommittedFileInput(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   if (inputElement.files && inputElement.files.length > 0) {
  //     this.UploadedFile = inputElement.files[0];
  //   }
  // }

  // Send message

  // sendMessage() {
  //   // Get the message content from the form
  //   const messageContent = this.newForm.value.message;
  //   this.body = messageContent;

  //   if (!messageContent.trim()) {
  //     // If the message content is empty, do not proceed with sending the message
  //     return;
  //   }

  //   // Get a reference to the messages subcollection of the selected chat room
  //   const chatRoomRef = this.firestore.collection('chatRooms').doc(this.chatId);
  //   const messagesCollection = chatRoomRef.collection('messages');

  //   const batch = this.firestore.firestore.batch();
  //   // const documentReference = this.firestore.collection("chatRooms").doc(this.chatId).collection("messages").doc();
  //   const documentReference = this.firestore.collection("chatRooms").doc(this.chatId).collection("messages");
  //   //console.log('documentReference', documentReference)

  //   const messageModel = {
  //     messageId: documentReference.ref.id,
  //     messageContent: messageContent,
  //     senderId: this.userId.toString(),
  //     messageTimeStampInMillis: new Date().getTime()
  //     //event: event ? event.toJson() : null
  //   };


  //   // Add the new message document to the messages subcollection
  //   messagesCollection.add(messageModel)
  //     .then(() => {
  //       console.log('Message sent successfully!');
  //       // Clear the message input field after sending
  //       this.newForm.patchValue({ message: '' });
  //       this.sendNotification();
  //     })
  //     .catch(error => {
  //       console.error('Error sending message:', error);
  //     });
  // }
  updateRecentMessageReadStatusIfVisible(chatRoomModel: any): void {
    const loginResponseModel = 'admin'
    if (chatRoomModel.chatRoomId == this.chatId) {
      this.firestore.collection('chatRooms').doc(chatRoomModel.chatRoomId).update({
        userUnreadMessages: chatRoomModel.userUnreadMessages
          ?.filter((element: any) => element.userId !== loginResponseModel)
          .map((e: any) => ({
            ...e,
            unreadMessageIds: e.unreadMessageIds || []
          }))
      }).then(() => {
        console.log(`Updated unread messages status for chatRoom ${chatRoomModel.chatRoomId}`);
      }).catch(err => {
        console.error('Error updating unread messages status:', err);
      });
    }

  }

  sendMessage() {
    // Get the message content from the form
    const messageContent = this.newForm.value.message;
    this.body = messageContent;

    if (!messageContent.trim()) {
      // If the message content is empty, do not proceed with sending the message
      return;
    }

    // Get a reference to the messages subcollection of the selected chat room
    const chatRoomRef = this.firestore.collection('chatRooms').doc(this.chatId);
    const messagesCollection = chatRoomRef.collection('messages');

    const batch = this.firestore.firestore.batch();

    const documentReference = this.firestore.collection("chatRooms").doc(this.chatId).collection("messages").doc();

    const messageModel = {
      messageId: documentReference.ref.id,
      messageContent: messageContent,
      senderId: this.userId.toString(),
      messageTimeStampInMillis: new Date().getTime()
    };

    // Add the new message document to the messages subcollection
    messagesCollection.add(messageModel)
      .then(() => {
        console.log('Message sent successfully!');
        // Clear the message input field after sending
        this.newForm.patchValue({ message: '' });
        this.sendNotification();

        this.updateUnreadMessagesAndRecentMessage(this.chatId, messageModel);
        // Update the recent message timestamp for the chat room
        // const recentMessage = {
        //   recentMessage: messageModel,
        //   // "modifiedAtTimestampInMillis": messageModel.messageTimeStampInMillis,
        //   // "userUnreadMessages":
        // };

        // chatRoomRef.update(recentMessage)
        //   .then(() => {
        //     // Resort rooms by recent message
        //     this.sortRoomsByRecentMessage();

        //     // Update user position
        //     this.updateUserPosition([messageModel]);
        //   })
        //   .catch(error => {
        //     console.error('Error updating recent message timestamp:', error);
        //   });
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
  }


  updateUnreadMessagesAndRecentMessage(chatRoomId: string, messageModel: any) {
    if (chatRoomId == this.chatId) {
      const chatRoomRef = this.firestore.collection('chatRooms').doc(chatRoomId);
      chatRoomRef.get().subscribe(chatRoomDoc => {
        if (chatRoomDoc.exists) {
          const chatRoomData: any = chatRoomDoc.data();
          const loginResponseModel = 'admin';
  
          // Filter out the current user's ID
          const otherUserIds = chatRoomData.membersUserIds.filter((e: string) => e != loginResponseModel);
  
          const updatedUnreadMessages = otherUserIds.map((userId: string) => {
            let unreadMessagesIds = chatRoomData.userUnreadMessages?.find((element: any) => element.userId === userId)?.unreadMessageIds || [];
  
            // Limit unread messages to 20
            if (unreadMessagesIds.length > 20) {
              unreadMessagesIds = unreadMessagesIds.slice(1);
            }
  
            return {
              userId: userId,
              unreadMessageIds: [messageModel.messageId, ...unreadMessagesIds]
            };
          });
  
          chatRoomRef.update({
            recentMessage: messageModel,
            "modifiedAtTimestampInMillis": messageModel.messageTimeStampInMillis,
            "userUnreadMessages": updatedUnreadMessages
          }).then(() => {
            console.log('Unread messages and recent message updated for other users.');
          }).catch(err => {
            console.error('Error updating unread messages:', err);
          });
        }
      });
    }
   
  }








  // @ViewChildren('message') messageElements!: QueryList<ElementRef>;

  // ngAfterViewInit(): void {
  //   // Scroll to the bottom after the view and child views are initialized
  //   this.scrollToBottom();
  // }

  // ngAfterViewChecked(): void {
  //   // Scroll to the bottom whenever the view is checked (e.g., when new messages are added)
  //   this.scrollToBottom();
  // }

  // scrollToBottom(): void {
  //   // Scroll to the bottom by setting the scrollTop property of the last message element
  //   const messageElementsArray = this.messageElements.toArray();
  //   if (messageElementsArray.length > 0) {
  //     const lastMessageElement = messageElementsArray[messageElementsArray.length - 1].nativeElement;
  //     lastMessageElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
  //   }
  // }
  //@ViewChild(ScrollToBottomDirective) scroll: ScrollToBottomDirective | undefined;
  @ViewChild('scrollMe') scrollContainer!: ElementRef;

  ngAfterViewInit() {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      // Using setTimeout to allow Angular to render the new elements before scrolling
      setTimeout(() => {
        this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
      }, 0);
    } catch (err) {
      console.error(err);
    }
  }

  //responsive hide/show
  openChat() {
    this.isChatActive = true;
  }
  closeChat() {
    this.isChatActive = false;
  }

  searchQuery = '';

  logOut() {
    this.loginService.logout();
  }

  showNotificationDrop: boolean = false;

  toggleNotificationDrop() {
    this.showNotificationDrop = !this.showNotificationDrop;
  }

  //bell notification
  bellNotifications: { content: string, createdAt: string, avatar_url: any }[] = [];

  bell(){
    this.userSer.getApi('/admin/notification').subscribe(response => {
      if (response.success) {
        this.bellNotifications = response.notifications.map((notification: any) => ({
          content: notification.content,
          createdAt: notification.createdAt,
          avatar_url: notification.byUser.avatar_url
        })).reverse();
      }
    });
  }

  newForm1!: FormGroup;
  @ViewChild('closeModal') closeModal!: ElementRef;

  initBellForm() {
    this.newForm1 = new FormGroup({
      body: new FormControl('', Validators.required),
    })
  }

  sendNotificationsToAll() {
    this.newForm1.markAllAsTouched();
    if (this.newForm1.valid) {
      const formURlData = new URLSearchParams();
      formURlData.set('body', this.newForm1.value.body)
      // console.log('formURlData.toString()', formURlData.toString())
      // return
      this.userSer.postAPI('/admin/sendNotification', formURlData.toString()).subscribe({
        next: (resp) => {
          if (resp.success === true) {
            this.closeModal.nativeElement.click();
            this.newForm1.reset();
            this.toastr.success(resp.message);
          } else {
            this.toastr.warning(resp.message);
          }
        },
        error: error => {
          this.toastr.error('Something went wrong.');
          console.log(error.message);
        }
      })
    }
  }

  isMenuActive: boolean = false;
  openMenuClick(){
    this.isMenuActive = !this.isMenuActive
  }
  closeMenuClick(){
    this.isMenuActive = !this.isMenuActive
  }

  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }


}
