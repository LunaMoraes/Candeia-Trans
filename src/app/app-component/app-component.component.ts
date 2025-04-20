import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app-component.component.html',
  styleUrls: ['./app-component.component.css']
})
export class AppComponentComponent {
  title = 'Candeia Trans';
}
