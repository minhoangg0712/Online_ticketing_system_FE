import { Routes } from '@angular/router';
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

export const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: 'signup', component: RegisterComponent},
  { path: 'reset-password', component: ForgotPasswordComponent},

  { path: 'organizer',
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
  { path: '', 
    component: HomeUserComponent,
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
  ] },




  {
    path: 'admin',
    component: HomeAdminComponent,
   
  },
];
