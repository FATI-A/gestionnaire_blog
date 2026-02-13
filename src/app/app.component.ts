import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import {
  MsalService,
  MsalBroadcastService,
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration
} from '@azure/msal-angular';

import { InteractionStatus, RedirectRequest } from '@azure/msal-browser';
import { Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterOutlet],
  template: `
    <div class="app-container">
      <!--  Header seulement si connecté -->
      <header *ngIf="isLoggedIn" class="header">
        <div class="header-content">

          <div class="brand">
            <i class="fa-solid fa-blog fa-lg brand-icon"></i>
            <h1>Blog Insta</h1>
          </div>

          <nav class="nav">
            <a routerLink="/articles" class="nav-link">
              <i class="fa-solid fa-house"></i> Accueil
            </a>
            <a routerLink="/mes-articles" class="nav-link">
              <i class="fa-solid fa-file-lines"></i> Mes articles
            </a>
            <a
              *ngIf="hasRole('Task.Writer')"
              routerLink="/nouveau"
              class="nav-link"
            >
              <i class="fa-solid fa-pen-nib"></i> Nouveau
            </a>
          </nav>

          <div class="user-info">
            <span class="user-name" title="{{ userName }}">
              <i class="fa-solid fa-user"></i> {{ userName }}
            </span>
            <button (click)="logout()" class="btn btn-logout">
              <i class="fa-solid fa-right-from-bracket"></i> Déconnexion
            </button>
          </div>
        </div>
      </header>

      <main class="main-content">
        <!-- Si pas connecté => card -->
        <ng-container *ngIf="!isLoggedIn; else app">
          <div class="login-container">
            <div class="login-card modern-login-card">
              <div class="login-title">
                <i class="fa-solid fa-lock fa-2x login-icon"></i>
                Connexion
              </div>
              <p class="login-sub">Connectez-vous pour accéder au Blog.</p>

              <button (click)="login()" class="btn btn-primary btn-login">
                <i class="fa-brands fa-microsoft"></i> Se connecter avec Azure AD
              </button>
            </div>
          </div>
        </ng-container>

        <ng-template #app>
          <router-outlet></router-outlet>
        </ng-template>
      </main>
    </div>
  `,
  styles: [`
    .app-container { min-height: 100vh; background: #f5f6f8; }

    .header {
      background: white;
      box-shadow: 0 2px 10px rgba(0,0,0,0.08);
      padding: 0 20px;
      position: sticky;
      top: 0;
      z-index: 5;
    }

    .header-content {
      max-width: 1800px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      min-height: 64px;
      padding: 10px 0; 
      flex-wrap: wrap; 
    }

    .brand {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .brand-icon {
      color: #4f46e5;
      font-size: 2.1rem;
    }
    .brand h1 {
      margin: 0;
      color: #111827;
      font-size: clamp(18px, 2.2vw, 26px);
      font-weight: 900;
      line-height: 1.1;
      white-space: nowrap;
    }

    .nav {
      display: flex;
      gap: 10px;
      align-items: center;
      flex-wrap: wrap;       
      justify-content: center;
      flex: 1 1 auto;       
      min-width: 240px;
    }

    .nav-link {
      text-decoration: none;
      color: #374151;
      padding: 10px 18px;
      border-radius: 14px;
      transition: all .2s;
      font-weight: 800;
      font-size: clamp(15px, 1.7vw, 21px);
      white-space: nowrap;
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .nav-link i { font-size: 1.1em; }
    .nav-link:hover { background:#f3f4f6; color:#111827; }

    .user-info {
      display: flex;
      align-items: center;
      gap: 12px;
      flex: 0 0 auto;
    }

    .user-name {
      color: #6b7280;
      font-size: clamp(14px, 1.6vw, 18px);
      font-weight: 800;
      max-width: 260px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .main-content {
      padding: clamp(12px, 2vw, 20px);
      max-width: 3000px;
      margin: 0 auto;
    }

    .btn {
      border: none;
      padding: 10px 18px;
      border-radius: 14px;
      cursor: pointer;
      font-weight: 900;
      font-size: 1.1em;
      display: flex;
      align-items: center;
      gap: 7px;
      transition: background .2s, box-shadow .2s;
    }
    .btn-primary { background:#4f46e5; color:white; box-shadow: 0 2px 8px #4f46e51a; }
    .btn-primary:hover { background:#4338ca; }
    .btn-logout { background:#111827; color:white; }
    .btn-logout:hover { opacity:.9; }

    .login-container{
      min-height: calc(100vh - 40px);
      display:flex;
      align-items:center;
      justify-content:center;
      padding: 20px;
    }
    .login-card{
      width: min(600px, 100%);
      min-width: 340px;
      min-height: 420px;
      background:white;
      border-radius:22px;
      padding:40px 32px 32px 32px;
      box-shadow: 0 10px 40px 0 rgba(79,70,229,0.13), 0 2px 8px 0 rgba(0,0,0,0.08);
      text-align:center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 18px;
      position: relative;
    }
    .modern-login-card {
      border: 1.5px solid #e0e7ff;
      background: linear-gradient(120deg, #f5f6fa 0%, #e0e7ff 100%);
      box-shadow: 0 10px 40px 0 rgba(79,70,229,0.13), 0 2px 8px 0 rgba(0,0,0,0.08);
    }
    .login-title{
      font-size:28px;
      font-weight:900;
      color:#111827;
      margin-bottom:8px;
      display: flex;
      align-items: center;
      gap: 12px;
      justify-content: center;
    }
    .login-icon {
      color: #4f46e5;
      background: #e0e7ff;
      border-radius: 50%;
      padding: 12px;
      font-size: 2.2em;
      box-shadow: 0 2px 8px #4f46e51a;
    }
    .login-sub{
      margin:0 0 18px;
      color:#6b7280;
      font-weight:600;
      font-size: 1.1em;
    }
    .btn-login {
      margin-top: 18px;
      font-size: 1.15em;
      padding: 14px 24px;
      border-radius: 16px;
      box-shadow: 0 2px 8px #4f46e51a;
    }

    @media (max-width: 900px){
      .header { padding: 0 14px; }
      .header-content { justify-content: center; }
      .user-info { width: 100%; justify-content: center; }
      .nav { width: 100%; }
      .login-card { min-width: 220px; padding: 24px 10px; }
    }

    @media (max-width: 520px){
      .nav-link { padding: 8px 10px; border-radius: 10px; }
      .btn { width: 100%; }
      .user-info { gap: 10px; }
      .user-name { max-width: 100%; }
      .login-card { padding: 18px 4px; }
    }
  `]
})
export class AppComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  userName = '';
  userEmail = '';
  userRoles: string[] = [];
  private readonly destroying$ = new Subject<void>();

  constructor(
    @Inject(MSAL_GUARD_CONFIG) private msalGuardConfig: MsalGuardConfiguration,
    private msalService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.msalService.instance.initialize().then(() => {
      this.msalService.instance.handleRedirectPromise().then((response) => {
        if (response) this.msalService.instance.setActiveAccount(response.account);
        this.setLoginDisplay();
      });
    });

    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this.destroying$)
      )
      .subscribe(() => this.setLoginDisplay());
  }

  setLoginDisplay(): void {
    const account =
      this.msalService.instance.getActiveAccount() ??
      this.msalService.instance.getAllAccounts()[0] ??
      null;

    this.isLoggedIn = !!account;

    if (!account) {
      this.userName = '';
      this.userEmail = '';
      this.userRoles = [];
      if (this.router.url !== '/') this.router.navigate(['/']);
      return;
    }

    this.userName = account.name || 'Utilisateur';
    this.userEmail = account.username || '';

    const claims = account.idTokenClaims as any;
    const rolesFromAzure: string[] = claims?.roles ?? [];
    this.userRoles = rolesFromAzure.length > 0 ? rolesFromAzure : ['Task.Reader'];

    if (this.router.url === '/' || this.router.url === '') {
      this.router.navigate(['/articles']);
    }
  }

  hasRole(role: string): boolean {
    return this.userRoles.includes(role);
  }

  login(): void {
    const authRequest = this.msalGuardConfig.authRequest as RedirectRequest;
    this.msalService.loginRedirect(authRequest);
  }

  logout(): void {
    this.msalService.logoutRedirect();
  }

  ngOnDestroy(): void {
    this.destroying$.next();
    this.destroying$.complete();
  }
}
