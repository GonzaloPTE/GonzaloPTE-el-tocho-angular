import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { FormsModule } from '@angular/forms';
import { FavoritesService } from '../../core/services/favorites.service';
import { SongService } from '../../core/services/song.service';
import { PrintableSongItem } from '../../components/client/printable-song-item/printable-song-item';
import { Song } from '../../core/data/songs';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, FormsModule, PrintableSongItem],
  templateUrl: './favorites.html',
  styleUrl: './favorites.scss',
})
export class FavoritesComponent {
  private favoritesService = inject(FavoritesService);
  private songService = inject(SongService);
  private router = inject(Router);

  printableSheetTitle = signal('');
  favoriteSongs = signal<Song[]>([]);

  constructor() {
    const favoriteIds = this.favoritesService.favoriteIds();
    const songs = this.songService.songs().filter(s => favoriteIds.includes(s.id));
    this.favoriteSongs.set(songs);
  }

  handlePrint() {
    window.print();
  }

  handleBack() {
    this.router.navigate(['/']);
  }

  handleSwapSongs(index1: number, index2: number) {
    const songs = [...this.favoriteSongs()];
    const temp = songs[index1];
    songs[index1] = songs[index2];
    songs[index2] = temp;
    this.favoriteSongs.set(songs);
  }

  trackById(index: number, item: Song): string {
    return item.id;
  }

  handleTagChange(songId: string, newTag: string) {
    this.favoriteSongs.update(prev =>
      prev.map(song => song.id === songId ? { ...song, tag: newTag } : song)
    );
  }
}
