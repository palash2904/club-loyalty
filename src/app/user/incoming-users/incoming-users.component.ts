import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-incoming-users',
  templateUrl: './incoming-users.component.html',
  styleUrls: ['./incoming-users.component.css']
})
export class IncomingUsersComponent {

  data: any[] = [];

  constructor(private route: Router, private service: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
    //this.service.setNot(true)
    //this.initForm();
    this.getUser();
  }

  getUser() {
    this.service.getApi('/admin/entryRequests').subscribe({
      next: resp => {
        this.data = resp.entryRequests.map((request: { user: any; status: any; }) => ({
          ...request.user,
          status: request.status
        }));
        //console.log(this.data);
      },
      error: error => {
        console.log(error.message);
      }
    });
  }

  acceptUser(id: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
    });

    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You want to accept this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      cancelButtonText: "No!",
      reverseButtons: true,
      confirmButtonColor: "#b92525",
    })
      .then((result) => {
        if (result.isConfirmed) {
          const formURlData = new URLSearchParams();
          formURlData.set('id', id);
          this.service.postAPI(`/admin/addPoint/${id}`, null).subscribe({
            next: resp => {
              console.log(resp);
              this.toastr.success(resp.message);
              this.getUser();
              this.service.setNot(true);
            },
            error: error => {
              this.toastr.error('Something went wrong!');
              console.log(error.message);
            }
          });
        }
      });
  }

  rejectUser(id: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
    });

    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You want to accept this user!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes!",
      cancelButtonText: "No!",
      reverseButtons: true,
      confirmButtonColor: "#b92525",
    })
      .then((result) => {
        if (result.isConfirmed) {
          const formURlData = new URLSearchParams();
          formURlData.set('id', id);
          this.service.postAPI(`/admin/rejectEntry/${id}`, null).subscribe({
            next: resp => {
              console.log(resp)
              this.toastr.success(resp.message)
              this.getUser();
            },
            error: error => {
              console.log(error.message)
            }
          });
        }
      });
  }

}
