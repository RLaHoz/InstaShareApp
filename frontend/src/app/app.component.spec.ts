import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth/auth.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockAuthService: any;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj(['isLoggedIn']);
    mockAuthService.isLoggedIn.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app component', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize isLoggedIn$ from AuthService on ngOnInit', () => {
    expect(component.isLoggedIn$).toBeDefined();
    expect(mockAuthService.isLoggedIn).toHaveBeenCalled();
  });

  it('should render app-navbar and app-loading-spinner components', () => {
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('app-navbar')).toBeTruthy();
    expect(compiled.querySelector('app-loading-spinner')).toBeTruthy();
  });

});
