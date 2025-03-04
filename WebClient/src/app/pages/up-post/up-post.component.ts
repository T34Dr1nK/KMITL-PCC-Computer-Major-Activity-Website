import { Component, inject, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from '../../../environments/environment.development'; // Environment Variable
@Component({
  standalone: true,
  selector: 'app-up-post',
  imports: [QuillModule, FormsModule, ReactiveFormsModule, CommonModule, HttpClientModule],
  templateUrl: './up-post.component.html',
  styleUrls: ['./up-post.component.css']
})
export class UpPostComponent {
  lastScrollTop = 0;
  navbarVisible = true;
  selectedFiles: File[] = [];  // สำหรับเก็บไฟล์ที่อัปโหลด
  eventDescription: string = '';
  eventForm: FormGroup;
  private http = inject(HttpClient);

  // Tools bar Quill modules
  quillConfig = {
    modules: {
      toolbar: [
        [{ 'header': '1' }, { 'header': '2' }],
        [{ 'align': [] }],
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered' }, { 'list': 'bullet' }],
        ['link']
      ]
    }
  };

  constructor(private fb: FormBuilder) {
    this.eventForm = this.fb.group({
      title: ['', Validators.required, Validators.maxLength(120)],
      description: ['', Validators.required],
      location: ['', Validators.required],
      advisor: ['', Validators.required],
      type: ['event', Validators.required],
      image: [null]
    });
  }

  // สำหรับตรวจจับ Scroll Bar และซ่อน Navbar
  @HostListener('window:scroll', ['$event'])
  onWindowScroll() {
    const currentScroll = window.scrollY || document.documentElement.scrollTop;
    this.navbarVisible = currentScroll < this.lastScrollTop;
    this.lastScrollTop = Math.max(currentScroll, 0);
  }

  // ฟังก์ชันส่งฟอร์มข้อมูล
  submitForm() {
    if (this.eventForm.invalid) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    const formData = new FormData();

    formData.append('title', this.eventForm.get('title')?.value);
    formData.append('description', this.eventForm.get('description')?.value);
    formData.append('location', this.eventForm.get('location')?.value);
    formData.append('advisor', this.eventForm.get('advisor')?.value);
    formData.append('type', this.eventForm.get('type')?.value);

    // ถ้ามีไฟล์ในฟอร์ม (ฟังก์ชันสำหรับอัปโหลดรูปหลัก)
    if (this.selectedFiles.length > 0) {
      this.selectedFiles.forEach(file => {
        formData.append('images[]', file, file.name);
      });
    }

    // ส่งข้อมูลไปยัง API
    this.sendDataToAPI(formData);
  }

  // ฟังก์ชันส่งข้อมูลไปยัง API
  sendDataToAPI(formData: FormData) {
    this.http.post(`${environment.apiBaseUrl}/posts`, formData).subscribe({
      next: (response) => {
        console.log('✅ ส่งข้อมูลสำเร็จ:', response);
        alert('✅ ส่งข้อมูลสำเร็จ!');

        // รีเซ็ตค่า Form และไฟล์ที่เลือกหลังอัปโหลดสำเร็จ
        this.eventForm.reset();
        this.selectedFiles = [];
      },
      error: (error) => {
        console.error('❌ เกิดข้อผิดพลาด:', error);
        alert('❌ เกิดข้อผิดพลาดในการส่งข้อมูล');
      }
    });
  }

  // ฟังก์ชันจัดการไฟล์ที่เลือก
  onFileChange(event: any) {
    const files = event.target.files;
    if (files.length > 0) {
      this.selectedFiles = Array.from(files);
    }
  }

  // ฟังก์ชันแสดงตัวอย่างภาพที่อัปโหลด
  getImagePreview(file: File): string {
    const objectURL = URL.createObjectURL(file);

    // ล้าง Memory หลังจากสร้าง ObjectURL
    setTimeout(() => URL.revokeObjectURL(objectURL), 10000);
    return objectURL;
  }
}