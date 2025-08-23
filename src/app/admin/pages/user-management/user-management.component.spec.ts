import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { UserManagementComponent } from './user-management.component';
import { AdminService } from '../service/admin.service';
import { of, throwError } from 'rxjs';
import { ChangeDetectorRef } from '@angular/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DomSanitizer } from '@angular/platform-browser';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;
  let adminServiceSpy: jasmine.SpyObj<AdminService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AdminService', [
      'getUsers',
      'deleteUser',
      'deleteUsers',
      'disableUser',
      'disableUsers',
      'approveOrganizer',
      'getReviewsByUserId'
    ]);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, UserManagementComponent],
      providers: [
        { provide: AdminService, useValue: spy },
        ChangeDetectorRef,
        DomSanitizer
      ]
    }).compileComponents();

    adminServiceSpy = TestBed.inject(AdminService) as jasmine.SpyObj<AdminService>;

    // ✅ Mặc định mock getUsers để tránh lỗi undefined.subscribe
    adminServiceSpy.getUsers.and.returnValue(of({ data: { listUsers: [] } }));

    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', fakeAsync(() => {
    const mockUsers = [{ id: 1, role: 'user', status: 'active' }];
    adminServiceSpy.getUsers.and.returnValue(of({ data: { listUsers: mockUsers } }));

    component.ngOnInit();
    tick();

    expect(adminServiceSpy.getUsers).toHaveBeenCalled();
    expect(component.users).toEqual(mockUsers);
    expect(component.filteredUsers.length).toBe(1);
  }));

  it('should handle error when loading users', fakeAsync(() => {
    adminServiceSpy.getUsers.and.returnValue(throwError(() => ({ statusText: 'Error' })));

    component.loadUsers();
    tick();

    expect(component.showErrorModal).toBeTrue();
    expect(component.modalMessage).toContain('Có lỗi xảy ra');
  }));

  it('should filter users by role and status', () => {
    component.users = [
      { id: 1, role: 'admin', status: 'active' },
      { id: 2, role: 'organizer', status: 'pending' }
    ];

    component.filterRole = 'organizer';
    component.filterStatus = 'pending';
    component.applyFilter();

    expect(component.filteredUsers.length).toBe(1);
    expect(component.filteredUsers[0].id).toBe(2);
  });

  it('should confirm delete user', () => {
    component.confirmDeleteUser(1, 'Test User');
    expect(component.userToDelete).toEqual({ id: 1, name: 'Test User' });
    expect(component.actionType).toBe('delete');
    expect(component.showConfirmModal).toBeTrue();
  });

  it('should execute delete user successfully', fakeAsync(() => {
    adminServiceSpy.deleteUser.and.returnValue(of({}));

    component['executeDeleteUser'](1, 'Test User');
    tick();

    expect(adminServiceSpy.deleteUser).toHaveBeenCalledWith(1);
    expect(component.showSuccessModal).toBeTrue();
    expect(component.modalMessage).toContain('thành công');
  }));

  it('should handle error when deleting user', fakeAsync(() => {
    adminServiceSpy.deleteUser.and.returnValue(throwError(() => ({ statusText: 'Delete Error' })));

    component['executeDeleteUser'](1, 'Test User');
    tick();

    expect(component.showErrorModal).toBeTrue();
    expect(component.modalMessage).toContain('Có lỗi');
  }));

  it('should approve organizer successfully', fakeAsync(() => {
    adminServiceSpy.approveOrganizer.and.returnValue(of({}));

    component['executeApproveUser'](1, 'Organizer');
    tick();

    expect(adminServiceSpy.approveOrganizer).toHaveBeenCalledWith(1);
    expect(component.showSuccessModal).toBeTrue();
  }));

  it('should disable user successfully', fakeAsync(() => {
    adminServiceSpy.disableUser.and.returnValue(of({}));

    component['executeDisableUser'](1, 'User');
    tick();

    expect(adminServiceSpy.disableUser).toHaveBeenCalledWith(1);
    expect(component.showSuccessModal).toBeTrue();
  }));

  it('should open and close detail modal', () => {
    const user = { id: 99, name: 'Detail User' };
    component.showUserDetails(user);

    expect(component.selectedUser).toEqual(user);
    expect(component.showDetailModal).toBeTrue();

    component.closeDetailModal();
    expect(component.selectedUser).toBeNull();
    expect(component.showDetailModal).toBeFalse();
  });
});
