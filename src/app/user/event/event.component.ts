import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-event',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.css']
})
export class EventComponent {

  // selectedTime: string = '';

  // logSelectedTime() {
  //   console.log('Selected Time:', this.selectedTime);
  // }
  newForm!: FormGroup
  updateForm!: FormGroup
  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild('closeModal2') closeModal2!: ElementRef;

  data: any[] = [];
  filteredData: any[] = [];
  searchQuery = '';
  UploadedFile!: File;
  updateDet: any;
  updateId: any;

  constructor(private route: Router, private service: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm();
    this.initUpdateForm();
    this.getEventData();
  }

  getEventData() {
    this.service.getApi('/admin/events').subscribe({
      next: resp => {
        this.data = resp.events.reverse();
      },
      error: error => {
        console.log(error.message)
      }
    });
  }

  initForm() {
    this.newForm = new FormGroup({
      title: new FormControl('', Validators.required),
      date: new FormControl('', Validators.required),
      time: new FormControl('', Validators.required),
      image: new FormControl(null),
    })
  }

  initUpdateForm() {
    this.updateForm = new FormGroup({
      title: new FormControl(this.updateDet?.title, Validators.required),
      date: new FormControl(this.updateDet?.date, Validators.required),
      time: new FormControl(this.updateDet?.time, Validators.required),
      image: new FormControl(null),
    })
  }

  // handleCommittedFileInput1(event: any) {
  //   const file = event.target.files[0];
  //   this.updateForm.get('image')?.setValue(file);
  // }


  handleCommittedFileInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.UploadedFile = inputElement.files[0];
    }
  }

  addEvent() {
    this.newForm.markAllAsTouched();
    if (this.newForm.valid) {
      const formURlData = new FormData();
      formURlData.set('title', this.newForm.value.title)
      formURlData.set('date', this.newForm.value.date)
      formURlData.append('image', this.UploadedFile);
      formURlData.set('time', this.newForm.value.time)
      this.service.postAPIFormData('/admin/addEvent', formURlData).subscribe({
        next: (resp) => {
          if (resp.success === true) {
            this.closeModal.nativeElement.click();
          }
          this.newForm.reset();
          this.toastr.success(resp.message);
          this.getEventData()
        },
        error: error => {
          this.toastr.warning('Something went wrong.');
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
      formURlData.set('date', this.updateForm.value.date)
      if(this.UploadedFile){
        formURlData.append('image', this.UploadedFile);
      }
      //formURlData.append('image', this.UploadedFile);
      formURlData.set('time', this.updateForm.value.time)
      formURlData.set('eventId', this.updateId)
      this.service.postAPIFormData('/admin/editEvent', formURlData).subscribe({
        next: (resp) => {
          if (resp.success === true) {
            this.closeModal2.nativeElement.click();
            // this.toastr.success(resp.message);
            this.toastr.success('Update successful!');
            this.getEventData()
          } else {
            this.toastr.warning(resp.message);
          }
          //this.newForm.reset();  
        },
        error: error => {
          this.toastr.error('Something went wrong.');
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
          this.service.gdeleteApi(`/admin/event/${id}`).subscribe({
            next: resp => {
              console.log(resp)
              this.toastr.success(resp.message)
              this.getEventData();
            },
            error: error => {
              console.log(error.message)
            }
          });
        }
      });
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
