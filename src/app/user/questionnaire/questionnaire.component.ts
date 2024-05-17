import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-questionnaire',
  templateUrl: './questionnaire.component.html',
  styleUrls: ['./questionnaire.component.css']
})
export class QuestionnaireComponent {

  data: any[] = [];

  constructor(private route: Router, private service: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.getEventData();
  }

  getEventData() {
    this.service.getApi('/admin/events').subscribe({
      next: resp => {
        this.data = resp.events;
      },
      error: error => {
        console.log(error.message)
      }
    });
  }

  deleteField(id: any) {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger"
      },
    });

    swalWithBootstrapButtons.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
      confirmButtonColor: "#b92525",
    })
      // .then((result) => {
      //   if (result.isConfirmed) {
      //     const formURlData = new URLSearchParams();
      //     formURlData.set('id', id);
      //     this.service.gdeleteApi(`/admin/event/${id}`).subscribe({
      //       next: resp => {
      //         console.log(resp)
      //         this.toastr.success(resp.message)
      //         this.getEventData();
      //       },
      //       error: error => {
      //         console.log(error.message)
      //       }
      //     });
      //   }
      // });
  }


}
