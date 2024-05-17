import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/core/login/login.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent {

  profileForm!: FormGroup;

  constructor(private route: Router, private service: LoginService, private toastr: ToastrService) { }

  ngOnInit() {
    this.initForm()
  }

  initForm() {
    this.profileForm = new FormGroup({
      name: new FormControl('', Validators.required),
      partnerName: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
    });
  }

  onSubmit(){
    this.profileForm.markAllAsTouched();
  }

}
