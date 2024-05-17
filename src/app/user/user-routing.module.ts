import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MainComponent } from './main/main.component';
import { EventComponent } from './event/event.component';
import { OffersComponent } from './offers/offers.component';
import { ChatComponent } from './chat/chat.component';
import { QuestionnaireComponent } from './questionnaire/questionnaire.component';
import { AddQuestionComponent } from './add-question/add-question.component';
import { MyProfileComponent } from './profile/my-profile/my-profile.component';
import { ChangePasswordComponent } from './profile/change-password/change-password.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { GiftCardComponent } from './gift-card/gift-card.component';
import { IncomingUsersComponent } from './incoming-users/incoming-users.component';

const routes: Routes = [
  {
    path: 'main', component: MainComponent,
    children: [
      {
        path: "dashboard",
        component: DashboardComponent,
      },
      // {
      //   path: "dashboard/:id",
      //   component: DashboardComponent,
      // },
      {
        path: "event",
        component: EventComponent,
      },
      {
        path: "offers",
        component: OffersComponent,
      },
      {
        path: "chat",
        component: ChatComponent,
      },
      {
        path: "questionnaire",
        component: QuestionnaireComponent,
      },
      {
        path: "add-question",
        component: AddQuestionComponent,
      },
      {
        path: "my-profile",
        component: MyProfileComponent,
      },
      {
        path: "change-password",
        component: ChangePasswordComponent,
      },
      {
        path: 'chatbox/:roomId',
        component: ChatboxComponent
      },
      {
        path: "gift-card",
        component: GiftCardComponent,
      },
      {
        path: "incoming-users",
        component: IncomingUsersComponent,
      },
    ],
  },
  {
    path: 'chat1',
    component: ChatComponent,
    children: [
      //{ path: 'chat', component: ChatComponent },
      { path: 'chatbox/:roomId', component: ChatboxComponent } // Define route parameter roomId
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
