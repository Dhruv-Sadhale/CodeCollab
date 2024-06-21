import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Problem } from '../models/problem.model';
import { Attempt } from '../models/attempt.model';
import { User } from 'firebase/auth';//check this
@Injectable({
  providedIn: 'root'
})
export class AttemptService {

  private AttemptCollection = this.firestore.collection<Attempt>('Attempts');

  constructor(private firestore: AngularFirestore) {}
  addAttempt(Attempt: Attempt): Promise<void> {
    const attemptId = this.firestore.createId();
    return this.AttemptCollection.doc(attemptId).set({ ...Attempt, attemptId });
  }

  updateAttempt(Attempt: Attempt): Promise<void> {
    return this.AttemptCollection.doc(Attempt.attemptId).update(Attempt);
  }
  deleteAttempt(Attempt: Attempt): Promise<void> {
    return this.AttemptCollection.doc(Attempt.attemptId).delete();
  }
}
