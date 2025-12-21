import { Component, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ThemeService } from '../../core/services/theme.service';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class Breadcrumb {
  @Input() items: BreadcrumbItem[] = [];
  @Input() showBackButton: boolean = false;

  public themeService = inject(ThemeService);

  goBack() {
    window.history.back();
  }
}
