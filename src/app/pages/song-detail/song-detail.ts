import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Title, Meta } from '@angular/platform-browser';
import { SongService } from '../../core/services/song.service';
import { LyricsViewerInteractive } from '../../components/client/lyrics-viewer-interactive/lyrics-viewer-interactive';
import { Breadcrumb, BreadcrumbItem } from '../../components/breadcrumb/breadcrumb';

@Component({
  selector: 'app-song-detail',
  standalone: true,
  imports: [CommonModule, LyricsViewerInteractive, Breadcrumb],
  templateUrl: './song-detail.html',
  styleUrl: './song-detail.scss',
})
export class SongDetailComponent {
  private route = inject(ActivatedRoute);
  private songService = inject(SongService);
  private titleService = inject(Title);
  private metaService = inject(Meta);

  song = signal<any>(null);

  isLongSongLayout = computed(() => {
    const s = this.song();
    return s && s.lyrics.split('\n').length > 20;
  });

  breadcrumbItems = computed<BreadcrumbItem[]>(() => {
    const s = this.song();
    if (!s) return [];

    const category = this.songService.categories().find(c => c.letter === s.category);
    const items: BreadcrumbItem[] = [
      { label: 'Inicio', href: '/' },
      { label: 'Categorías', href: '/categorias' },
    ];

    if (category) {
      items.push({ label: category.description, href: `/categorias/${category.slug}` });
    }

    items.push({ label: s.title });
    return items;
  });

  navigation = computed(() => {
    const s = this.song();
    if (!s) return {};
    return this.songService.getSequentialNavigation(s.slug);
  });

  prevSongSlug = computed(() => this.navigation().prev);
  nextSongSlug = computed(() => this.navigation().next);

  constructor() {
    this.route.params.subscribe(params => {
      const slug = params['slug'];
      const s = this.songService.getSongBySlug(slug);
      this.song.set(s);

      if (s) {
        this.updateMetadata(s);
      }
    });
  }

  private updateMetadata(song: any) {
    const title = `${song.title} (${song.code}) - El Tocho`;
    const description = `Letra y acordes de ${song.title} (${song.code}). Cancionero El Tocho. Categoría: ${song.category}. Autor: ${song.author || 'Desconocido'}.`;

    this.titleService.setTitle(title);
    this.metaService.updateTag({ name: 'description', content: description });

    // Open Graph
    this.metaService.updateTag({ property: 'og:title', content: title });
    this.metaService.updateTag({ property: 'og:description', content: description });
    this.metaService.updateTag({ property: 'og:type', content: 'music.song' });
  }
}
