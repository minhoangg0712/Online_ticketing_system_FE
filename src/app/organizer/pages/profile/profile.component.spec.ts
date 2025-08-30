import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProfileComponent } from './profile.component';
import { ProfileService } from '../../services/profile.service';
import { AuthService } from '../../../auth/services/auth.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';

// Mock ToastNotificationComponent
class MockToastNotificationComponent {
  showNotification(message: string, duration: number, type: string) {}
}

// Mock services
const mockProfileService = {
  getUserInfo: jasmine.createSpy('getUserInfo'),
  updateUserProfile: jasmine.createSpy('updateUserProfile'),
  uploadAvatar: jasmine.createSpy('uploadAvatar'),
};

const mockAuthService = {};

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;

  beforeEach(async () => {
    mockProfileService.getUserInfo.and.returnValue(of({ data: {} }));
    mockProfileService.updateUserProfile.and.returnValue(of({}));   // ✅ thêm dòng này
    mockProfileService.uploadAvatar.and.returnValue(of({})); 

    await TestBed.configureTestingModule({
      imports: [ProfileComponent, ReactiveFormsModule], // standalone component => imports
      providers: [
        FormBuilder,
        { provide: ProfileService, useValue: mockProfileService },
        { provide: AuthService, useValue: mockAuthService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;

    // Gắn mock notification
    component.notification = new MockToastNotificationComponent() as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getUserProfile', () => {
    it('should patch form with user data on success', () => {
      const mockData = {
        data: {
          fullName: 'John Doe',
          email: 'john@example.com',
          phoneNumber: '123456789',
          address: 'HN',
          avatarUrl: 'avatar.png',
          bio: 'Hello',
        },
      };
      mockProfileService.getUserInfo.and.returnValue(of(mockData));

      component.getUserProfile();

      expect(component.profileForm.value.fullName).toBe('John Doe');
      expect(component.originalProfileData.fullName).toBe('John Doe');
    });

    it('should handle error', () => {
      mockProfileService.getUserInfo.and.returnValue(throwError(() => new Error('error')));
      component.getUserProfile();
      // Không crash
      expect(true).toBeTrue();
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.originalProfileData = {
        fullName: 'Old Name',
        phoneNumber: '111',
        address: 'HN',
        bio: 'old bio',
        email: 'old@example.com',   
    avatarUrl: 'old.png' 
      };
      component.profileForm.setValue({
        fullName: 'Old Name',
        email: 'old@example.com',
        phoneNumber: '111',
        address: 'HN',
        bio: 'old bio',
        avatarUrl: 'old.png',
      });
    });

    it('should show warning if nothing changed', () => {
      spyOn(component.notification, 'showNotification');
      component.selectedFile = null;
      component.onSubmit();
      expect(component.notification.showNotification).toHaveBeenCalledWith(
        'Không có thay đổi nào để cập nhật',
        5000,
        'warning'
      );
    });

    it('should update profile only if data changed', () => {
      spyOn(component, 'updateProfileOnly');
      component.profileForm.patchValue({ fullName: 'New Name' });
      component.selectedFile = null;

      component.onSubmit();
      expect(component.updateProfileOnly).toHaveBeenCalled();
    });

    it('should upload avatar only if avatar changed', () => {
      spyOn(component, 'uploadAvatarOnly');
      component.selectedFile = new File(['dummy'], 'avatar.png', { type: 'image/png' });

      component.onSubmit();
      expect(component.uploadAvatarOnly).toHaveBeenCalled();
    });
  });

  describe('saveCroppedImage', () => {
    it('should set cropped image to form and selectedFile', () => {
      const base64 = 'data:image/png;base64,AAAA';
      component.croppedImage = base64;
      component.selectedFile = new File(['dummy'], 'avatar.png', { type: 'image/png' });

      component.saveCroppedImage();

      expect(component.profileForm.get('avatarUrl')?.value).toBe(base64);
      expect(component.selectedFile).toBeTruthy();
    });
  });

  describe('uploadAvatarOnly', () => {
    it('should call service and show success notification', () => {
      mockProfileService.uploadAvatar.and.returnValue(of({ ok: true }));
      spyOn(component.notification, 'showNotification');
      component.selectedFile = new File(['dummy'], 'avatar.png', { type: 'image/png' });

      component.uploadAvatarOnly();
      expect(component.notification.showNotification).toHaveBeenCalledWith(
        'Cập nhật ảnh đại diện thành công',
        5000,
        'success'
      );
    });

    it('should show error notification on failure', () => {
      mockProfileService.uploadAvatar.and.returnValue(
        throwError(() => new HttpErrorResponse({ error: 'Upload error' }))
      );
      spyOn(component.notification, 'showNotification');
      component.selectedFile = new File(['dummy'], 'avatar.png', { type: 'image/png' });

      component.uploadAvatarOnly();
      expect(component.notification.showNotification).toHaveBeenCalledWith(
        'Không upload được ảnh đại diện!',
        5000,
        'error'
      );
    });
  });
});
