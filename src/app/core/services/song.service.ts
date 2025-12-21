import { Injectable, signal } from '@angular/core';
import { allSongs, categories, Song, Category } from '../data/songs';

@Injectable({
    providedIn: 'root'
})
export class SongService {
    songs = signal<Song[]>(allSongs);
    categories = signal<Category[]>(categories);

    getSongBySlug(slug: string): Song | undefined {
        return this.songs().find((s: Song) => s.slug === slug);
    }

    getCategoryBySlug(slug: string): Category | undefined {
        return this.categories().find((c: Category) => c.slug === slug);
    }

    getSongsByCategory(categoryLetter: string): Song[] {
        return this.songs().filter((s: Song) => s.category.toLowerCase() === categoryLetter.toLowerCase());
    }

    searchSongs(searchTerm: string, options: { songsToSearch?: Song[], priorityFields: (keyof Song)[], limit?: number }): Song[] {
        const { songsToSearch = this.songs(), priorityFields, limit } = options;
        const normalizedTerm = this.removeAccents(searchTerm.toLowerCase().trim());

        if (!normalizedTerm) {
            return limit ? songsToSearch.slice(0, limit) : songsToSearch;
        }

        const results: Song[] = [];
        const addedIds = new Set<string>();

        for (const field of priorityFields) {
            for (const song of songsToSearch) {
                if (limit && results.length >= limit) break;
                if (addedIds.has(song.id)) continue;

                const value = song[field];
                if (typeof value === 'string' && this.removeAccents(value.toLowerCase()).includes(normalizedTerm)) {
                    results.push(song);
                    addedIds.add(song.id);
                }
            }
            if (limit && results.length >= limit) break;
        }

        return results;
    }

    getSequentialNavigation(currentSlug: string): { prev?: string, next?: string } {
        const sorted = this._getSortedSongs();
        const index = sorted.findIndex(s => s.slug === currentSlug);

        if (index === -1) return {};

        return {
            prev: index > 0 ? sorted[index - 1].slug : undefined,
            next: index < sorted.length - 1 ? sorted[index + 1].slug : undefined
        };
    }

    private _getSortedSongs(): Song[] {
        // We act on the signal value, but we could cache this if performance becomes an issue.
        // For ~200 songs, filtering/sorting on the fly is fine, but better to do it once if the list is static.
        // Since 'songs' is a signal that might change (though unlikely for this app structure), we re-compute.
        const currentSongs = this.songs();
        const categoryOrder = this.categories().map(c => c.letter);

        return [...currentSongs].sort((a, b) => {
            const catIndexA = categoryOrder.indexOf(a.category);
            const catIndexB = categoryOrder.indexOf(b.category);

            if (catIndexA !== catIndexB) {
                return catIndexA - catIndexB;
            }

            // Extract numeric part from code (e.g. "A1" -> 1, "J112" -> 112)
            const numA = parseInt(a.code.replace(/\D/g, '') || '0', 10);
            const numB = parseInt(b.code.replace(/\D/g, '') || '0', 10);

            return numA - numB;
        });
    }

    private removeAccents(str: string): string {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    }
}
