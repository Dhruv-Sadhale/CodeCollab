import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './component/login/login.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import { RegisterComponent } from './component/register/register.component';
import { VerifyEmailComponent } from './component/verify-email/verify-email.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { ProblemListComponent } from "./component/problem-list/problem-list.component";
import { AttemptDetailsComponent } from './component/attempt-details/attempt-details.component';
import { HomeComponent } from './component/home/home.component';

const routes: Routes = [
  {path:"", component:HomeComponent},
  {path:"login", component:LoginComponent},
  { 
    path: 'dashboard', 
    component: DashboardComponent, 
    //canActivate: [AuthGuard],
    children: [
      
      
    ]
  },  {path:"register", component:RegisterComponent},
  {path:"verify-email", component:VerifyEmailComponent},
  {path:"forgot-password", component:ForgotPasswordComponent},
  {path:"problem-list", component:ProblemListComponent},
  { path: 'attempts/:problemId', component: AttemptDetailsComponent } // Add route for AttemptDetailsComponent
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [ Router] // Ensure Router is provided here
})
export class AppRoutingModule { }
