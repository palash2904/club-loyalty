import { Component } from '@angular/core';
import { LoginService } from 'src/app/core/login/login.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  users: any;
  events: any;
  offers: any;
  scratchCards: any;

  constructor(private service: LoginService, private userService: UserService) { }

  logOut() {
    this.service.logout();
  }

  showNotificationDrop: boolean = false;

  toggleNotificationDrop() {
    console.log('jkkjh')

    this.showNotificationDrop = !this.showNotificationDrop;
  }

  getEventData() {
    this.userService.getApi('/admin/home').subscribe({
      next: resp => {
        this.users = resp.users;
        this.events = resp.events;
        this.offers = resp.offers;
        this.scratchCards = resp.scratchCards;
      },
      error: error => {
        console.log(error.message)
      }
    });
  }


}
