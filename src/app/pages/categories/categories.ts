import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SongService } from '../../core/services/song.service';
import { CategoryNavigation } from '../../components/category-navigation/category-navigation';
import { Breadcrumb, BreadcrumbItem } from '../../components/breadcrumb/breadcrumb';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterModule, CategoryNavigation, Breadcrumb],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class CategoriesComponent {
  public songService = inject(SongService);

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', href: '/' },
    { label: 'Categorías' },
  ];
}
