import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-register-organizer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-organizer.component.html',
  styleUrls: ['./register-organizer.component.css']
})
export class RegisterOrganizerComponent implements OnInit {
  registerForm!: FormGroup;

  message: string = '';
  isLoading = false;
  serverResponse: any = null;

  profilePicturePreview: string | null = null;
  @ViewChild('profilePictureInput') profilePictureInputRef!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
  this.registerForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [
      Validators.required,
      Validators.minLength(10),
      Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{10,}$/)
    ]],
    confirmPassword: ['', Validators.required],
    name: ['', [Validators.required, Validators.pattern(/^[a-zA-ZÀ-ỹ\s]+$/)]],
    phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10,11}$/)]],
    bio: ['', Validators.required],
    profilePicture: ['']
  }, { validators: this.passwordMatchValidator });
  }


  // Custom validator to check password match
  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onRegister(): void {

  if (this.registerForm.invalid) {
    this.message = 'Vui lòng điền đầy đủ và chính xác thông tin!';
    this.registerForm.markAllAsTouched();
    return;
  }

  const { email, password, confirmPassword, name, phoneNumber, bio, profilePicture } = this.registerForm.value;

  this.isLoading = true;
  this.message = 'Đang đăng ký...';

  this.authService.registerOrganizer(email, name, bio, password, confirmPassword, phoneNumber, profilePicture).subscribe({
    next: (res: any) => {
      this.isLoading = false;
      this.serverResponse = res;
      this.message = res?.message || 'Đăng ký thành công!';
      this.router.navigate(['/login']);
    },
    error: (err: any) => {
      this.isLoading = false;
      this.serverResponse = err;

      let errorMsg = '';
      try {
        const parsedError = JSON.parse(err.error);
        if (Array.isArray(parsedError)) {
          errorMsg = parsedError.join('\n');
        } else if (parsedError.error) {
          errorMsg = parsedError.error;
        } else {
          errorMsg = err.error;
        }
      } catch (e) {
        errorMsg = err.error || err.statusText || 'Đăng ký thất bại!';
      }

      this.message = errorMsg;
    }
  });
  }


  triggerFileInput(inputType: string): void {
    if (inputType === 'profilePicture') {
      this.profilePictureInputRef.nativeElement.click();
    }
  }

  onImageSelected(event: Event, type: string): void {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    alert('Vui lòng chọn file hình ảnh!');
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    alert('Kích thước ảnh không được vượt quá 5MB!');
    return;
  }

  const reader = new FileReader();
  reader.onload = () => {
    const imageDataUrl = reader.result as string;
    if (type === 'profilePicture') {
      this.profilePicturePreview = imageDataUrl;
      this.registerForm.patchValue({ profilePicture: imageDataUrl });
    }
  };

  reader.readAsDataURL(file);
  }


  goToHome() {
    this.router.navigate(['/']);
  }
}
