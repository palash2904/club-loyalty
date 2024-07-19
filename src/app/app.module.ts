import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './core/login/login.component';
import { ToastrModule } from 'ngx-toastr';
import { AngularFireModule } from '@angular/fire/compat';
//import { AngularFireModule } from '@angular/fire';
import { environment } from 'src/environments/environment';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
//import { HeadersInterceptor } from './services/interceptor/headers.interceptor';
import { ForgotPasswordComponent } from './core/forgot-password/forgot-password.component';
import { NgTiltModule } from '@geometricpanda/angular-tilt';
import { NgxLoadingModule } from 'ngx-loading';
import { AngularFireMessagingModule } from '@angular/fire/compat/messaging';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; 
import { UserService } from './services/user.service';
//import { AngularFireMessagingModule } from '@angular/fire/messaging';
import { initializeApp } from 'firebase/app';
import { ScrollToBottomDirective } from './services/scroll-to-bottom.directive';
import { FilterPipe } from './services/pipe/filter.pipe';
initializeApp(environment.firebaseConfig)
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ForgotPasswordComponent,
    ScrollToBottomDirective,
    //FilterPipe
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireMessagingModule,
    AngularFireModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ToastrModule.forRoot({
      timeOut: 5000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      progressBar: true
    }),
    FormsModule,
    ReactiveFormsModule,
    NgTiltModule,
    NgxLoadingModule.forRoot({}),
    BrowserAnimationsModule
  ],
  //providers: [{ provide: HTTP_INTERCEPTORS, useClass: HeadersInterceptor, multi: true }, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor() {
    // Initialize Firebase here
    //initializeApp(environment.firebaseConfig);
  }
}
