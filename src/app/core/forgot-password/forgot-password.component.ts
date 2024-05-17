import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from '../login/login.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css']
})
export class ForgotPasswordComponent {

  isPasswordVisible: boolean = false;
  loginForm!: FormGroup

  constructor(private route: Router, private srevice: LoginService, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    })
  }


  onSubmit(){
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      //this.loading = true;
      const formURlData = new URLSearchParams();
      formURlData.set('email', this.loginForm.value.email);
      formURlData.set('password', this.loginForm.value.password);
      this.srevice.resetPassword(formURlData.toString()).subscribe({
        next: (resp) => {
          if (resp.success == true) {
            //this.route.navigateByUrl("/user/main/dashboard");
            //localStorage.setItem('userDetail', JSON.stringify(resp.admin));
            //this.srevice.setToken(resp.token);
            this.toastr.success(resp.message);
            //this.loading = false;
          } else {
            this.toastr.warning(resp.message);
            //this.loading = false;
          }
        },
        error: (error) => {
          this.toastr.warning('Something went wrong.');
          console.error('Login error:', error.message);
        }
      });
    }
  }


  togglePasswordVisibility() {
    this.isPasswordVisible = !this.isPasswordVisible;
  }

}
