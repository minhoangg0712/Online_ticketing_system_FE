import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRole = route.data['role'] as string;
    const userRole = this.authService.getCurrentUserRole();

    if (!userRole) {
      this.router.navigate(['/login']);
      return false;
    }

    if (requiredRole && userRole !== requiredRole) {
      // Chuyển hướng dựa trên role
      switch (userRole) {
        case AuthService.UserRole.ADMIN:
          this.router.navigate(['/admin']);
          break;
        case AuthService.UserRole.ORGANIZER:
          this.router.navigate(['/organizer']);
          break;
        case AuthService.UserRole.CUSTOMER:
          this.router.navigate(['/home']);
          break;
        default:
          this.router.navigate(['/login']);
      }
      return false;
    }

    return true;
  }
} 