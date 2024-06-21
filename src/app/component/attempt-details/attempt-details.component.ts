import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Attempt } from '../../models/attempt.model';
import { AttemptService } from '../../services/attempt.service';

@Component({
  selector: 'app-attempt-details',
  templateUrl: './attempt-details.component.html',
  styleUrls: ['./attempt-details.component.css']
})
export class AttemptDetailsComponent implements OnInit {
  attempts: Attempt[] = [];
  problemId: string = '';

  constructor(
    private route: ActivatedRoute,
    private attemptService: AttemptService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.problemId = params.get('problemId') || '';
      this.loadAttemptDetails();
    });
  }

  loadAttemptDetails() {
    // Example: Fetch attempts for the specified problemId
    this.attemptService.getAttemptsForProblem(this.problemId)
      .subscribe(attempts => {
        this.attempts = attempts;
      });
  }
}
