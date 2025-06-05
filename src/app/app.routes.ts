import { RouterModule, Routes } from '@angular/router';
import { HomeOrganizerComponent } from './organizer/pages/home-organizer/home-organizer.component';
import { NavOrganizerComponent } from './component/nav-organizer/nav-organizer.component';
import { ExportFileComponent } from './organizer/pages/export-file/export-file.component';
import { HomeUserComponent } from './user/pages/home-user/home-user.component';
import { HomeAdminComponent } from './admin/pages/home-admin/home-admin.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { ForgotPasswordComponent } from './auth/forgot-password/forgot-password.component';
import { CreateEventComponent } from './organizer/pages/create-event/create-event.component';
import { ProfileComponent } from './organizer/pages/profile/profile.component';
import { DetailTicketComponent } from './user/pages/detail-ticket/detail-ticket.component';
import { ApprovalRequestComponent } from './admin/pages/approval-request/approval-request.component';
import { NgModule } from '@angular/core';
import { DashboardComponent } from './admin/pages/dashboard/dashboard.component';
import { UserManagementComponent } from './admin/pages/user-management/user-management.component';
import { SelectTicketComponent } from './user/pages/select-ticket/select-ticket.component';
export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'reset-password', component: ForgotPasswordComponent },

  {
    path: 'organizer',
    component: NavOrganizerComponent,
    children: [
      { path: '', redirectTo: 'events', pathMatch: 'full' },
      { path: 'events', component: HomeOrganizerComponent },
      { path: 'export-file', component: ExportFileComponent },
      { path: 'create-event', component: CreateEventComponent },
      { path: 'profile', component: ProfileComponent },
    ]
  },



  // Home
  {
    path: '',
    component: HomeUserComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
    ]
  },
    {
       path: 'detail-ticket', component: DetailTicketComponent
    },
    {
      path: 'select-ticket', component: SelectTicketComponent
    },

// Admin routes
  {
    path: 'admin',
    component: HomeAdminComponent,
    children: [
      { path: '', component: DashboardComponent }, // Sử dụng DashboardComponent cho /admin
      { path: 'approval-request', component: ApprovalRequestComponent },
      { path: 'user-management', component: UserManagementComponent },
    ],
  },

  // Chuyển hướng mặc định và wildcard
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
