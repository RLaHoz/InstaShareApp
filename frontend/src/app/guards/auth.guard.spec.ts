import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth/auth.service';
import { of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: jasmine.SpyObj<AuthService>;
  let router: jasmine.SpyObj<Router>;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const authSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpy },
        { provide: MatSnackBar, useValue: snackBarSpy }
      ]
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should allow activation when user is logged in', (done) => {
    authService.isLoggedIn.and.returnValue(of(true));

    guard.canActivate().subscribe((canActivate) => {
      expect(canActivate).toBeTrue();
      expect(router.navigate).not.toHaveBeenCalled();
      expect(snackBar.open).not.toHaveBeenCalled();
      done();
    });
  });

  it('should deny activation and redirect to login when user is not logged in', (done) => {
    authService.isLoggedIn.and.returnValue(of(false));

    guard.canActivate().subscribe((canActivate) => {
      expect(canActivate).toBeFalse();
      expect(router.navigate).toHaveBeenCalledWith(['/auth']);
      expect(snackBar.open).toHaveBeenCalledWith(
        'Access denied - Redirecting to login',
        'Close',
        { duration: 5000 }
      );
      done();
    });
  });
});
