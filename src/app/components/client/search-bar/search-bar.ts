import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ThemeService } from '../../../core/services/theme.service';
import { searchSongs } from '../../../core/data/songs';
import { Song } from '../../../core/data/songs';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './search-bar.html',
  styleUrl: './search-bar.scss',
})
export class SearchBar {
  private router = inject(Router);
  public themeService = inject(ThemeService);

  searchTerm = signal('');
  searchResults = signal<Song[]>([]);

  constructor() {
    effect(() => {
      const term = this.searchTerm().trim();
      if (term.length > 0) {
        const results = searchSongs(term, {
          priorityFields: ['title', 'author', 'lyrics', 'code'],
          limit: 5,
        });
        this.searchResults.set(results);
      } else {
        this.searchResults.set([]);
      }
    });
  }

  handleSongClick(songSlug: string) {
    this.router.navigate(['/canciones', songSlug]);
  }

  clearSearch() {
    this.searchTerm.set('');
  }
}
