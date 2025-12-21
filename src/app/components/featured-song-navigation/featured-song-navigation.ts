import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { SongService } from '../../core/services/song.service';
import { FavoritesService } from '../../core/services/favorites.service';
import { ThemeService } from '../../core/services/theme.service';
import { SongItemControls } from '../client/song-item-controls/song-item-controls';

@Component({
  selector: 'app-featured-song-navigation',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule, SongItemControls],
  templateUrl: './featured-song-navigation.html',
  styleUrl: './featured-song-navigation.scss',
})
export class FeaturedSongNavigation {
  private songService = inject(SongService);
  private favoritesService = inject(FavoritesService);
  private router = inject(Router);
  public themeService = inject(ThemeService);

  favoriteSongs = computed(() => {
    const favoriteIds = this.favoritesService.favoriteIds();
    return this.songService.songs().filter(song => favoriteIds.includes(song.id));
  });

  navigateToFavorites() {
    this.router.navigate(['/hoja-favoritos']);
  }
}
