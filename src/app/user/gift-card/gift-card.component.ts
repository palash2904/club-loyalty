import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-gift-card',
  templateUrl: './gift-card.component.html',
  styleUrls: ['./gift-card.component.css']
})
export class GiftCardComponent {

  newForm!: FormGroup
  @ViewChild('closeModal') closeModal!: ElementRef;

  constructor(private route: Router, private service: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm();
    //this.getSupplyData()
  }

  initForm() {
    this.newForm = new FormGroup({
      title: new FormControl('', Validators.required),
      points: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
    })
  }

  onSubmit() {
    this.newForm.markAllAsTouched();
    //return
    if (this.newForm.valid) {
      const formURlData = new URLSearchParams();
      formURlData.set('title', this.newForm.value.title)
      formURlData.set('endDate', this.newForm.value.endDate)
      formURlData.set('points', this.newForm.value.points)
      this.service.postAPI('/admin/addScratchCard',formURlData).subscribe({
        next: (resp) => {
          if (resp.success === true) {
            this.closeModal.nativeElement.click();
            this.newForm.reset();
          }
          
          this.toastr.success(resp.message);
          //this.getSupplyData()
        },
        error: error => {
          this.toastr.warning('Something went wrong.');
          console.log(error.message)
        }
      })
    }
  }

  deleteField(id?: any) {
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
      //     this.service.gdeleteApi(`/admin/user/${id}`).subscribe({
      //       next: resp => {
      //         console.log(resp)
      //         this.toastr.success(resp.message)
      //         this.getUsersData();
      //       },
      //       error: error => {
      //         console.log(error.message)
      //       }
      //     });
      //   }
      // });
  }


}
