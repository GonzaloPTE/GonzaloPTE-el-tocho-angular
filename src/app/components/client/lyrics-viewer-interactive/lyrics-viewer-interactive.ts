import { Component, Input, inject, signal, computed, effect, OnDestroy, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { environment } from '../../../../environments/environment';
import { ThemeService } from '../../../core/services/theme.service';
import { Song } from '../../../core/data/songs';
import { transposeFullLyrics } from '../../../core/utils';
import { Waveform } from '../../ui/waveform/waveform';
import { TransposeControl } from '../../ui/transpose-control/transpose-control';

@Component({
  selector: 'app-lyrics-viewer-interactive',
  standalone: true,
  imports: [CommonModule, LucideAngularModule, Waveform, TransposeControl],
  templateUrl: './lyrics-viewer-interactive.html',
  styleUrl: './lyrics-viewer-interactive.scss',
})
export class LyricsViewerInteractive implements OnDestroy {
  @Input({ required: true }) set song(value: Song) {
    this._song.set(value);
  }
  get song() { return this._song(); }

  private _song = signal<Song>({} as Song);
  private router = inject(Router);
  public themeService = inject(ThemeService);
  private platformId = inject(PLATFORM_ID);

  transpose = signal(0);
  isPlaying = signal(false);
  currentTime = signal(0);
  duration = signal(0);

  mockWaveformData = Array(100).fill(0).map(() => Math.random());

  private audio: HTMLAudioElement | null = null;
  private isBrowser = isPlatformBrowser(this.platformId);

  displayLyrics = computed(() => {
    return transposeFullLyrics(this.song.lyrics, this.transpose());
  });

  formattedCurrentTime = computed(() => this.formatTime(this.currentTime()));
  formattedDuration = computed(() => this.formatTime(this.duration()));

  constructor() {
    effect(() => {
      if (!this.isBrowser) return;

      const song = this._song();
      const canPlayAudio = !!song.audioUrl;
      const audioFileUrl = canPlayAudio ? `${environment.downloadsBaseUrl}/${song.slug}.mp3` : '';

      if (this.audio) {
        this.audio.pause();
        this.isPlaying.set(false);
        this.currentTime.set(0);
        this.audio.src = audioFileUrl;
      } else if (audioFileUrl) {
        this.audio = new Audio(audioFileUrl);
        this.audio.addEventListener('loadedmetadata', () => this.duration.set(this.audio!.duration));
        this.audio.addEventListener('timeupdate', () => this.currentTime.set(this.audio!.currentTime));
        this.audio.addEventListener('ended', () => {
          this.isPlaying.set(false);
          this.currentTime.set(0);
        });
      }

      if (this.audio && audioFileUrl) {
        this.audio.load();
      }
    });
  }

  togglePlayPause() {
    if (this.audio) {
      if (this.isPlaying()) {
        this.audio.pause();
      } else {
        this.audio.play().catch(console.error);
      }
      this.isPlaying.update(v => !v);
    }
  }

  handleSeek(time: number) {
    if (this.audio) {
      this.audio.currentTime = time;
      this.currentTime.set(time);
    }
  }

  handleRewind() {
    this.handleSeek(Math.max(0, this.currentTime() - 10));
  }

  handleFastForward() {
    this.handleSeek(Math.min(this.duration(), this.currentTime() + 10));
  }

  @Input() nextSongSlug?: string;
  @Input() prevSongSlug?: string;

  handlePrevSong() {
    if (this.prevSongSlug) {
      this.router.navigate(['/canciones', this.prevSongSlug]);
    }
  }

  handleNextSong() {
    if (this.nextSongSlug) {
      this.router.navigate(['/canciones', this.nextSongSlug]);
    }
  }

  private formatTime(time: number) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }

  ngOnDestroy() {
    if (this.audio) {
      this.audio.pause();
      this.audio = null;
    }
  }
}
