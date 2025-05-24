import { Routes } from '@angular/router';
import { HomeOrganizerComponent } from './organizer/pages/home-organizer/home-organizer.component';
import { NavOrganizerComponent } from './component/nav-organizer/nav-organizer.component';
import { ExportFileComponent } from './organizer/pages/export-file/export-file.component';
import { HomeUserComponent } from './user/pages/home-user/home-user.component';
import { HomeAdminComponent } from './admin/pages/home-admin/home-admin.component';
export const routes: Routes = [
  {
    path: 'organizer',
    component: NavOrganizerComponent,
    children: [
      { path: 'events', component: HomeOrganizerComponent },
      { path: 'export-file', component: ExportFileComponent },
    ]
  },
  { path: 'home', component: HomeUserComponent },
  {
    path: 'admin',
    component: HomeAdminComponent,
    // children: [
    //   { path: 'home', component: HomeAdminComponent },
    // ]
  }
];
