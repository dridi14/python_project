import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MenuComponent } from '../menu/menu.component';
import { BaseComponent } from '../base/base.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  imports: [CommonModule, RouterModule, MenuComponent],
})
export class LandingPageComponent extends BaseComponent {
  constructor(private router: Router) {
    super();
  }

  override navigate(direction: 'up' | 'down') {
    if (direction === 'down') {
      this.router.navigate(['/top-tracks-popularity']);
    }
  }
}
