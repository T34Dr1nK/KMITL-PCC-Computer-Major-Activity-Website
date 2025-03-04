import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';
import { AdminGuard } from './admin.guard';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

describe('AdminGuard', () => {
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let guard: AdminGuard;

  beforeEach(() => {
    authServiceSpy = jasmine.createSpyObj('AuthService', ['getUserRole']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        AdminGuard,
        { provide: AuthService, useValue: authServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    guard = TestBed.inject(AdminGuard);
  });

  it('should allow access when user is admin', () => {
    authServiceSpy.getUserRole.and.returnValue('admin');
    expect(guard.canActivate()).toBeTrue();
  });

  it('should block access when user is not admin', () => {
    authServiceSpy.getUserRole.and.returnValue('user');
    expect(guard.canActivate()).toBeFalse();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});