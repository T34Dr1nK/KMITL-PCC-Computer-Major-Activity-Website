//import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Import relevant components
import { ShowPostComponent } from './pages/show-post/show-post.component';  // Show-Post -> Home Page
import { PostDetailComponent } from './pages/post-detail/post-detail.component';  // Post-Detail (หน้าแสดงรายละเอียดโพสต์)
import { UpPostComponent } from './pages/up-post/up-post.component';  // Up-Post (หน้าสร้างโพสต์)
import { LoginComponent } from './pages/auth/login/login.component';  // Login Page
import { SignUpComponent } from './pages/auth/signup/signup.component';  // Signup Page

import { AuthGuard } from './guards/auth.guard';  // Import AuthGuard
import { AdminGuard } from './guards/admin.guard';  // Import AdminGuard

export const routes: Routes = [
  { path: '', component: ShowPostComponent, pathMatch: 'full' },  // Home Page
  { path: 'post/:id', component: PostDetailComponent },  // View post details
  { path: 'create', component: UpPostComponent, canActivate: [AdminGuard] },  // Create a new post
  { path: 'edit/:id', component: UpPostComponent, canActivate: [AdminGuard]},  // Edit post

  // Authentication Pages
  { path: 'login', component: LoginComponent }, // Login
  { path: 'signup', component: SignUpComponent }, // Signup

  // If an unknown route is encountered, redirect to the home page
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

//--------------------------------------------
// @NgModule({
//   imports: [RouterModule.forRoot(routes)],
//   exports: [RouterModule]
// })
//export class AppRoutingModule { }
//--------------------------------------------