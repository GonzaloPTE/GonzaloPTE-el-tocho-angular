import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Breadcrumb, BreadcrumbItem } from '../../components/breadcrumb/breadcrumb';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, Breadcrumb],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class AboutComponent {
  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', href: '/' },
    { label: 'Acerca de El Tocho' },
  ];
}
