import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {SnomedLicenseDialog} from '../components/snomed-license-dialog/snomed-license-dialog.component';
import {MatDialog} from '@angular/material/dialog';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RouteGuard implements CanActivate {
  private SNOMED_LICENSE_COOKIE = 'SNOMED_LICENSE_ACCEPTED';
  constructor(private cookieService: CookieService,
              private dlg: MatDialog,
              private router: Router) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> {

    return new Observable<boolean>((observer) => {
      if (this.cookieService.check(this.SNOMED_LICENSE_COOKIE))
        observer.next(true);
      else {
        SnomedLicenseDialog.execute(this.dlg).subscribe(
          (response) => {
            if (!response) {
              window.location.href = 'https://www.snomed.org/';
              observer.next(false);
            } else {
              console.log('Accept cookie');
              observer.next(true);
              this.cookieService.set(this.SNOMED_LICENSE_COOKIE, 'TRUE', 30);
            }
          }
        );
      }
    });
  }
}
