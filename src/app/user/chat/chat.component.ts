import { Component, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Observable, map, take } from 'rxjs';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Router } from '@angular/router';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import * as firebase from 'firebase/compat';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
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

  constructor(private userSer: UserService, private firestore: AngularFirestore, private router: Router, private afMessaging: AngularFireMessaging, private toastr: ToastrService) {
    // Get a reference to the chatrooms collection
    const chatroomsCollection: AngularFirestoreCollection<any> = this.firestore.collection('chatRooms');

    // Query the collection and assign the result to the Observable
    this.chatrooms$ = chatroomsCollection.valueChanges();

    // Subscribe to the Observable and print the result in the console
    this.chatrooms$.subscribe(chatrooms => {
      //console.log('Chatrooms id:', chatrooms);
      this.roomId = chatrooms
      console.log('roomId', this.roomId)
    });

    //this.userSer.requestPermission();

    this.afMessaging.messages.subscribe((message) => {
      console.log('New message received:', message);
      // Show a notification to the user
      //this.showNotification(message);
    });


    this.afMessaging.requestToken
      .subscribe(
        (token) => {
          console.log('Permission granted! Save to the server!', token);
          // Save the token to your server or use it as needed
        },
        (error) => {
          console.error('Permission denied', error);
        }
      );

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


  getChatMsg() {
    const chatroomsMessages: AngularFirestoreCollection<any> = this.firestore.collection('chatRooms').doc(this.chatId).collection("messages", ref =>
      ref.orderBy('messageTimeStampInMillis', 'desc'));
    this.chatMessages$ = chatroomsMessages.valueChanges().pipe(
      map(chatmag => chatmag.reverse())
    );

    this.chatMessages$.subscribe(chatmag => {
      console.log('Chatrooms msg:', chatmag);
      this.roomMsg = chatmag;
      console.log('roomMsg', this.roomMsg)
    });
  }

  formatTimestamp(timestamp: number): string {
    const date = new Date(timestamp);
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
  }


  getChatId(id: any) {
    this.chatId = id;
    this.getChatMsg();
  }



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
    console.log('documentReference', documentReference)

    const messageModel = {
      messageId: documentReference.ref.id,
      messageContent: messageContent,
      senderId: this.userId.toString(),
      messageTimeStampInMillis: new Date().getTime()
      //event: event ? event.toJson() : null
    };
    console.log('messageModel', messageModel)
    //return

    // Add the new message document to the messages subcollection
    messagesCollection.add(messageModel)
      .then(() => {
        console.log('Message sent successfully!');
        // Clear the message input field after sending
        this.newForm.patchValue({ message: '' });
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

  // async sendMessage(senderId: string, chatRoomModel: ChatRoomModel, messageContent: string, event?: Event) {
  //   if (messageContent.trim().isEmpty) {
  //     return;
  //   }

  //   const batch = this.firestore.firestore.batch();
  //   const documentReference = this.firestore.collection("chatRooms").doc(chatRoomModel.chatRoomId).collection("messages").doc();

  //   const messageModel: MessageModel = {
  //     messageId: documentReference.id,
  //     messageContent: messageContent,
  //     senderId: senderId,
  //     messageTimeStampInMillis: firebase.firestore.Timestamp.now().toMillis(),
  //     event: event ? event.toJson() : null
  //   };

  //   batch.set(
  //     documentReference.ref,
  //     messageModel
  //   );

  //   batch.update(this.firestore.collection("chatRooms").doc(chatRoomModel.chatRoomId).ref, {
  //     recentMessage: messageModel
  //   });

  //   await batch.commit();
  // }

  // navigateToChatbox(roomId: string) {
  //   this.router.navigate(['/main/chatbox', roomId]);
  // }


}
