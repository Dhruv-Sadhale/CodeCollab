import { Problem } from "./problem.model";
import { User } from 'firebase/auth'; // Importing the Firebase User type

export interface Attempt{
    attemptId: string;
    user: User;
    problem: Problem;
    tc: number;
    sc: number;
    language: string;
    mySolution: string;
    notes: string;

}