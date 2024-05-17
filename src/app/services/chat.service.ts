import { Injectable } from '@angular/core';
//import { AngularFireDatabase } from 'angularfire2/database';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  chatMessages!: AngularFireList<any>;

  constructor(db: AngularFireDatabase) {
    this.chatMessages = db.list('/messages');
  }
  

}
