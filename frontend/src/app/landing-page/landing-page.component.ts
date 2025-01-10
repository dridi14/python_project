import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css'],
  imports: [CommonModule, RouterModule],
})
export class LandingPageComponent {
  constructor(private router: Router) {}

  @HostListener('window:wheel', ['$event'])
  onWheel(event: WheelEvent) {
    if (event.deltaY > 0) {
      // Scroll down
      this.router.navigate(['/top-tracks-popularity']);
    }
  }
}
