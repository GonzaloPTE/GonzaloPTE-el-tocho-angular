import { Component, Input, OnInit, OnDestroy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-debounced-category-search-input',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './debounced-category-search-input.html',
  styleUrl: './debounced-category-search-input.scss',
})
export class DebouncedCategorySearchInput implements OnInit, OnDestroy {
  @Input() categoryName: string = '';
  @Input() basePath: string = '';
  @Input() debounceMs: number = 500;

  public themeService = inject(ThemeService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  inputValue = signal('');
  @Input() initialSearchTerm?: string;
  private timerId?: any;

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const term = params['search'] || '';
      this.initialSearchTerm = term;
      this.inputValue.set(term);
    });
  }

  onInputChange(value: string) {
    this.inputValue.set(value);
    if (this.timerId) clearTimeout(this.timerId);

    this.timerId = setTimeout(() => {
      this.debouncedSearch(value);
    }, this.debounceMs);
  }

  private debouncedSearch(searchTerm: string) {
    const term = searchTerm.trim();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { search: term || null },
      queryParamsHandling: 'merge',
    });
  }

  ngOnDestroy() {
    if (this.timerId) clearTimeout(this.timerId);
  }
}
