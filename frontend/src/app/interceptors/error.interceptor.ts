import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An unknown error occurred';

        if (error.error.message) {
          switch (error.error.message) {
            case 'Invalid credentials':
              errorMessage = 'Credenciales inválidas. Por favor, verifica tu email y contraseña.';
              break;
            case 'duplicated files':
              errorMessage = 'El archivo ya existe. Por favor, sube un archivo diferente.';
              break;
            case 'file doesnt exist':
              errorMessage = 'El archivo solicitado no existe.';
              break;
            default:
              errorMessage = 'Ocurrió un error inesperado.';
          }
        }

        this.snackBar.open(errorMessage, 'Cerrar', {
          duration: 5000,
          panelClass: ['error-snackbar']
        });

        return throwError(() => new Error(errorMessage));
      })
    );
  }
}
