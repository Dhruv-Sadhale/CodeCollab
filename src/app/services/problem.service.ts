// src/app/services/Problem.service.ts
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Problem } from '../models/problem.model';

@Injectable({
  providedIn: 'root'
})
export class ProblemService {

  private ProblemsCollection = this.firestore.collection<Problem>('Problems');

  constructor(private firestore: AngularFirestore) {}

  getProblems(): Observable<Problem[]> {
    return this.ProblemsCollection.snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data() as Problem;
        const Id = a.payload.doc.id;
        return { Id, ...data };
      }))
    );
  }

  // addProblem(Problem: Problem): Promise<void> {
  //   const ProblemId = this.firestore.createId();
  //   return this.ProblemsCollection.doc(ProblemId).set({ ...Problem, problemId });
  // }

  // updateProblem(Problem: Problem): Promise<void> {
  //   return this.ProblemsCollection.doc(Problem.problemId).update(Problem);
  // }

  // deleteProblem(ProblemId: string): Promise<void> {
  //   return this.ProblemsCollection.doc(ProblemId).delete();
  // }
}
