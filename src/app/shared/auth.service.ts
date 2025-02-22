import { Injectable } from '@angular/core';
import {AngularFireAuth} from '@angular/fire/compat/auth'
import { GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider} from '@angular/fire/auth'
import { Router } from '@angular/router';
import { User } from 'firebase/auth';
import { Observable, firstValueFrom } from 'rxjs';
import { Userlocal } from '../models/userlocal.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { UserService } from '../services/user.service';
import { collection } from 'firebase/firestore';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = false;
  constructor(private fireauth: AngularFireAuth, private router:Router,private firestore: AngularFirestore, private userService: UserService,private cookieService: CookieService) {
    const token = this.cookieService.get('token') || localStorage.getItem('token');
    if (token) {
      this.isLoggedIn = true;
    }
   }
  getUser(): Observable<User | null> {
    return this.fireauth.authState as Observable<User | null>;
  }
  async login(email: string, password: string) {
    try {
      const userCredential = await this.fireauth.signInWithEmailAndPassword(email, password);
      console.log(userCredential.user);
      // If login is successful and user exists
      if (userCredential.user) {
        localStorage.setItem('token', 'true'); // Example: Set token in localStorage

        // Check if email is verified
        

        // Check if user document exists in Firestore
        const userExists = await this.userService.userExists(userCredential.user.uid);
        // if (!userExists) {
        //   await this.userService.createUserDocument(userCredential.user);
        // }
        if (userCredential.user.emailVerified) {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/verify-email']);
        }
      } else {
        // Handle case where userCredential.user is null (should not happen after successful login)
        throw new Error('User not found'); // Adjust error handling based on your app's requirements
      }
      
    } catch (error: any) { // Specify 'error: any' to handle unknown type
      // Handle Firebase Authentication errors
      console.error('Login error:', error.message || error); // Use error.message if available, otherwise log the entire error object
      alert(error.message || 'Login failed'); // Example: Display error message to user
      this.router.navigate(['/login']); // Redirect to login page on error
    }
  }

  // register method
  register(email : string, password : string) {
    this.fireauth.createUserWithEmailAndPassword(email, password).then( res => {
      alert('Registration Successful');
      this.sendEmailForVerification(res.user);
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
      this.router.navigate(['/register']);
    })
  }

  // sign out
  logout() {
    this.fireauth.signOut().then( () => {
      localStorage.removeItem('token');
      this.router.navigate(['/login']);
    }, err => {
      alert(err.message);
    })
  }

  // forgot password
  forgotPassword(email : string) {
      this.fireauth.sendPasswordResetEmail(email).then(() => {
        this.router.navigate(['/verify-email']);
      }, err => {
        alert('Something went wrong');
      })
  }

  // email varification
  sendEmailForVerification(user : any) {
    console.log(user);
    user.sendEmailVerification().then((res : any) => {
      this.router.navigate(['/verify-email']);
    }, (err : any) => {
      alert('Something went wrong. Not able to send mail to your email.')
    })
  }
  // googleSignIn() {
  //   return this.fireauth.signInWithPopup(new GoogleAuthProvider).then(res => {

  //     this.router.navigate(['/dashboard']);
  //     localStorage.setItem('token',JSON.stringify(res.user?.uid));

  //   }, err => {
  //     alert(err.message);
  //   })
  // }
  async googleSignIn() {
    try {
      const res = await this.fireauth.signInWithPopup(new GoogleAuthProvider());
      const email = res.user?.email;
      console.log(email);
      // Check if user email is in Firestore collection
      const userDoc = await firstValueFrom(this.firestore.collection('ConfirmUsers').doc(email!).get());
      if (!userDoc.exists) {
        alert('Your email is not approved for access.');
        await this.fireauth.signOut();
        return;
      }
      // Check if user document exists in Firestore
      const userExists = await this.userService.userExists(res.user!.email);
      if (!userExists) {
        console.log(res.user)
        await this.userService.createUserDocument(res.user);
        console.log("done");
      }
      console.log("done2")
      localStorage.setItem('token', res.user?.uid || '');
      this.cookieService.set('token', res.user?.uid || '', { expires: 365, sameSite: 'Lax' });
      this.isLoggedIn = true;
      this.router.navigate(['/problem-list']);
      localStorage.setItem('token', JSON.stringify(res.user?.uid));
    } catch (error: any) {
      console.error('Google sign-in error:', error.message || error);
      alert(error.message || 'Google sign-in failed');
    }
  }
  async signOut() {
    try {
      await this.fireauth.signOut();
      this.cookieService.delete('token');
      localStorage.removeItem('token');
      this.isLoggedIn = false;
      this.router.navigate(['/']);
    } catch (error: any) {
      console.error('Sign-out error:', error.message || error);
      alert(error.message || 'Sign-out failed');
    }
  }
  getUserData(email: string): Observable<Userlocal | undefined> {
    return this.firestore.collection('Users').doc<Userlocal>(email).valueChanges();
  }
  updateUserData(email: string, data: Userlocal) {
    return this.firestore.collection('Users').doc(email).set(data, { merge: true });
  }

}
