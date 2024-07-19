import { DatePipe } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.component.html',
  styleUrls: ['./offers.component.css'],
  providers: [DatePipe] 
})
export class OffersComponent {

  newForm!: FormGroup
  updateForm!: FormGroup
  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild('closeModal2') closeModal2!: ElementRef;
  UploadedFile!: File;
  data: any[] = [];
  updateDet: any;
  updateId: any;

  constructor(private route: Router, private service: UserService, private toastr: ToastrService, private datePipe: DatePipe) { }

  ngOnInit(): void {
    this.initForm();
    this.initUpdateForm();
    this.getOfferData();
  }

  initForm() {
    this.newForm = new FormGroup({
      title: new FormControl('', Validators.required),
      price: new FormControl('', Validators.required),
      offerPrice: new FormControl('', Validators.required),
      endDate: new FormControl('', Validators.required),
      //points: new FormControl('', Validators.required),
      image: new FormControl(null)
    })
  }

  initUpdateForm() {
    this.updateForm = new FormGroup({
      title: new FormControl(this.updateDet?.title, Validators.required),
      price: new FormControl(this.updateDet?.price, Validators.required),
      offerPrice: new FormControl(this.updateDet?.offerPrice, Validators.required),
      endDate: new FormControl(this.updateDet?.endDate, Validators.required),
      //points: new FormControl(this.updateDet?.points, Validators.required),
      image: new FormControl(null)
    })
  }

  getOfferData() {
    this.service.getApi('/admin/offers').subscribe({
      next: resp => {
        this.data = resp.offers.reverse();
      },
      error: error => {
        console.log(error.message)
      }
    });
  }


  handleCommittedFileInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.UploadedFile = inputElement.files[0];
    }
  }

  onSubmit() {
    this.newForm.markAllAsTouched();
    if (this.newForm.valid) {
      const formURlData = new FormData();
      formURlData.set('title', this.newForm.value.title)
      formURlData.set('price', `€${this.newForm.value.price}`);
      formURlData.set('offerPrice', `€${this.newForm.value.offerPrice}`);
      formURlData.set('endDate', this.newForm.value.endDate)
      //formURlData.set('points', this.newForm.value.points)
      formURlData.append('image', this.UploadedFile);
      console.log('formURlData', formURlData)
      //return
      this.service.postAPIFormData('/admin/addOffer', formURlData).subscribe({
        next: (resp) => {
          if (resp.success === true) {
            this.closeModal.nativeElement.click();
            this.newForm.reset();
            this.toastr.success(resp.message);
            this.getOfferData();
          } else {
            this.toastr.warning(resp.message);
          }
        },
        error: error => {
          this.toastr.error('Something went wrong.');
          console.log(error.message)
        }
      })
    }
  }

  patchUpdate(details: any) {
    this.updateDet = details;
    this.updateId = details.id;
    this.initUpdateForm(); 
  }

  onUpdate() {
    this.updateForm.markAllAsTouched();
    if (this.updateForm.valid) {
      const formURlData = new FormData();
      formURlData.set('title', this.updateForm.value.title)
      formURlData.set('price', this.updateForm.value.price)
      formURlData.set('endDate', this.updateForm.value.endDate)
      //formURlData.set('points', this.updateForm.value.points)
      if (this.UploadedFile) {
        formURlData.append('image', this.UploadedFile);
      }
      //formURlData.append('image', this.UploadedFile);
      formURlData.set('offerPrice', this.updateForm.value.offerPrice)
      formURlData.set('offerId', this.updateId)
      this.service.postAPIFormData('/admin/editOffer', formURlData).subscribe({
        next: (resp) => {
          if (resp.success === true) {
            this.closeModal2.nativeElement.click();
            // this.toastr.success(resp.message);
            this.toastr.success('Update successful!');
            this.getOfferData()
          } else {
            this.toastr.success(resp.message);
          }
          //this.newForm.reset();  
        },
        error: error => {
          this.toastr.warning('Something went wrong.');
          console.log(error.message)
        }
      })
    }
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
      .then((result) => {
        if (result.isConfirmed) {
          const formURlData = new URLSearchParams();
          formURlData.set('id', id);
          this.service.gdeleteApi(`/admin/offer/${id}`).subscribe({
            next: resp => {
              console.log(resp)
              this.toastr.success(resp.message)
              this.getOfferData();
            },
            error: error => {
              console.log(error.message)
            }
          });
        }
      });
  }

  getLevel(points: number): string {
    if (points = 15) {
      return 'Level 3';
    } else if (points = 10) {
      return 'Level 2';
    } else if (points = 5) {
      return 'Level 1';
    } else {
      return '';
    }
  }

  handleFileInput(event: any) {
    const file = event.target.files[0];
    const img = document.getElementById('blah') as HTMLImageElement;

    if (img && file) {
      img.style.display = 'block';
      const reader = new FileReader();
      reader.onload = (e: any) => {
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }

    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.UploadedFile = inputElement.files[0];
    }

  }


}
