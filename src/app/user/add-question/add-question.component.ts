import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-question',
  templateUrl: './add-question.component.html',
  styleUrls: ['./add-question.component.css']
})
export class AddQuestionComponent {

  newForm!: FormGroup
  updateForm!: FormGroup
  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild('closeModal2') closeModal2!: ElementRef;
  data: any[] = [];
  updateDet: any;
  updateId: any;

  constructor(private route: Router, private service: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm();
    this.initUpdateForm();
    this.getQuestionData();
  }

  initForm() {
    this.newForm = new FormGroup({
      title: new FormControl('', Validators.required),
      option1: new FormControl('', Validators.required),
      option2: new FormControl('', Validators.required),
      option3: new FormControl('', Validators.required),
      option4: new FormControl('', Validators.required),
    })
  }

  initUpdateForm() {
    this.updateForm = new FormGroup({
      title: new FormControl(this.updateDet?.title, Validators.required),
      option1: new FormControl(this.updateDet?.option_1, Validators.required),
      option2: new FormControl(this.updateDet?.option_2, Validators.required),
      option3: new FormControl(this.updateDet?.option_3, Validators.required),
      option4: new FormControl(this.updateDet?.option_4, Validators.required),
    })
  }

  getQuestionData() {
    this.service.getApi('/admin/questions').subscribe({
      next: resp => {
        this.data = resp.questions.reverse();
      },
      error: error => {
        console.log(error.message)
      }
    });
  }

  onSubmit() {
    this.newForm.markAllAsTouched();
    //return
    if (this.newForm.valid) {
      const formURlData = new URLSearchParams();
      formURlData.set('title', this.newForm.value.title)
      formURlData.set('option_1', this.newForm.value.option1)
      formURlData.set('option_2', this.newForm.value.option2)
      formURlData.set('option_3', this.newForm.value.option3)
      formURlData.set('option_4', this.newForm.value.option4)
      this.service.postAPI('/admin/addQuestions',formURlData).subscribe({
        next: (resp) => {
          if (resp.success === true) {
            this.closeModal.nativeElement.click();
            this.newForm.reset();
            this.getQuestionData();
            this.toastr.success(resp.message);
          } else {
            this.toastr.warning(resp.message);
            this.getQuestionData();
          }
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
          this.service.gdeleteApi(`/admin/question/${id}`).subscribe({
            next: resp => {
              console.log(resp)
              this.toastr.success(resp.message)
              this.getQuestionData();
            },
            error: error => {
              console.log(error.message)
            }
          });
        }
      });
  }

  patchUpdate(details: any) {
    this.updateDet = details;
    this.updateId = details.id;
    this.initUpdateForm();
  }

  onUpdate() {
    this.updateForm.markAllAsTouched();
    if (this.updateForm.valid) {
      const formURlData = new URLSearchParams();
      formURlData.set('title', this.updateForm.value.title)
      formURlData.set('option_1', this.updateForm.value.option1)
      formURlData.set('option_2', this.updateForm.value.option2)
      formURlData.set('option_3', this.updateForm.value.option3)
      formURlData.set('option_4', this.updateForm.value.option4)
      formURlData.set('questionId', this.updateId)
      this.service.postAPI('/admin/editQuestion', formURlData).subscribe({
        next: (resp) => {
          if (resp.success === true) {
            this.closeModal2.nativeElement.click();
            // this.toastr.success(resp.message);
            this.toastr.success('Update successful!');
            this.getQuestionData();
          } else {
            this.toastr.warning('Update successful!');
          }  
        },
        error: error => {
          this.toastr.error('Something went wrong.');
          console.log(error.message)
        }
      })
    }
  }


}
