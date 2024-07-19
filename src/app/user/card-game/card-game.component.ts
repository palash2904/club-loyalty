import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UserService } from 'src/app/services/user.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-card-game',
  templateUrl: './card-game.component.html',
  styleUrls: ['./card-game.component.css']
})
export class CardGameComponent {

  newForm!: FormGroup;
  updateForm!: FormGroup;
  data: any[] = [];
  @ViewChild('closeModal') closeModal!: ElementRef;
  @ViewChild('closeModal1') closeModal1!: ElementRef;
  updateDet: any;
  updateId: any;

  constructor(private route: Router, private service: UserService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm();
    this.initUpdateForm();
    this.getScratchData();
  }

  initForm() {
    this.newForm = new FormGroup({
      title: new FormControl('', Validators.required),
      //successRate: new FormControl('', Validators.required),
      successRate: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]*$'), // Only allow whole numbers
        this.rangeValidator(1, 100) // Custom validator to check the range
      ])
    })
  }

  rangeValidator(min: number, max: number) {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value && (isNaN(control.value) || control.value < min || control.value > max)) {
        return { 'range': true };
      }
      return null;
    };
  }

  initUpdateForm() {
    this.updateForm = new FormGroup({
      title: new FormControl(this.updateDet?.title, Validators.required),
      successRate: new FormControl((this.updateDet?.successRate * 100), Validators.required)
    })
  }

  getScratchData() {
    this.service.getApi('/admin/giftCard').subscribe({
      next: resp => {
        this.data = resp.giftCards.reverse();
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
      const sus = this.newForm.value.successRate / 100;
      formURlData.set('successRate', JSON.stringify(sus))
      this.service.postAPI('/admin/addGiftCard', formURlData).subscribe({
        next: (resp) => {
          if (resp.success === true) {
            this.closeModal.nativeElement.click();
            this.newForm.reset();
            this.toastr.success(resp.message);
            this.getScratchData();
          } else {
            this.getScratchData();
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
      const formURlData = new URLSearchParams();
      formURlData.set('title', this.updateForm.value.title)
      const sus = this.updateForm.value.successRate / 100
      formURlData.set('successRate', JSON.stringify(sus))
      formURlData.set('id', this.updateId)
      this.service.postAPI('/admin/editGiftCard', formURlData).subscribe({
        next: (resp) => {
          if (resp.success === true) {
            this.closeModal1.nativeElement.click();
            // this.toastr.success(resp.message);
            this.toastr.success('Update successful!');
            this.getScratchData()
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
          this.service.gdeleteApi(`/admin/giftCard/${id}`).subscribe({
            next: resp => {
              console.log(resp)
              this.toastr.success(resp.message)
              this.getScratchData();
            },
            error: error => {
              console.log(error.message)
            }
          });
        }
      });
  }

}
