import { Injectable } from '@angular/core';
import {HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse} from '@angular/common/http';
import {BehaviorSubject, Observable, throwError} from 'rxjs';
import {AuthenticationService} from './auth.service';
import {catchError, filter, switchMap, take} from 'rxjs/operators';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private authService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Do we have a token?
    const token = this.authService.getToken();
    if (token) {
      // Yes, add it to the request
      request = this.addToken(request, token);
    }

    // Perform call
    return next.handle(request).pipe(catchError(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
        // Unauthorised, try token refresh
        return this.handle401Error(request, next);
      } else {
        // Other/Uknown error
        return throwError(error);
      }
    }));
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (this.isRefreshing) {
      // Already refreshing, wait...
      return this.refreshTokenSubject.pipe(
        filter(token => token != null),
        take(1),
        switchMap(jwt => {
          return next.handle(this.addToken(request, jwt));
        }));
    } else {
      // Set refreshing state
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      // Try get a new token
      return this.authService.refreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token);

          // Add and call
          return next.handle(this.addToken(request, token));
        }));

    }
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }
}
