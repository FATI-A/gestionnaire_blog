import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-acces-refuse',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="container">
      <div class="card">
        <div class="icon">🚫</div>
        <h1>Accès Refusé</h1>
        <p class="description">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <p class="hint">
          Contactez votre administrateur pour obtenir les droits appropriés.
        </p>
        <a routerLink="/" class="btn btn-primary">← Retour à l'accueil</a>
      </div>
    </div>
  `,
  styles: [`
    .container {
      max-width: 500px;
      margin: 60px auto;
      padding: 20px;
      font-family: 'Segoe UI', Arial, sans-serif;
    }
    .card {
      background: white;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
      text-align: center;
    }
    .icon {
      font-size: 64px;
      margin-bottom: 15px;
    }
    h1 {
      color: #d83b01;
      margin-bottom: 10px;
    }
    .description {
      color: #333;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .hint {
      color: #666;
      font-size: 14px;
      margin-bottom: 25px;
    }
    .btn {
      display: inline-block;
      text-decoration: none;
      border: none;
      padding: 14px 28px;
      font-size: 16px;
      cursor: pointer;
      border-radius: 6px;
      font-weight: 500;
      transition: all 0.2s;
    }
    .btn-primary {
      background: #0078d4;
      color: white;
    }
    .btn-primary:hover {
      background: #005a9e;
    }
  `]
})
export class AccesRefuseComponent {}