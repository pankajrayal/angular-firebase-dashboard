import { Component, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';
declare var particleJS: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'grid-dashboard';

  constructor(public auth: AuthService) {}

  ngOnInit() {
    // particleJS.load('particles', 'assets/particles.json', () => {
    //   console.log('callback - particles.js config loaded');
    // });
  }
  logout() {
    this.auth.logout();
  }
}
