import { Injectable, signal, effect } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class FavoritesService {
    private readonly FAVORITES_STORAGE_KEY = 'favoriteSongIds';
    favoriteIds = signal<string[]>([]);

    constructor() {
        const storedFavorites = localStorage.getItem(this.FAVORITES_STORAGE_KEY);
        if (storedFavorites) {
            this.favoriteIds.set(JSON.parse(storedFavorites));
        }

        effect(() => {
            localStorage.setItem(this.FAVORITES_STORAGE_KEY, JSON.stringify(this.favoriteIds()));
            window.dispatchEvent(new Event('favoritesChanged'));
        });
    }

    addFavorite(songId: string) {
        if (!this.favoriteIds().includes(songId)) {
            this.favoriteIds.update(ids => [...ids, songId]);
        }
    }

    removeFavorite(songId: string) {
        this.favoriteIds.update(ids => ids.filter(id => id !== songId));
    }

    isFavorite(songId: string): boolean {
        return this.favoriteIds().includes(songId);
    }

    toggleFavorite(songId: string) {
        if (this.isFavorite(songId)) {
            this.removeFavorite(songId);
        } else {
            this.addFavorite(songId);
        }
    }
}
