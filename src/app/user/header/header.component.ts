import { Component, computed, effect, ElementRef, EventEmitter, Output, signal, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/core/login/login.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  @Output() toggleEvent = new EventEmitter<boolean>();

  newForm!: FormGroup;
  @ViewChild('closeModal') closeModal!: ElementRef;

  notify: boolean = false;

  toggleMenu() {
    this.toggleEvent.emit(true); // Emit event to parent component
  }


  users: any;
  events: any;
  offers: any;
  scratchCards: any;
  notifications: { content: string, createdAt: string, avatar_url: any }[] = [];
  notifications1: any[] = [];

  constructor(private service: LoginService, public userService: UserService, private toastr: ToastrService) {
    this.userService.getApi('/admin/notification').subscribe(response => {
      if (response.success) {
        this.notifications = response.notifications.map((notification: any) => ({
          content: notification.content,
          createdAt: notification.createdAt,
          avatar_url: notification.byUser.avatar_url
        })).reverse();
      }
    });

    effect(() => {
      this.userService.totalMessagesSignal()
    });
    // this.notifications1 = this.userService.getMsgNotif()
    // console.log('this.notifications1====>', this.notifications1)
  }

  count: any;

  ngOnInit() {
    this.userService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
    });
    this.count = localStorage.getItem('unreadMsgs');
    this.initForm();
  }

  initForm() {
    this.newForm = new FormGroup({
      body: new FormControl('', Validators.required),
    })
  }

  addEvent() {
    this.newForm.markAllAsTouched();
    if (this.newForm.valid) {
      const formURlData = new URLSearchParams();
      formURlData.set('body', this.newForm.value.body)
      // console.log('formURlData.toString()', formURlData.toString())
      // return
      this.userService.postAPI('/admin/sendNotification', formURlData.toString()).subscribe({
        next: (resp) => {
          if (resp.success === true) {
            this.closeModal.nativeElement.click();
            this.newForm.reset();
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

  click() {
    this.userService.totalMessagesSignal.set(0)
    this.notify = false;
    console.log('this.notify click', this.notify)
  }

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
