import { Component } from '@angular/core';
import { AuthService } from './shared/auth.service';
import { Router, NavigationEnd } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'online-learning-platform';
  constructor(public authService: AuthService, private router: Router) {}
  // reloadPage() {
  //   this.router.navigate(['.'], { relativeTo: this.router.routerState.root });
  // }

  async onLogin() {
    await this.authService.googleSignIn();
  }

  async onLogout() {
    await this.authService.signOut();
  }
}
