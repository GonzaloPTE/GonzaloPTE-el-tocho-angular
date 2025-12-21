import { Component, Input, Output, EventEmitter, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../core/services/theme.service';

@Component({
  selector: 'app-waveform',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './waveform.html',
  styleUrl: './waveform.scss',
})
export class Waveform {
  @Input() currentTime: number = 0;
  @Input() duration: number = 0;
  @Input() waveformData: number[] = [];
  @Output() onClick = new EventEmitter<number>();

  public themeService = inject(ThemeService);

  @ViewChild('waveformContainer') waveformContainer?: ElementRef<HTMLDivElement>;

  handleClick(e: MouseEvent) {
    if (this.waveformContainer) {
      const rect = this.waveformContainer.nativeElement.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const clickedTime = (x / rect.width) * this.duration;
      this.onClick.emit(clickedTime);
    }
  }

  isCurrent(index: number): boolean {
    if (this.waveformData.length === 0 || this.duration === 0) return false;
    return (index / this.waveformData.length) * this.duration <= this.currentTime;
  }
}
