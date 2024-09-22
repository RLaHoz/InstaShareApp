import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { RegisterComponent } from './register.component';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let snackBarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(async () => {
    const authSpy = jasmine.createSpyObj('AuthService', ['register']);
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const snackBarSpyObj = jasmine.createSpyObj('MatSnackBar', ['open']);

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule, MatSnackBarModule],
      providers: [
        { provide: AuthService, useValue: authSpy },
        { provide: Router, useValue: routerSpyObj },
        { provide: MatSnackBar, useValue: snackBarSpyObj }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    snackBarSpy = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form with empty fields', () => {
    expect(component.registerForm).toBeTruthy();
    expect(component.registerForm.get('email')?.value).toBe('');
    expect(component.registerForm.get('password')?.value).toBe('');
    expect(component.registerForm.get('confirmPassword')?.value).toBe('');
  });

  it('should validate the form as invalid if the fields are empty', () => {
    expect(component.registerForm.valid).toBeFalse();
  });

  it('should mark email as required if the form is invalid', () => {
    const emailField = component.registerForm.get('email');
    emailField?.setValue('');
    fixture.detectChanges();

    expect(emailField?.invalid).toBeTrue();
    expect(emailField?.errors?.['required']).toBeTrue();
  });

  it('should check password match validator works correctly', () => {
    const passwordField = component.registerForm.get('password');
    const confirmPasswordField = component.registerForm.get('confirmPassword');

    passwordField?.setValue('password123');
    confirmPasswordField?.setValue('password123');
    fixture.detectChanges();

    expect(component.registerForm.errors?.['mismatch']).toBeFalsy();

    confirmPasswordField?.setValue('wrongpassword');
    fixture.detectChanges();

    expect(component.registerForm.errors?.['mismatch']).toBeTruthy();
  });

  it('should call register method from AuthService on form submit', () => {
    const form = component.registerForm;
    form.patchValue({ email: 'user@example.com', password: 'password123', confirmPassword: 'password123' });

    authServiceSpy.register.and.returnValue(of({ message: 'User registered' }));

    component.onSubmit();
    expect(authServiceSpy.register).toHaveBeenCalledWith('user@example.com', 'password123');
    expect(snackBarSpy.open).toHaveBeenCalledWith('User registered. Please now login', 'Close', { duration: 5000 });
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/auth/login']);
  });

  it('should show error message when registration fails', () => {
    const form = component.registerForm;
    form.patchValue({ email: 'user@example.com', password: 'password123', confirmPassword: 'password123' });

    authServiceSpy.register.and.returnValue(throwError(() => new Error('Registration failed')));

    component.onSubmit();
    expect(authServiceSpy.register).toHaveBeenCalledWith('user@example.com', 'password123');
    expect(snackBarSpy.open).toHaveBeenCalledWith('Registration failed. Please try again', 'Close', { duration: 5000 });
  });
});
