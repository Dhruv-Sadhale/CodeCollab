import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import {AngularFireModule} from '@angular/fire/compat'
import { environment } from '../environments/environment';
import { LoginComponent } from './component/login/login.component';
import { RegisterComponent } from './component/register/register.component';
import { DashboardComponent } from './component/dashboard/dashboard.component';
import {FormsModule} from '@angular/forms';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './component/verify-email/verify-email.component';
import { ProblemListComponent } from './component/problem-list/problem-list.component';
import { Problem } from './models/problem.model';
import { AttemptDetailsComponent } from './component/attempt-details/attempt-details.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    ProblemListComponent,
    AttemptDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    FormsModule
  ],
  providers: [
    provideFirebaseApp(() => initializeApp({"projectId":"olpnew","appId":"1:1068847586573:web:82fc2ad62bb8cc08172444","storageBucket":"olpnew.appspot.com","apiKey":"AIzaSyCL-Tpsc9WHSbzNJERe0Cd9WJzFjFWXTW4","authDomain":"olpnew.firebaseapp.com","messagingSenderId":"1068847586573","measurementId":"G-ESY6VJ58KX"})),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore())
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
