import { Component, OnInit } from '@angular/core';
import { ProblemService } from '../../services/problem.service';
import { Problem } from '../../models/problem.model';
import { AuthService } from '../../shared/auth.service';
import { Attempt } from '../../models/attempt.model';
import { AttemptService } from '../../services/attempt.service';
import { Userlocal } from '../../models/userlocal.model';
import { User } from 'firebase/auth';
import { filter, switchMap } from 'rxjs/operators';
import { UserService } from '../../services/user.service';
import { from } from 'rxjs';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {
  problems: Problem[]|undefined= [];
  showForm: boolean = false;
  isEditing: boolean = false;
  isDone: boolean = false;
  attempt: Attempt = {
    attemptId: '',
    email:'',
    user: null,
    problem: null,
    tc: 0,
    sc: 0,
    language: '',
    mySolution: '',
    notes: ''

  };
  currentUser: User | null = null;
  selectedProblem: Problem | null = null; 
  currentLocalUser: Userlocal|null=null;
  constructor(
    private problemService: ProblemService,
    private authService: AuthService,
    private attemptService: AttemptService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    
    this.authService.getUser().pipe(
      filter(user => !!user), // Ensure user is not null or undefined
      switchMap(user => {
        this.currentUser = user;
        
        console.log("bp1:  " + this.currentUser!.uid);
        
        
        return from(this.userService.getUser(this.currentUser!.email!));
      }),
      switchMap(localUser => {
        this.currentLocalUser! = localUser!;
        console.log("bp2: " + localUser?.displayName);
        return from(this.problemService.getProblems());
      })
    ).subscribe(problems => {
      this.problems = problems;
    });
  }


  // saveAttempt() {
  //   console.log('Form submitted1')
  //   if (this.currentUser && this.attempt) {
  //     this.attempt.user = this.currentUser;
      
  //     if (this.isEditing) {
  //       this.attemptService.updateAttempt(this.attempt).then(() => {
          
  //         this.resetForm();
  //       });
  //     } else {
  //       this.attemptService.addAttempt(this.attempt).then(() => {
  //         this.addUserStatistics();
  //         this.resetForm();
  //       });
  //     }
  //   } else {
  //     console.error('User not authenticated or attempt is null');
  //   }
  //   console.log('Form submitted2'); // Check if this log appears in the console
  // }

  // editAttempt(attempt: Attempt) {
  //   this.attempt = { ...attempt };
  //   this.isEditing = true;
  // }

  
  async addAttempt(problem: Problem | null) {
    console.log('Form submitted1'); // Check if this log appears in the console
  
    if (problem == null) {
      console.log("null");
      return;
    }
  
    this.attempt.problem = problem;
    this.attempt.email = this.currentLocalUser!.email;
    console.log(this.attempt);
  
    if (this.currentUser == null || this.currentUser.email == null) {
      return;
    }
  
    console.log(this.currentUser!.email + ' ' + problem.problemId);
  
    try {
      const existingAttempt = await firstValueFrom(this.attemptService.getAttemptByUserAndProblemId(this.currentUser!.email, problem.problemId));
  
      if (existingAttempt) {
        console.log("bp2");
        await this.attemptService.deleteAttempt(existingAttempt);
        await this.attemptService.addAttempt(this.attempt);
        alert("Attempt added");
        this.resetForm();
        return;
      } else {
        this.addUserStatistics();
        console.log("bp1");
        await this.attemptService.addAttempt(this.attempt);
        alert("Attempt updated");
        this.resetForm();
      }
    } catch (error) {
      console.error("An error occurred while adding/updating the attempt:", error);
    }
  
    console.log('Form submitted2'); // Check if this log appears in the console
  }
  

  // deleteAttempt(attempt: Attempt) {
  //   if (this.isDone) {
  //     this.attemptService.deleteAttempt(attempt).then(() => {
        
  //     });
  //   }
  // }

  viewTeamSolution(problemId: string) {
    // Implement this function as needed
  }

  resetForm() {
    this.attempt = {
      attemptId: '',
      user: this.currentLocalUser!,
      email: this.currentLocalUser?.email,
      problem: null,
      tc: 0,
      sc: 0,
      language: '',
      mySolution: '',
      notes: ''
    };
    this.isEditing = false;
    this.showForm = false;
    this.selectedProblem = null; 
  
  }

  
 

private async addUserStatistics() {
  console.log("inside adduserstatricts1");
  
  if (this.currentUser && this.currentUser.email && this.attempt && this.attempt.problem) {
    try {
      const userData = await firstValueFrom(this.authService.getUserData(this.currentUser.email));
      
      if (userData) {
        const userStats: Userlocal = userData;
        console.log("inside adduserstatricts2");
        
        // Update user statistics
        userStats.total += 1;
        const difficulty = this.attempt.problem.difficultyLevel;
        
        if (difficulty) {
          if (difficulty === 'easy') userStats.easy += 1;
          else if (difficulty === 'medium') userStats.medium += 1;
          else if (difficulty === 'hard') userStats.hard += 1;
        }
        
        // Update user data without triggering another update
        await this.authService.updateUserData(this.currentUser.email, userStats);
        console.log('User statistics updated');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }
}

  isUserSolutionAdded(problem: Problem): boolean {
    if (!this.currentUser) {
      return false;
    }
    if(this.currentUser.email==null){return false;}
    this.selectedProblem=problem;
    return this.problems!.some(p => p.problemId === problem.problemId) &&
           this.attemptService.getAttemptByUserAndProblemId(this.currentUser.email, problem.problemId) !== undefined;
  }
  
}
