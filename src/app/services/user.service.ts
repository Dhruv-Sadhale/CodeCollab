import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Userlocal } from '../models/userlocal.model';
import { Observable, firstValueFrom, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore) {}

  async userExists(email: string | null): Promise<boolean> {
    if (email == null) {
      return false;
    }
    email = email.trim().toLowerCase(); // Normalize the email
    const userDoc = await this.firestore.collection('Users').doc(email).ref.get();
    console.log("User exists: " + userDoc.exists);
    return userDoc.exists;
  }

  async createUserDocument(user: any | null): Promise<void> {
    if (user == null) {
      throw new Error('User data is null');
    }
    const email = user.email.trim().toLowerCase(); // Normalize the email
    const userDoc: Userlocal = {
      uid: user.uid,
      user: null,
      email: email,
      displayName: user.displayName || 'Anonymous',
      total: 0,
      easy: 0,
      medium: 0,
      hard: 0
    };
    await this.firestore.collection('Users').doc(email).set(userDoc);
    console.log(`User document created for email: ${email}`);
  }

  async getUser(email: string): Promise<Userlocal | null> {
    if (!email) {
      console.error('Email is null or empty');
      return null;
    }
    email = email.trim().toLowerCase(); // Normalize the email
    console.log(`Querying user with normalized email: ${email}`);
    
    const userDoc = await this.firestore.collection('Users').doc(email).ref.get();
    if (userDoc.exists) {
      const userData = userDoc.data() as Userlocal;
      console.log(`User found: ${userData.displayName}`);
      return userData;
    } else {
      console.error(`User with EMAIL ${email} does not exist.`);
      return null;
    }
  }
  getAllUsers(): Observable<Userlocal[]> {
    return this.firestore.collection('Users').snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Userlocal;
        data.uid = a.payload.doc.id;
        return data;
      }))
    );
  }

  async getAllUsersAsPromise(): Promise<Userlocal[]> {
    return firstValueFrom(this.getAllUsers());
  }
}
