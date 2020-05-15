import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import {AuthenticationService} from './auth.service';

@Injectable()
export class BasicAuthInterceptor implements HttpInterceptor {
  constructor(private authenticationService: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // add authorization header with basic auth credentials if available
    const currentUser = this.authenticationService.getUser();
    if (currentUser) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.authenticationService.getToken()}`
        }
      });
    }

    return next.handle(request);
  }
}
