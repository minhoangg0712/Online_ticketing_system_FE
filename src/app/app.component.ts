import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderUserComponent } from "./component/header-user/header-user.component";
import { CommonModule } from "@angular/common";
import { FooterUserComponent } from "./component/footer-user/footer-user.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderUserComponent, CommonModule, FooterUserComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Online_ticketing_system_FE';
  isAuthPage: boolean = false;
}
