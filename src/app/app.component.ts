import { Component } from '@angular/core';
import { UserService } from './services/user.service';
import { getMessaging, getToken } from 'firebase/messaging'
import { from } from 'rxjs';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'loyal-club-ui';
  constructor(
    public messagingService: UserService
  ) { }


  ngOnInit(): void {
    // this.messagingService.requestPermission();
    // this.messagingService.listen();
    this.requestPermission();
  }

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


}
