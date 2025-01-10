import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-base',
  standalone: true,
  imports: [],
  templateUrl: './base.component.html',
  styleUrl: './base.component.css'
})
export class BaseComponent {
  lastScrollTime = Date.now();

  @HostListener('window:wheel', ['$event'])
    onWheel(event: WheelEvent) {
      if (Date.now() - this.lastScrollTime < 200) return;
      this.lastScrollTime = Date.now();
      if (event.deltaY > 0) {
        this.navigate('down');
      } else if (event.deltaY < 0) {
        this.navigate('up');
      }
    }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'ArrowDown') {
      this.navigate('down');
    } else if (event.key === 'ArrowUp') {
      this.navigate('up');
    }
  }

  navigate(direction: 'up' | 'down') {
  }
}
