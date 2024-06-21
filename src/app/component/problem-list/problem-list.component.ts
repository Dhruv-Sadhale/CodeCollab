// src/app/components/problem-list/problem-list.component.ts
import { Component, OnInit } from '@angular/core';
import { ProblemService } from "../../services/problem.service";
import { Problem } from '../../models/problem.model';
import { AuthService } from '../../shared/auth.service';
import { Attempt } from '../../models/attempt.model';
import { AttemptService } from '../../services/attempt.service';
import { Userlocal } from '../../models/user.model';
@Component({
  selector: 'app-problem-list',
  templateUrl: './problem-list.component.html',
  styleUrls: ['./problem-list.component.css']
})
export class ProblemListComponent implements OnInit {
  problems: Problem[]=[];
  isEditing: boolean=false;
  isDone: boolean=false;
  attempt: Attempt | null=null;


  constructor() {}

  ngOnInit(): void {
    this.problemService.getProblems().subscribe((problems) => {
      this.problems = problems;
    });
  }
  // viewTeamSolution(problemsId: string):{

  // }
  saveAttempt() {
    // if(this.problem.title==='' || this.problem.description===''){
    //   return;
    // }
    if (this.isEditing) {
      this.attemptService.updateAttempt(this.attempt).then(() => {
        this.resetForm();
      });
    } else {

      this.attemptService.addAttempt(this.attempt).then(() => {
        this.resetForm();
      });
    }
  }

  editAttempt(attempt: Attempt) {
    this.attempt = { ...attempt };
    this.isEditing = true;
  }
  addAttempt(attempt: Attempt){
    this.attempt = { ...attempt };
    this.isEditing = false;
  }
  deleteAttempt(attempt: Attempt) {
    if(this.isDone==true){
      this.attemptService.deleteAttempt(attempt);
      this.isDone=false;
    }
  }

  resetForm() {
    this.attempt =null;

    this.isEditing = false;
  }

  
}
