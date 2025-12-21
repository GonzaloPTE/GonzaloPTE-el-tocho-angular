import { Injectable, signal } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SongPreviewService {
    activePreviewSongId = signal<string | null>(null);

    togglePreview(songId: string) {
        if (this.activePreviewSongId() === songId) {
            this.activePreviewSongId.set(null);
        } else {
            this.activePreviewSongId.set(songId);
        }
    }
}
