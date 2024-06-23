import { User } from 'firebase/auth'; // Importing the Firebase User type

export interface Userlocal {
    uid: string;
    user: User | null; 
    displayName: string;  
    email: string;
    easy: number;
    medium: number;
    hard: number;
    total: number;
}
  