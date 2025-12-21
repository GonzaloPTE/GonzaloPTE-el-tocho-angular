import { Component, Input, Output, EventEmitter, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Song } from '../../../core/data/songs';

@Component({
  selector: 'app-printable-song-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './printable-song-item.html',
  styleUrl: './printable-song-item.scss',
})
export class PrintableSongItem {
  @Input({ required: true }) song!: Song;
  @Input({ required: true }) songIndex!: number;
  @Input({ required: true }) totalSongs!: number;
  @Input() tag?: string;
  @Output() onTagChange = new EventEmitter<string>();

  isLongSong = computed(() => {
    return this.song.lyrics.split('\n').length > 35;
  });

  lyricsContainerStyle = computed(() => ({
    'column-count': this.isLongSong() ? 2 : 1,
    'column-gap': this.isLongSong() ? '1cm' : 'normal',
    'break-inside': 'avoid',
  }));
}
