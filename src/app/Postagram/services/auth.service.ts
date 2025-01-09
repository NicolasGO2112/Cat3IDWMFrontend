import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, throwError } from 'rxjs';
import { Auth, LogginDto, RegisterDto } from '../interfaces/ResponseApi_auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly baseUrl: string = "http://localhost:5022/api/Auth";
  private readonly http = inject(HttpClient);
  public errors: string[] = []; 

  loggin(credentials: LogginDto): Observable<Auth> {
    return this.http.post<Auth>(`${this.baseUrl}/loggin`, credentials).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('Error on login',error);
        this.errors.push(error.message || 'Error desconocido');
        return throwError(() => new Error('Error on login'));
    })
    );
  }
  register(credentials: RegisterDto): Observable<Auth> {
    return this.http.post<Auth>(`${this.baseUrl}/register`, credentials).pipe(
      catchError((error: HttpErrorResponse) => {
        console.log('Error on register',error);
        this.errors.push(error.message || 'Unknow error');
        return throwError(() => new Error(error.message));
    })
    );
  }
 
}
