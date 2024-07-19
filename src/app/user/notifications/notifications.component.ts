import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { ToastrService } from "ngx-toastr";
import { Router } from "@angular/router";
import { UserService } from "../../services/user.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent {

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
      title: new FormControl(0, Validators.required),
      tier: new FormControl(0, Validators.required),
      body: new FormControl('', Validators.required),
    })
  }


  handleCommittedFileInput(event: Event) {
    const inputElement = event.target as HTMLInputElement;
    if (inputElement.files && inputElement.files.length > 0) {
      this.UploadedFile = inputElement.files[0];
    }
  }

  addEvent() {
    this.newForm.markAllAsTouched();
    if (this.newForm.value.title == 0 || this.newForm.value.tier == 0) {
      this.toastr.warning('Please select all field.');
      return
    }
    if (this.newForm.valid) {
      const formURlData = new URLSearchParams();
      formURlData.set('title', this.newForm.value.title)
      formURlData.set('tier', this.newForm.value.tier)
      formURlData.set('body', this.newForm.value.body)
      // console.log('formURlData.toString()', formURlData.toString())
      // return
      this.service.postAPI('/admin/sendNotification', formURlData.toString()).subscribe({
        next: (resp) => {
          if (resp.success === true) {
            this.closeModal.nativeElement.click();
            this.newForm.reset();
            this.toastr.success(resp.message);
            this.getEventData();
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
