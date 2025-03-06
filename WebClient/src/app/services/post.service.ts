import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Post } from '../models/post'; // Import the Post interface
import { environment } from '../../environments/environment.development'; // Environment Variable

@Injectable({
  providedIn: 'root' // PostService injected throughout the app
})
export class PostService {
  //private apiBaseUrl = 'http://localhost:3000';
  // Environment API URL
  private apiBaseUrl = `${environment.apiBaseUrl}/activities`; // Fetch post data
  private imageBaseUrl = `${environment.apiBaseUrl}/images/`; // Load images from Backend

  constructor(private http: HttpClient) { }

  //  Convert image URL to a complete path (Fix Short-Path)
  private ensureFullUrl(imagePath: string): string {
    if (!imagePath) return '';
    return imagePath.startsWith('http') ? imagePath : `${this.imageBaseUrl}${imagePath}`;
  }

  // Fetch all posts (Supports Pagination & Category Filter)
  getPosts(page: number, category: string = 'all'): Observable<Post[]> {
    const headers = this.getAuthHeaders();
    return this.http
      .get<Post[]>(`${this.apiBaseUrl}?page=${page}&category=${category}`, { headers })
      .pipe(
        map(posts =>// Fix cover image path // Fix additional images
          posts.map(post => ({
            ...post,
            coverImage: this.ensureFullUrl(post.coverImage), // Fix Cover image path
            images: post.images?.map(img => this.ensureFullUrl(img)) || [] // Fix Additional images
          }))),
        catchError(this.handleError<Post[]>('getPosts', []))
      );
  }

  // Fetch post by ID
  getPostById(id: string): Observable<Post> {
    const headers = this.getAuthHeaders();
    return this.http.get<Post>(`${this.apiBaseUrl}/${id}`, { headers })
      .pipe(
        map(post => ({
          ...post,
          coverImage: this.ensureFullUrl(post.coverImage), // Fix Cover image path
          images: post.images?.map(img => this.ensureFullUrl(img)) || [] // Fix Additional images
        })),
        catchError(this.handleError<Post>('getPostById'))
      );
  }

  // Create new post
  createPost(post: Post): Observable<Post> {
    const headers = this.getAuthHeaders();
    return this.http.post<Post>(this.apiBaseUrl, post, { headers })
      .pipe(catchError(this.handleError<Post>('createPost')));
  }

  // Update post
  updatePost(id: string, post: Post): Observable<Post> {
    const headers = this.getAuthHeaders();
    return this.http.put<Post>(`${this.apiBaseUrl}/${id}`, post, { headers })
      .pipe(catchError(this.handleError<Post>('updatePost')));
  }

  // Delete post
  deletePost(id: string): Observable<void | null> {

    const token = localStorage.getItem('token');
    if (!token) {
      return of(null);
    }
    const headers = { 'Authorization': `Bearer ${token}` };

    //const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiBaseUrl}/${id}`, { headers })
      .pipe(catchError(this.handleError<void>('deletePost')));
  }


  // editPost(id: string, data: any): Observable<any> {
  //   return this.http.put(`${this.apiBaseUrl}/${id}`, data);
  // }

   //  Delete post with confirmation
  deletePostWithConfirmation(id: string): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      const confirmDelete = window.confirm('ต้องการลบโพสต์นี้ใช่หรือไม่?');
      if (confirmDelete) {
        this.deletePost(id).subscribe(() => {
          console.log('✅ ลบโพสต์สำเร็จ!');
          observer.next(true);
          observer.complete();
        });
      } else {
        observer.next(false);
        observer.complete();
      }
    });
  }

  // Pin/Unpin post
  pinPost(id: string, isPinned: boolean): Observable<Post> {

    const token = localStorage.getItem('token');
    
    if (!token) {
        console.error("❌ No token found in localStorage!");
        return throwError(() => new Error("Unauthorized: No token found!"));
    }

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    //const headers = this.getAuthHeaders();
    return this.http.patch<Post>(`${this.apiBaseUrl}/Pin/${id}`, { isPinned }, { headers })
      .pipe(
        map(response => {
          console.log(`📌 ${isPinned ? 'ปักหมุด' : 'ยกเลิกปักหมุด'} โพสต์สำเร็จ`);
          return response;
        }),
        catchError(this.handleError<Post>('pinPost'))
      );
  }

  // Function add Authorization Headers for JWT Token
  private getAuthHeaders(): HttpHeaders {
    const authToken = localStorage.getItem('authToken') || ''; // Check token
    return new HttpHeaders().set('Authorization', `Bearer ${authToken}`);
  }

  // Function  handle errors
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(`❌ ${operation} failed: ${error.message}`); // Log Error
      return of(result as T); // Return default value -> prevent app crashes
    };
  }
}