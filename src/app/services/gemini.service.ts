// src/app/services/gemini.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  
  private geminiBaseUrl = 'https://api.gemini.com'; // Replace with actual Gemini API URL
  private apiKey : string = environment.geminiApiKey || ""; // Replace with your actual Gemini API key

  constructor(private http: HttpClient) {}

  getCourseSuggestions(query: string): Observable<any> {
    const endpoint = `${this.geminiBaseUrl}/suggestCourses`;

    // Constructing query parameters
    let params = new HttpParams();
    params = params.append('query', query); // Adding 'query' parameter

    // Adding API key as a query parameter if required by Gemini API
    params = params.append('apiKey', this.apiKey);

    // Making the HTTP GET request with parameters
    return this.http.get(endpoint, { params });
  }
}
