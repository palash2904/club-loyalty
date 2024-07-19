import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserRoutingModule } from './user-routing.module';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './main/main.component';
import { SidemenuComponent } from './sidemenu/sidemenu.component';
import { HeaderComponent } from './header/header.component';
import { EventComponent } from './event/event.component';
import { OffersComponent } from './offers/offers.component';
import { ChatComponent } from './chat/chat.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { MyProfileComponent } from './profile/my-profile/my-profile.component';
import { ChangePasswordComponent } from './profile/change-password/change-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { HttpClientModule } from '@angular/common/http';
import { GiftCardComponent } from './gift-card/gift-card.component';
import { IncomingUsersComponent } from './incoming-users/incoming-users.component';
import { CardGameComponent } from './card-game/card-game.component';
import { FilterPipe } from '../services/pipe/filter.pipe';
import { NotificationsComponent } from './notifications/notifications.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { QrScannerComponent } from './qr-scanner/qr-scanner.component';

@NgModule({
  declarations: [
    DashboardComponent,
    MainComponent,
    SidemenuComponent,
    HeaderComponent,
    EventComponent,
    OffersComponent,
    ChatComponent,
    QuestionnaireComponent,
    AddQuestionComponent,
    MyProfileComponent,
    ChangePasswordComponent,
    ChatboxComponent,
    GiftCardComponent,
    IncomingUsersComponent,
    CardGameComponent,
    FilterPipe,
    NotificationsComponent,
    QrScannerComponent
  ],
  imports: [
    CommonModule,
    UserRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    ZXingScannerModule
    //AngularFireModule.initializeApp(environment.firebaseConfig)
  ], exports:[
    FilterPipe
  ]
})
export class UserModule { }
