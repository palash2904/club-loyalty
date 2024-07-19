import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/compat/messaging';
//import { AngularFireMessaging } from '@angular/fire/messaging';
import * as firebase from 'firebase/compat';
import { ToastrService } from 'ngx-toastr';
import { BehaviorSubject, Observable, Subject, take } from 'rxjs';
import { getMessaging, getToken } from 'firebase/messaging'
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  totalMessagesSignal = signal(0);
  apiUrl = environment.baseUrl

  constructor(private http: HttpClient, private toastr: ToastrService, private afMessaging: AngularFireMessaging) { }


  getApi(url: any): Observable<any> {
    const authToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.get(this.apiUrl + url, { headers: headers })
  };

  notifySer(url: any): Observable<any> {
    const authToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.get(this.apiUrl + url, { headers: headers })
  }

  getApi1(url: any): Observable<any> {
    const authToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.get(url, { headers: headers })
  };

  gdeleteApi(url: any): Observable<any> {
    const authToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.delete(this.apiUrl + url, { headers: headers })
  };

  postAPI(url: any, data: any): Observable<any> {
    const authToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.post(this.apiUrl + url, data, { headers: headers })
  };

  postAPIFormData(url: any, data: any): Observable<any> {
    const authToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.post(this.apiUrl + url, data, { headers: headers })
  };

  postAPIJson(url: any, data: any): Observable<any> {
    const authToken = localStorage.getItem('token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${authToken}`
    });
    return this.http.post(this.apiUrl + url, data, { headers: headers });
  }

  // postApi2(url: any): Observable<any> {
  //   const authToken = localStorage.getItem('token');
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/x-www-form-urlencoded',
  //     'Authorization': `Bearer ${authToken}`
  //   });
  //   return this.http.post(this.apiUrl + url, { headers: headers })
  // };

  currentMessage = new BehaviorSubject(null);

  requestPermission() {
    const messaging = getMessaging();
    getToken(messaging, { vapidKey: environment.firebaseConfig.vapidKey }).then(
      (currentToken) => {
        if (currentToken) {
          console.log('tokehuyiyiiuiuin');
          console.log(currentToken);
          localStorage.setItem('notifyToken', currentToken)
        } else {
          console.log('tokehuyiyiiuiuin');
        }
      }
    )
  }

  // requestPermission() {
  //   this.afMessaging.requestToken.subscribe(
  //       (token) => {
  //         console.log('FCM Token:', token);
  //         // Store or send the token to your server for later use
  //       },
  //       (error) => {
  //         console.error('Error obtaining FCM token', error);
  //         this.toastr.error('Unable to get notification permission. Please enable it in your browser settings.');
  //       }
  //     );
  // }

  listen() {
    this.afMessaging.messages
      .subscribe(
        (message) => {
          console.log('New message:', message);
          this.toastr.info('New notification received');
        },
        (error) => {
          console.error('Error receiving message', error);
        }
      );
  }


  notify: boolean = false;

  setNot(not: boolean) {
    //console.log('this.not====>', not)
    this.notify = not;
  }

  getNot() {
    //console.log('this.notify====>', this.notify)
    return this.notify;
  }

  // notification: any[] = [];

  // setMsgNotif(notify: any) {
  //   this.notification = notify;
  // }

  // getMsgNotif() {
  //   //console.log('this.notify====>', this.notify)
  //   return this.notification;
  // }
  private notificationsSource = new Subject<any[]>();
  notifications$ = this.notificationsSource.asObservable();

  setNotifications(notifications: any[]) {
    this.notificationsSource.next(notifications);
  }

}
