import { Component, OnInit } from '@angular/core';
import { ProblemService } from '../../services/problem.service';
import { Problem } from '../../models/problem.model';
import { AuthService } from '../../shared/auth.service';
import { Attempt } from '../../models/attempt.model';
import { AttemptService } from '../../services/attempt.service';
import { Userlocal } from '../../models/userlocal.model';
import { User } from 'firebase/auth';
import { filter, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {
  problems: Problem[] = [];
  isEditing: boolean = false;
  isDone: boolean = false;
  attempt: Attempt = {
    attemptId: '',
    user: null,
    problem: null,
    tc: 0,
    sc: 0,
    language: '',
    mySolution: '',
    notes: ''
  };
  currentUser: User | null = null;

  constructor(
    private problemService: ProblemService,
    private authService: AuthService,
    private attemptService: AttemptService
  ) {}

  ngOnInit(): void {
    this.authService.getUser().pipe(
      filter(user => !!user), // Ensure user is not null or undefined
      switchMap(user => {
        this.currentUser = user;
        return this.problemService.getProblems();
      })
    ).subscribe(problems => {
      this.problems = problems;
    });
  }

  saveAttempt() {
    if (this.currentUser && this.attempt) {
      this.attempt.user = this.currentUser;
      
      if (this.isEditing) {
        this.attemptService.updateAttempt(this.attempt).then(() => {
          this.updateUserStatistics(this.isEditing);
          this.resetForm();
        });
      } else {
        this.attemptService.addAttempt(this.attempt).then(() => {
          this.updateUserStatistics(this.isEditing);
          this.resetForm();
        });
      }
    } else {
      console.error('User not authenticated or attempt is null');
    }
    console.log('Form submitted'); // Check if this log appears in the console
  }

  editAttempt(attempt: Attempt) {
    this.attempt = { ...attempt };
    this.isEditing = true;
  }

  addAttempt(problem: Problem) {
    this.attempt = {
      attemptId: '',
      user: this.currentUser!,
      problem: problem,
      tc: 0,
      sc: 0,
      language: '',
      mySolution: '',
      notes: ''
    };
    this.isEditing = false;
  }

  deleteAttempt(attempt: Attempt) {
    if (this.isDone) {
      this.attemptService.deleteAttempt(attempt).then(() => {
        this.isDone = false;
        this.updateUserStatistics(this.isEditing);
        this.resetForm();
      });
    }
  }

  viewTeamSolution(problemId: string) {
    // Implement this function as needed
  }

  resetForm() {
    this.attempt = {
      attemptId: '',
      user: this.currentUser!,
      problem: null,
      tc: 0,
      sc: 0,
      language: '',
      mySolution: '',
      notes: ''
    };
    this.isEditing = false;
  }

  private updateUserStatistics(isEditing: boolean) {
    if (this.currentUser && this.attempt && this.attempt.problem) {
      this.authService.getUserData(this.currentUser.uid).subscribe(userData => {
        if (userData) {
          const userStats: Userlocal = userData;
          if(isEditing==false){
          userStats.total += 1;
          if(this.attempt.problem!=null){
            const difficulty = this.attempt.problem.difficultyLevel;
            if (difficulty) {
              if (difficulty === 'easy') userStats.easy += 1;
              if (difficulty === 'medium') userStats.medium += 1;
              if (difficulty === 'hard') userStats.hard += 1;
            }
          }
        }
          this.authService.updateUserData(this.currentUser!.uid, userStats).then(() => {
            console.log('User statistics updated');
          });
        }
      });
    }
  }
}
