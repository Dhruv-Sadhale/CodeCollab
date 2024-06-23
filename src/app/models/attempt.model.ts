// attempt.model.ts

import { Problem } from './problem.model';
import { Userlocal } from './userlocal.model';
export interface Attempt {
  attemptId: string;
  email: string |undefined;
  user: Userlocal| null; // Allow for null values
  problem: Problem | null; // Adjust other properties as needed
  tc: number;
  sc: number;
  language: string;
  mySolution: string;
  notes: string;
  
}
