import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from 'src/app/core/login/login.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-my-profile',
  templateUrl: './my-profile.component.html',
  styleUrls: ['./my-profile.component.css']
})
export class MyProfileComponent implements OnInit {

  profileForm!: FormGroup;
  userDet: any;
  userEmail: any;
  name: any;
  phone: any;
  gender: any;

  day1Start: any;
  day1End: any;
  day2Start: any;
  day2End: any;
  time1Start: any;
  time1End: any;
  time2Start: any;
  time2End: any;


  constructor(private route: Router, private service: LoginService, private toastr: ToastrService, private service1: UserService) { }

  ngOnInit() {
    this.initForm();
    this.loadUserProfile();
  }

  initForm() {
    this.profileForm = new FormGroup({
      name: new FormControl('', Validators.required),
      gender: new FormControl('', Validators.required),
      phone: new FormControl('', Validators.required),
      email: new FormControl({value: '', disabled: true}, ),
      form1: new FormControl('', Validators.required),
      to1: new FormControl('', Validators.required),
      form2: new FormControl('', Validators.required),
      to2: new FormControl('', Validators.required)
    });
  }



  loadUserProfile() {
    this.service1.getApi('/admin/myProfile').subscribe({
      next: (resp) => {
        this.userEmail = resp.adminData.email;
        this.name = resp.adminData.full_name;
        this.phone = resp.adminData.phone_no;
        this.gender = resp.adminData.gender;

        const days1 = resp.adminData.days1.split(',').map((day: any) => this.getDayName(day));
        const days2 = resp.adminData.days2.split(',').map((day: any) => this.getDayName(day));
        const time1 = resp.adminData.time1.split('-');
        const time2 = resp.adminData.time2.split('-');
  
        this.day1Start = days1[0];
        this.day1End = days1[1];
        this.day2Start = days2[0];
        this.day2End = days2[1];
  
        this.time1Start = time1[0];
        this.time1End = time1[1];
        this.time2Start = time2[0];
        this.time2End = time2[1];

        // Update form controls with the fetched data
        this.profileForm.patchValue({
          name: this.name,
          gender: this.gender,
          phone: this.phone,
          email: this.userEmail,
          form1: this.time1Start,
          form2: this.time2Start,
          to1: this.time1End,
          to2: this.time2End
        });


        //console.log(this.userEmail, this.name, this.phone, this.gender);
        console.log('Days and times:', {
          day1Start: this.day1Start,
          day1End: this.day1End,
          day2Start: this.day2Start,
          day2End: this.day2End,
          form1: this.time1Start,
          to1: this.time1End,
          form2: this.time2Start,
          to2: this.time2End,
        });
      },
      error: (error) => {
        console.log(error.message);
      }
    });
  }

  getDayName(day: any): string {
    const dayMap: any = {
      '1': 'Sunday',
      '2': 'Monday',
      '3': 'Tuesday',
      '4': 'Wednesday',
      '5': 'Thursday',
      '6': 'Friday',
      '7': 'Saturday'
    };
    return dayMap[day] || 'Invalid day';
  }

  onSubmit() {
    this.profileForm.markAllAsTouched();
    if (this.profileForm.valid) {
      const formURlData = new URLSearchParams();
      formURlData.set('full_name', this.profileForm.value.name);
      formURlData.set('gender', this.profileForm.value.gender);
      formURlData.set('phone_no', this.profileForm.value.phone);
      formURlData.set('time1', `${this.profileForm.value.form1}-${this.profileForm.value.to1}`);
      formURlData.set('time2', `${this.profileForm.value.form2}-${this.profileForm.value.to2}`);

      this.service1.postAPI('/admin/editProfile', formURlData.toString()).subscribe({
        next: (resp) => {
          if (resp.success === true) {
            this.toastr.success(resp.message);
          } else {
            this.toastr.warning(resp.message);
          }
        },
        error: (error) => {
          this.toastr.warning('Something went wrong.');
          console.log(error.message);
        }
      });
    }
  }


}
