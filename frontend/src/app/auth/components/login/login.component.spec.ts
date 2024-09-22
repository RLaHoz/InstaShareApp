import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthService } from 'src/app/services/auth/auth.service';
import { LoginComponent } from './login.component';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['login', 'setLoginStatus']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule, MatSnackBarModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields and validation', () => {
    const form = component.loginForm;
    expect(form).toBeTruthy();
    expect(form.get('email')?.value).toBe('');
    expect(form.get('password')?.value).toBe('');
    expect(form.get('email')?.valid).toBeFalse();
    expect(form.get('password')?.valid).toBeFalse();
  });

  it('should display form errors when submitting an invalid form', () => {
    component.login();
    fixture.detectChanges();

    const emailField = fixture.debugElement.query(By.css('input[type="email"]'));
    const passwordField = fixture.debugElement.query(By.css('input[type="password"]'));
    expect(emailField.classes['ng-invalid']).toBeTrue();
    expect(passwordField.classes['ng-invalid']).toBeTrue();
  });

  it('should call login on AuthService and navigate to dashboard on successful login', () => {
    const form = component.loginForm;
    form.patchValue({ email: 'user@example.com', password: 'password123' });

    authServiceSpy.login.and.returnValue(of({ token: 'fake-jwt-token' }));

    component.login();
    expect(authServiceSpy.login).toHaveBeenCalledWith('user@example.com', 'password123');
    expect(authServiceSpy.setLoginStatus).toHaveBeenCalledWith(true);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/dashboard']);
  });

  it('should show an error message on failed login', () => {
    const form = component.loginForm;
    form.patchValue({ email: 'user@example.com', password: 'wrong-password' });

    authServiceSpy.login.and.returnValue(throwError(() => new Error('Invalid credentials')));

    spyOn(component['snackBar'], 'open');

    component.login();
    expect(authServiceSpy.login).toHaveBeenCalledWith('user@example.com', 'wrong-password');
    expect(component['snackBar'].open).toHaveBeenCalledWith('Invalid credentials. Please try again', 'Close', { duration: 5000 });
  });

  it('should navigate to register when register button is clicked', () => {
    component.register();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['auth/register']);
  });

  it('should unsubscribe from all subscriptions on destroy', () => {
    const subscriptionSpy = spyOn(component['subscriptions'], 'unsubscribe');
    component.ngOnDestroy();
    expect(subscriptionSpy).toHaveBeenCalled();
  });
});
