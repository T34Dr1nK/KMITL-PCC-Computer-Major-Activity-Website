import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { AuthGuard } from './auth.guard';
import { Router } from '@angular/router';

describe('AuthGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let guard: AuthGuard;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['isLoggedIn']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(AuthGuard);
  });

  it('should allow access when logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(true);
    expect(guard.canActivate()).toBeTrue();
  });

  it('should block access when not logged in', () => {
    authServiceSpy.isLoggedIn.and.returnValue(false);
    expect(guard.canActivate()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/login']);
  });
});