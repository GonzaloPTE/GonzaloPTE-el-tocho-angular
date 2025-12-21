import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { SongService } from '../../core/services/song.service';
import { Breadcrumb, BreadcrumbItem } from '../../components/breadcrumb/breadcrumb';
import { CategorySongList } from '../../components/category-song-list/category-song-list';

@Component({
  selector: 'app-songs-list',
  standalone: true,
  imports: [CommonModule, RouterModule, Breadcrumb, CategorySongList],
  templateUrl: './songs-list.html',
  styleUrl: './songs-list.scss',
})
export class SongsListComponent {
  private songService = inject(SongService);
  private route = inject(ActivatedRoute);

  searchTerm = signal('');

  breadcrumbItems: BreadcrumbItem[] = [
    { label: 'Inicio', href: '/' },
    { label: 'Cancionero Completo' },
  ];

  totalSongs = this.songService.songs().length;
  totalCategories = this.songService.categories().length;

  songsToDisplay = computed(() => {
    const term = this.searchTerm();
    if (!term) return this.songService.songs();

    return this.songService.searchSongs(term, {
      priorityFields: ['title', 'author', 'lyrics', 'code']
    });
  });

  isSearching = computed(() => !!this.searchTerm());

  constructor() {
    this.route.queryParams.subscribe(params => {
      this.searchTerm.set(params['search'] || '');
    });
  }
}
