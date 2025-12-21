import { Component, Input, computed, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { Song } from '../../core/data/songs';
import { SongItemControls } from '../client/song-item-controls/song-item-controls';
import { DebouncedCategorySearchInput } from '../client/debounced-category-search-input/debounced-category-search-input';
import { ThemeService } from '../../core/services/theme.service';

export type SongSortField = keyof Song;
export type SortOrder = 'asc' | 'desc';

@Component({
  selector: 'app-category-song-list',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, SongItemControls, DebouncedCategorySearchInput],
  templateUrl: './category-song-list.html',
  styleUrl: './category-song-list.scss',
})
export class CategorySongList {
  @Input() songs: Song[] = [];
  @Input() categoryName: string = '';
  @Input() currentSearchTerm?: string;
  @Input() basePath: string = '';
  @Input() sortBy: SongSortField = 'code';
  @Input() sortOrder: SortOrder = 'asc';
  @Input() isSearching: boolean = false;

  public themeService = inject(ThemeService);

  processedSongs = computed(() => {
    let list = [...this.songs];
    const sortBy = this.sortBy;
    const sortOrder = this.sortOrder;

    list.sort((a: any, b: any) => {
      const valA = String(a[sortBy] ?? '');
      const valB = String(b[sortBy] ?? '');

      if (sortBy === 'code') {
        const matchA = valA.match(/^([A-Z]+)(\d+)$/);
        const matchB = valB.match(/^([A-Z]+)(\d+)$/);

        const letterA = matchA ? matchA[1] : valA;
        const numA = matchA ? parseInt(matchA[2], 10) : 0;
        const letterB = matchB ? matchB[1] : valB;
        const numB = matchB ? parseInt(matchB[2], 10) : 0;

        if (letterA.toLowerCase() < letterB.toLowerCase()) return sortOrder === 'asc' ? -1 : 1;
        if (letterA.toLowerCase() > letterB.toLowerCase()) return sortOrder === 'asc' ? 1 : -1;
        if (numA < numB) return sortOrder === 'asc' ? -1 : 1;
        if (numA > numB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      } else {
        const strA = valA.toLowerCase();
        const strB = valB.toLowerCase();
        if (strA < strB) return sortOrder === 'asc' ? -1 : 1;
        if (strA > strB) return sortOrder === 'asc' ? 1 : -1;
        return 0;
      }
    });

    return list;
  });
}
