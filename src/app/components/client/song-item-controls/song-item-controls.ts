import { Component, Input, inject, signal, effect, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { LucideAngularModule } from 'lucide-angular';
import { environment } from '../../../../environments/environment';
import { ThemeService } from '../../../core/services/theme.service';
import { SongPreviewService } from '../../../core/services/song-preview.service';
import { FavoritesService } from '../../../core/services/favorites.service';
import { Song } from '../../../core/data/songs';
import { WaveformPreview } from '../../ui/waveform-preview/waveform-preview';

@Component({
  selector: 'app-song-item-controls',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, WaveformPreview],
  templateUrl: './song-item-controls.html',
  styleUrl: './song-item-controls.scss',
})
export class SongItemControls implements OnDestroy {
  @Input({ required: true }) song!: Song;

  public themeService = inject(ThemeService);
  public previewService = inject(SongPreviewService);
  public favoritesService = inject(FavoritesService);
  private platformId = inject(PLATFORM_ID);

  private audio: HTMLAudioElement | null = null;
  private isBrowser = isPlatformBrowser(this.platformId);

  constructor() {
    effect(() => {
      if (!this.isBrowser) return;

      const activeId = this.previewService.activePreviewSongId();
      const isPlaying = activeId === this.song.id;

      if (isPlaying) {
        if (!this.audio) {
          const audioUrl = `${environment.downloadsBaseUrl}/${this.song.slug}.mp3`;
          this.audio = new Audio(audioUrl);
          this.audio.addEventListener('ended', () => this.previewService.activePreviewSongId.set(null));
        }
        this.audio.currentTime = 0;
        this.audio.play().catch(console.error);
      } else if (this.audio) {
        this.audio.pause();
      }
    });
  }

  togglePreview(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.previewService.togglePreview(this.song.id);
  }

  toggleFavorite(event: MouseEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.favoritesService.toggleFavorite(this.song.id);
  }

  ngOnDestroy() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
}
