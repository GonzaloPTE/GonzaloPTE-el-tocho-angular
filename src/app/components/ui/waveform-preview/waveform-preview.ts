import { Component, Input, OnInit, OnDestroy, inject, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-waveform-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './waveform-preview.html',
  styleUrl: './waveform-preview.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    'class': 'block w-full h-full'
  }
})
export class WaveformPreview implements OnInit, OnDestroy {
  public themeService = inject(ThemeService);

  waveformData = signal<number[]>(Array(20).fill(0.5));
  private intervalId?: any;

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.waveformData.update(current => current.map(() => Math.random() * 0.8 + 0.2));
    }, 100);
  }

  trackByIndex(index: number, item: number): number {
    return index;
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}
