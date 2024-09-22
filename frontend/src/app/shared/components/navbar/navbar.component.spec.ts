import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NavbarComponent } from './navbar.component';
import { AuthService } from 'src/app/services/auth/auth.service';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let mockAuthService: any;

  beforeEach(async () => {

    mockAuthService = jasmine.createSpyObj(['isLoggedIn', 'logout', 'setLoginStatus']);
    mockAuthService.isLoggedIn.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      declarations: [NavbarComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the navbar component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isLoggedIn$ observable from AuthService', () => {
    expect(component.isLoggedIn$).toBeTruthy();


    expect(mockAuthService.isLoggedIn).toHaveBeenCalled();
  });

  it('should display navbar if user is logged in', () => {

    fixture.detectChanges();
    const navbarElement = fixture.debugElement.query(By.css('.custom-navbar'));
    expect(navbarElement).toBeTruthy();
  });

  it('should call AuthService logout and setLoginStatus on logout', () => {

    const logoutButton = fixture.debugElement.query(By.css('ul.navbar-links li'));
    logoutButton.triggerEventHandler('click', null);


    expect(mockAuthService.logout).toHaveBeenCalled();
    expect(mockAuthService.setLoginStatus).toHaveBeenCalledWith(false);
  });
});
