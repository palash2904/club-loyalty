import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
import * as firebase from 'firebase/compat';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  apiUrl = environment.baseUrl

  //messaging = firebase.messaging();

  constructor(private http: HttpClient, private afMessaging: AngularFireMessaging, private toastr: ToastrService) {
    // this.afMessaging.messaging.subscribe(
    //   (_messaging) => {
    //   _messaging.onMessage = _messaging.onMessage.bind(_messaging);
    //   _messaging.onTokenRefresh = _messaging.onTokenRefresh.bind(_messaging);
    //   }
    //   )
   }

  getApi(url:any):Observable<any>{
    return this.http.get(this.apiUrl + url )
  };

  gdeleteApi(url:any):Observable<any>{
    return this.http.delete(this.apiUrl + url )
  };
  
  postAPI(url:any, data:any):Observable<any>{
    return this.http.post(this.apiUrl + url ,data )
  };

  currentMessage = new BehaviorSubject(null);


  requestPermission() {
    this.afMessaging.requestToken.subscribe(
    (token) => {
    console.log(token);
    },
    (err) => {
    console.error('Unable to get permission to notify.', err);
    }
    );
    }
    receiveMessage() {
    this.afMessaging.messages.subscribe(
    (payload: any) => {
    console.log("new message received. ", payload);
    this.currentMessage.next(payload);
    })
    }
  
  
}
