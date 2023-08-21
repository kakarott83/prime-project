import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'prime-project';
  isHidden = 'true';

  constructor() {
    localStorage.setItem('userId', '3');
  }
}
