import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Category } from '../../core/data/songs';

@Component({
  selector: 'app-category-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-navigation.html',
  styleUrl: './category-navigation.scss',
})
export class CategoryNavigation {
  @Input() categories: Category[] = [];
}
