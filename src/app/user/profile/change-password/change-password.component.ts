import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/core/login/login.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {

  form!: FormGroup;
  passwordMismatch = false;

  constructor(private route: Router, private service: LoginService, private toastr: ToastrService) { }

  ngOnInit() {
    this.initForm()
  }

  initForm() {
    this.form = new FormGroup({
      current_password: new FormControl('', Validators.required),
      new_password: new FormControl('', Validators.required),
      confirm_password: new FormControl('', Validators.required),
    });

    this.form.get('confirm_password')?.setValidators([
      Validators.required,
      this.passwordMatchValidator()
    ]);
  }

  submitForm() {
    this.form.markAllAsTouched();
    if (this.form.valid && !this.passwordMismatch) {
      const formURlData = new URLSearchParams();
      //console.log()
      formURlData.set('current_password', this.form.value.current_password);
      formURlData.set('new_password', this.form.value.new_password);
      this.service.updatePassword(formURlData).subscribe({
        next: (resp) => {
          if (resp.status == 200) {
            this.toastr.success(resp.message);
            console.log(resp.message)
            this.form.reset();
            //this.closeModal.nativeElement.click();
          } else {
            this.toastr.warning(resp.message);
          }
        },
        error: (error) => {
          this.toastr.warning('Something went wrong.');
          console.error('Login error:', error.message);
        }
      });
    }
  }

  passwordMatchValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const password = this.form.get('new_password')?.value;
      const confirmPassword = control.value;
      if (password !== confirmPassword) {
        this.passwordMismatch = true;
        return { passwordMismatch: true };
      } else {
        this.passwordMismatch = false;
        return null;
      }
    };
  }

  isPasswordVisible1: boolean = false;

  togglePasswordVisibility1() {
    this.isPasswordVisible1 = !this.isPasswordVisible1;
  }

  isPasswordVisible2: boolean = false;

  togglePasswordVisibility2() {
    this.isPasswordVisible2 = !this.isPasswordVisible2;
  }

  isPasswordVisible3: boolean = false;

  togglePasswordVisibility3() {
    this.isPasswordVisible3 = !this.isPasswordVisible3;
  }

}
