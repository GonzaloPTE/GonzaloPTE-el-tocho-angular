import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { LUCIDE_ICONS, LucideIconProvider, Menu, X, Sun, Moon, ArrowLeft, Search, ChevronRight, Play, Pause, SkipBack, SkipForward, Volume2, Download, Info, Star, Heart, HeartCrack, Printer, Plus, Minus, Music, Rewind, FastForward, ArrowUpDown, ArrowRight, DownloadCloud } from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideAnimations(),
    {
      provide: LUCIDE_ICONS,
      multi: true,
      useValue: new LucideIconProvider({ Menu, X, Sun, Moon, ArrowLeft, Search, ChevronRight, Play, Pause, SkipBack, SkipForward, Volume2, Download, Info, Star, Heart, HeartCrack, Printer, Plus, Minus, Music, Rewind, FastForward, ArrowUpDown, ArrowRight, DownloadCloud })
    }
  ]
};
