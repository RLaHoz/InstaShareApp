import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CanActivate, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {}

  canActivate(): Observable<boolean> {
    return this.authService.isLoggedIn().pipe(
      map((isLoggedIn: boolean) => {
        if (!isLoggedIn) {
          this.snackBar.open('Access denied - Redirecting to login', 'Close', {
            duration: 5000,
          });
          this.router.navigate(['/auth']);
          return false;
        }
        return true;
      })
    );
  }
}
