import { User } from 'firebase/auth'; // Importing the Firebase User type

export interface Userlocal {
    user: User; 
    name: string;  
    email: string;
    easy: number;
    medium: number;
    hard: number;
    total: number;
}
  