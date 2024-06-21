// attempt.model.ts

import { Problem } from './problem.model';
import { User } from 'firebase/auth';

export interface Attempt {
  attemptId: string;
  user: User | null; // Allow for null values
  problem: Problem | null; // Adjust other properties as needed
  tc: number;
  sc: number;
  language: string;
  mySolution: string;
  notes: string;
  
}
