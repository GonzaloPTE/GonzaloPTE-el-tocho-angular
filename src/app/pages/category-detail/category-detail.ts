import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { SongService } from '../../core/services/song.service';
import { CategorySongList } from '../../components/category-song-list/category-song-list';
import { Breadcrumb, BreadcrumbItem } from '../../components/breadcrumb/breadcrumb';

@Component({
  selector: 'app-category-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, CategorySongList, Breadcrumb],
  templateUrl: './category-detail.html',
  styleUrl: './category-detail.scss',
})
export class CategoryDetailComponent {
  private route = inject(ActivatedRoute);
  private songService = inject(SongService);

  category = signal<any>(null);
  searchTerm = signal('');

  songsForCategory = computed(() => {
    const cat = this.category();
    if (!cat) return [];

    let songs = this.songService.getSongsByCategory(cat.letter);
    const term = this.searchTerm();
    if (term) {
      songs = this.songService.searchSongs(term, {
        songsToSearch: songs,
        priorityFields: ['title', 'author', 'lyrics', 'code']
      });
    }
    return songs;
  });

  breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    const cat = this.category();
    if (!cat) return [];
    return [
      { label: 'Inicio', href: '/' },
      { label: 'Categorías', href: '/categorias' },
      { label: cat.description }
    ];
  });

  constructor() {
    this.route.params.subscribe(params => {
      const slug = params['categorySlug'];
      const cat = this.songService.getCategoryBySlug(slug);
      this.category.set(cat);
    });

    this.route.queryParams.subscribe(params => {
      this.searchTerm.set(params['search'] || '');
    });
  }
}
