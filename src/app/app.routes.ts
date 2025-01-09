import { Routes } from '@angular/router';
import { authGuardGuard } from './Postagram/guards/auth-guard.guard';

export const routes: Routes = [    {
    path: '',
    pathMatch: 'full',
    redirectTo: 'loggin'
},
{
    path: 'loggin',
    pathMatch: 'full',
    loadComponent: () => import('./Postagram/pages/loggin/loggin.component').then( m => m.LogginComponent)
},
{
    path: 'register',
    pathMatch: 'full',
    loadComponent: () => import('./Postagram/pages/register/register.component').then( m => m.RegisterComponent)
},
{
    path: 'createPost',
    canActivate: [authGuardGuard],
    pathMatch: 'full',
    loadComponent: () => import('./Postagram/pages/create-post/create-post.component').then( m => m.CreatePostComponent)
},
{
    path: 'viewPosts',
    canActivate: [authGuardGuard],
    pathMatch: 'full',
    loadComponent: () => import('./Postagram/pages/view-posts/view-posts.component').then( m => m.ViewPostsComponent)
}

];
