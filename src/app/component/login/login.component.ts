import { Component } from '@angular/core';
import { AuthService } from '../../shared/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
 email:string='';
 password: string='';
 constructor(private auth :AuthService){}
 async login(){
  console.log("hello");
  if(this.email==''){
    alert("Please enter email");
    return;
  }
  if(this.password==''){
    alert("Please enter password");
    return;
  }
  await this.auth.login(this.email,this.password);
  this.email='';
  this.password='';
 }

 signInWithGoogle(){
  this.auth.googleSignIn();
 }
}
