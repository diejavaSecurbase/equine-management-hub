import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { filter } from 'rxjs/operators';
import { AuthService } from '../../../core/services/auth.service';

interface MenuItem {
  title: string;
  url: string;
  icon: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #drawer class="sidenav" fixedInViewport mode="side" opened>
        <div class="sidebar-header">
          <div class="flex items-center space-x-3">
            <div class="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30">
              <img src="/assets/logo/logo-equusid.svg" alt="Logo EquusID" class="w-10 h-10">
            </div>
            <div>
              <h2 class="font-bold text-lg text-white font-roboto-condensed">EQUUS ID</h2>
              <p class="text-sm text-white/80 font-roboto-condensed">Backoffice</p>
            </div>
          </div>
        </div>
        
        <mat-nav-list>
          <div class="px-4 py-2">
            <p class="text-xs font-semibold text-primary uppercase tracking-wider mb-4 font-roboto-condensed">
              Menú Principal
            </p>
          </div>
          
          <a mat-list-item 
             *ngFor="let item of menuItems" 
             [routerLink]="item.url"
             class="sidebar-menu-item"
             [class.active]="currentUrl === item.url">
            <mat-icon matListItemIcon>{{item.icon}}</mat-icon>
            <span matListItemTitle class="font-medium font-roboto-condensed">{{item.title}}</span>
          </a>
        </mat-nav-list>
        
        <div class="sidebar-footer">
          <div class="p-4 border-t border-gray-100 bg-gray-50/50">
            <div class="flex items-center space-x-3 px-3 py-2 bg-white rounded-lg shadow-sm mb-4">
              <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <mat-icon class="text-white text-sm">person</mat-icon>
              </div>
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-900 font-roboto-condensed">
                  Usuario Admin
                </p>
                <p class="text-xs text-gray-500 font-roboto-condensed">Administrador</p>
              </div>
            </div>
            <button mat-stroked-button 
                    color="primary" 
                    class="w-full font-roboto-condensed"
                    (click)="logout()">
              <mat-icon>logout</mat-icon>
              Cerrar Sesión
            </button>
          </div>
        </div>
      </mat-sidenav>

      <mat-sidenav-content>
        <mat-toolbar class="toolbar">
          <button mat-icon-button (click)="drawer.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
          <span class="flex-1 text-xl font-semibold text-gray-900">
            Back Office - Sistema de Gestión Equina
          </span>
        </mat-toolbar>
        
        <div class="content">
          <router-outlet></router-outlet>
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  currentUrl = '';
  
  menuItems: MenuItem[] = [
    { title: 'Dashboard', url: '/dashboard', icon: 'dashboard' },
    { title: 'Usuarios', url: '/users', icon: 'people' },
    { title: 'Equinos', url: '/equines', icon: 'pets' },
    { title: 'Libretas Sanitarias', url: '/health-books', icon: 'description' },
    { title: 'Establecimientos', url: '/stables', icon: 'business' },
    { title: 'Traslados', url: '/travels', icon: 'local_shipping' },
    { title: 'Razas', url: '/breeds', icon: 'category' },
    { title: 'Configuración', url: '/settings', icon: 'settings' }
  ];

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: NavigationEnd) => {
      this.currentUrl = event.url;
    });
  }

  logout() {
    this.authService.logout();
  }
}