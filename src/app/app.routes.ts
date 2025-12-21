import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home';
import { SongsListComponent } from './pages/songs-list/songs-list';
import { SongDetailComponent } from './pages/song-detail/song-detail';
import { CategoriesComponent } from './pages/categories/categories';
import { CategoryDetailComponent } from './pages/category-detail/category-detail';
import { DownloadsComponent } from './pages/downloads/downloads';
import { AboutComponent } from './pages/about/about';
import { FavoritesComponent } from './pages/favorites/favorites';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'canciones', component: SongsListComponent },
    { path: 'canciones/:slug', component: SongDetailComponent },
    { path: 'categorias', component: CategoriesComponent },
    { path: 'categorias/:categorySlug', component: CategoryDetailComponent },
    { path: 'descargas', component: DownloadsComponent },
    { path: 'acerca-de', component: AboutComponent },
    { path: 'hoja-favoritos', component: FavoritesComponent },
    { path: '**', redirectTo: '' }
];
