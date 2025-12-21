import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SongService } from '../../core/services/song.service';
import { SearchBar } from '../../components/client/search-bar/search-bar';
import { CategoryNavigation } from '../../components/category-navigation/category-navigation';
import { FeaturedSongNavigation } from '../../components/featured-song-navigation/featured-song-navigation';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, SearchBar, CategoryNavigation, FeaturedSongNavigation],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class HomeComponent {
  public songService = inject(SongService);
}
