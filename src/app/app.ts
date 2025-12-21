import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Navbar } from './components/layout/navbar/navbar';
import { Footer } from './components/layout/footer/footer';
import { filter } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navbar, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  private router = inject(Router);

  isFavoritesPage = toSignal(
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      filter(() => this.router.url === '/hoja-favoritos' || this.router.url.startsWith('/hoja-favoritos'))
    ),
    { initialValue: null }
  );

  // Better approach: signal that returns boolean based on current URL
  currentUrl = signal<string>('');

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.currentUrl.set(this.router.url);
    });
  }

  // Helper for template
  get showLayout(): boolean {
    return this.currentUrl() !== '/hoja-favoritos';
  }
}
