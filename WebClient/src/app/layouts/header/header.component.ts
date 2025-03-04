import { Component } from '@angular/core';
import { NavbarComponent } from '../navbar/navbar.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-header',
  imports: [NavbarComponent, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  navbarOpen = false; // Initial state of the hamburger menu button
  isLoggedIn = false; // User login status

  userRole: string | null = null;  // ✅ เก็บบทบาทผู้ใช้
  isAdmin = false;  // ✅ true เมื่อ user เป็น Admin

  constructor(private router: Router, private authService: AuthService) { }

  toggleNavbar() {
    this.navbarOpen = !this.navbarOpen; // Toggle state when the button is clicked
  }

  // Function back Home-page
  goHome() {
    this.router.navigate(['/']);
  }

  // isLoggedIn = false; // Initial state of login/logout button
  // toggleLogin() {
  //   this.isLoggedIn = !this.isLoggedIn; // Toggle state when the button is clicked
  // }

  ngOnInit(): void {
    // Check login status from localStorage
    this.isLoggedIn = !!localStorage.getItem('token');
  }

  // Function LogIn
  login() {
    // Simulate User login
    localStorage.setItem('token', 'dummy_token');
    this.isLoggedIn = true;
    this.router.navigate(['/login']); // Navigate to Login page
  }

  // Function LogOut
  logout() {
    
    // Remove token from localStorage -> Log out
    localStorage.removeItem('token');
    this.isLoggedIn = false;
    this.router.navigate(['/']); // Redirect to Home after logging out
  }
}