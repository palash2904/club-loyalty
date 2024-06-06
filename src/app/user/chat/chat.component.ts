import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Observable, map, take } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase/compat';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// import * as functions from 'firebase-functions';
// import * as admin from 'firebase-admin';
//admin.initializeApp();

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {

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


  constructor(private userSer: UserService, private firestore: AngularFirestore, private router: Router, private afMessaging: AngularFireMessaging, private toastr: ToastrService, private http: HttpClient) {
    // Get a reference to the chatrooms collection
    const chatroomsCollection: AngularFirestoreCollection<any> = this.firestore.collection('chatRooms');
    //const chatroomsCollection: AngularFirestoreCollection<any> = this.firestore.collection('chatRooms', ref => ref.orderBy('modifiedAtTimestampInMillis', 'desc'));

    
    // Query the collection and assign the result to the Observable
    this.chatrooms$ = chatroomsCollection.valueChanges();

    // Subscribe to the Observable and print the result in the console
    this.chatrooms$.subscribe(chatrooms => {

      this.roomId = chatrooms;
      console.log('this.roomId', this.roomId);

      const createdByUserIds: any[] = chatrooms.map(chatroom => Number(chatroom.createdByUserId));

      // Log the resulting array of createdByUserIds
      //console.log('createdByUserIds', createdByUserIds);


      this.sendIdsToApi(createdByUserIds);
    });

    //this.userSer.requestPermission();

  }

  ngOnInit(): void {

    this.initForm();

    this.userDet = localStorage.getItem('userDetail');
    const parsedData = JSON.parse(this.userDet);
    this.userId = parsedData['id']
    //console.log('this.userId', this.userId)

  }

  initForm() {
    this.newForm = new FormGroup({
      message: new FormControl(''),
      file: new FormControl(null),
    })
  }


  sendIdsToApi(ids: number[]) {
    const data = { ids };

    this.userSer.postAPIJson('/admin/getUsersWithIds', data).subscribe({
      next: (resp) => {
        this.userData = resp.users;
        //console.log('API response:', this.userData);
        // if (this.userData.length > 0) {
        //   this.selectUser(this.userData[0]);
        // }
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
        title: this.title
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
    this.selectedUser = user;
    //console.log('Selected user:', this.selectedUser);
    this.to = user.fcm_token;
    this.title = user.full_name
    this.getChatId(user.id, user.avatar_url, user.full_name);
  }


  getChatId(id: any, img: any, name: any) {
    this.chatId = JSON.stringify(id);
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
      //console.log('Chatrooms msg:', chatmag);
      this.roomMsg = chatmag;
      //console.log('roomMsg', this.roomMsg)

      //this.incrementNewMessageCount(this.selectedUser.id);

    });
  }

  formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }


  // newMessageCounts: { [userId: string]: number } = {};

  // updateNewMessageCount(userId: string) {
  //   // Reset the new message count for the selected user
  //   this.newMessageCounts[userId] = 0;
  // }

  // incrementNewMessageCount(userId: string) {
  //   // Increment the new message count for the user
  //   this.newMessageCounts[userId] = (this.newMessageCounts[userId] || 0) + 1;
  // }


  // handleCommittedFileInput(event: Event) {
  //   const inputElement = event.target as HTMLInputElement;
  //   if (inputElement.files && inputElement.files.length > 0) {
  //     this.UploadedFile = inputElement.files[0];
  //   }
  // }

  // Send message
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
    // const documentReference = this.firestore.collection("chatRooms").doc(this.chatId).collection("messages").doc();
    const documentReference = this.firestore.collection("chatRooms").doc(this.chatId).collection("messages");
    //console.log('documentReference', documentReference)

    const messageModel = {
      messageId: documentReference.ref.id,
      messageContent: messageContent,
      senderId: this.userId.toString(),
      messageTimeStampInMillis: new Date().getTime()
      //event: event ? event.toJson() : null
    };
    //console.log('messageModel', messageModel)
    //return

    // Add the new message document to the messages subcollection
    messagesCollection.add(messageModel)
      .then(() => {
        console.log('Message sent successfully!');
        // Clear the message input field after sending
        this.newForm.patchValue({ message: '' });
        this.sendNotification();
      })
      .catch(error => {
        console.error('Error sending message:', error);
      });
  }



  @ViewChildren('message') messageElements!: QueryList<ElementRef>;

  ngAfterViewInit(): void {
    // Scroll to the bottom after the view and child views are initialized
    this.scrollToBottom();
  }

  ngAfterViewChecked(): void {
    // Scroll to the bottom whenever the view is checked (e.g., when new messages are added)
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    // Scroll to the bottom by setting the scrollTop property of the last message element
    const messageElementsArray = this.messageElements.toArray();
    if (messageElementsArray.length > 0) {
      const lastMessageElement = messageElementsArray[messageElementsArray.length - 1].nativeElement;
      lastMessageElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }




}
