import { Routes } from '@angular/router';
import { HomeOrganizerComponent } from './organizer/pages/home-organizer/home-organizer.component';
import { NavOrganizerComponent } from './component/nav-organizer/nav-organizer.component';
import { ExportFileComponent } from './organizer/pages/export-file/export-file.component';

export const routes: Routes = [
    { 
    path: 'organizer',
    component: NavOrganizerComponent,
    children: [
      { path: 'events', component: HomeOrganizerComponent },
      { path: 'export-file', component: ExportFileComponent },
    ]
  },
];
