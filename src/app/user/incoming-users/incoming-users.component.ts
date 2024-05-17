import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-incoming-users',
  templateUrl: './incoming-users.component.html',
  styleUrls: ['./incoming-users.component.css']
})
export class IncomingUsersComponent {

  data: any[] = [];

  constructor(private route: Router, private service: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
    //this.initForm();
    this.getUser();
  }

  getUser() {
    this.service.getApi('/admin/entryRequests').subscribe({
      next: resp => {
        this.data = resp.entryRequests;
      },
      error: error => {
        console.log(error.message)
      }
    });
  }

}
