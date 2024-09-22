import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  registerForm!: FormGroup;
  hide = true;

  constructor(
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private router: Router) { }

    ngOnInit(): void {
      this.initForm();
    }

    initForm(){
      this.registerForm = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]]
      }, { validator: this.passwordMatchValidator });
    }

    passwordMatchValidator(group: FormGroup): any {
      const password = group.get('password')?.value;
      const confirmPassword = group.get('confirmPassword')?.value;

      return password === confirmPassword ? null : { mismatch: true };
    }

    onSubmit(): void {
      if (this.registerForm.valid) {
        const { email, password } = this.registerForm.value;
        this.authService.register(email, password).subscribe(
          (response: any) => {
            this.snackBar.open(`${response.message}. Please now login`, 'Close', {
              duration: 5000,
            });
            this.router.navigate(['/auth/login']);
          },
          (error: Error) => {
            this.snackBar.open(`${error.message}. Please try again`, 'Close', {
              duration: 5000,
            });
          }
        );
      }
    }

}
