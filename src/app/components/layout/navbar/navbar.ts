import { Component, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { ThemeService } from '../../../core/services/theme.service';
import { siteName } from '../../../core/config/site';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  public themeService = inject(ThemeService);
  private router = inject(Router);

  siteName = siteName;
  isMobileMenuOpen = signal(false);
  currentPath = signal('');

  navItems = [
    { label: 'Inicio', href: '/' },
    { label: 'Categorías', href: '/categorias' },
    { label: 'Cantoral', href: '/canciones' },
    { label: 'Descargas', href: '/descargas' },
    { label: 'Acerca de', href: '/acerca-de' },
  ];

  constructor() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentPath.set(event.urlAfterRedirects);
      this.isMobileMenuOpen.set(false);
    });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen.update(v => !v);
  }
}
