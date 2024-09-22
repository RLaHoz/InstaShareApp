import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login and store token', () => {
    const mockResponse = { token: 'fake-jwt-token' };

    service.login('user@example.com', 'password123').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);

    const token = localStorage.getItem('auth_token');
    expect(token).toBe('fake-jwt-token');
  });

  it('should register a user', () => {
    const mockResponse = { message: 'User registered successfully' };

    service.register('newuser@example.com', 'password123').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.baseUrl}/auth/register`);
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  it('should clear storage and navigate on logout', () => {
    spyOn(router, 'navigate');
    spyOn(localStorage, 'clear');

    service.logout();

    expect(localStorage.clear).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/auth']);
  });

  it('should set login status to true', () => {
    service.setLoginStatus(true);

    service.isLoggedIn().subscribe(status => {
      expect(status).toBeTrue();
    });
  });

  it('should set login status to false', () => {
    service.setLoginStatus(false);

    service.isLoggedIn().subscribe(status => {
      expect(status).toBeFalse();
    });
  });

});
