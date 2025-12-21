import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { siteName } from '../../../core/config/site';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './footer.html',
  styleUrl: './footer.scss',
})
export class Footer {
  siteName = siteName;
}
