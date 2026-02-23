import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

import { PostsStore } from '../services/posts.store';

@Component({
  selector: 'app-new-article-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <main class="main-content">
      <div class="container">
        <section class="card editor bigEditor">
          <div class="row">
            <h3>Créer un article</h3>
            <button class="btn btn-ghost" type="button" (click)="goBack()">Annuler</button>
          </div>

          <label class="label">Titre</label>
          <input class="input" [(ngModel)]="title" placeholder="Ex: Mon premier article" />

          <!--  Image URL -->
          <label class="label">Image (URL ou upload)</label>

        <div class="input-with-button">
          <input
            class="input"
            [(ngModel)]="imageUrl"
            placeholder="https://images.unsplash.com/..."
          />
        
          <button type="button" class="upload-btn" (click)="fileInput.click()">
            📁
          </button>
        
          <input
            type="file"
            accept="image/*"
            #fileInput
            style="display:none"
            (change)="onFileSelected($event)"
          />
        </div>


          <!--  Aperçu image -->
          <div class="preview" *ngIf="imageUrl.trim()">
            <img [src]="imageUrl" alt="Aperçu image" (error)="onImgError()" />
            <div class="previewHint" *ngIf="imgError">
               L’URL ne charge pas (vérifie le lien).
            </div>
          </div>

          <label class="label">Contenu</label>
          <textarea
            class="textarea"
            [(ngModel)]="content"
            placeholder="Écrivez votre contenu…"
          ></textarea>

          <div class="actions">
            <button class="btn btn-primary" type="button" (click)="publish()">
              Publier
            </button>
            <button class="btn btn-secondary" type="button" (click)="clear()">
              Vider
            </button>
          </div>
        </section>
      </div>
    </main>
  `,
  styles: [`
    .main-content { padding: 30px; }
    .container{
      max-width: 1600px;
      margin: 0 auto;
      font-family: 'Segoe UI', Arial, sans-serif;
    }
    .card{
      background:white;
      border-radius:22px;
      padding:30px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.08);
      margin-top: 18px;
    }

    .row{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      margin-bottom: 10px;
    }
    h3{
      margin:0;
      font-size: 28px;
      font-weight: 900;
      color:#111827;
    }

    .label{
      display:block;
      margin-top:18px;
      margin-bottom:10px;
      font-weight:900;
      color:#374151;
      font-size:16px;
    }
    .input-with-button {
  position: relative;
  width: 100%;
}

  .input-with-button .input {
    width: 100%;
    padding-right: 45px;
    height: 40px;
    box-sizing: border-box;
  }

  .upload-btn {
    position: absolute;
    right: 8px;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: transparent;
    cursor: pointer;
    font-size: 18px;
  }
    .input{
      width:98%;
      border:1px solid #e5e7eb;
      border-radius:14px;
      padding:18px 16px;
      outline:none;
      font-size:18px;
    }
    .input:focus{
      border-color:#c7d2fe;
      box-shadow: 0 0 0 5px rgba(99,102,241,0.14);
    }

    /* ✅ Preview image */
    .preview{
      margin-top: 12px;
      width: 98%;
      height: 260px;
      border-radius: 16px;
      overflow: hidden;
      background: #f3f4f6;
      border: 1px solid #eef2f7;
      position: relative;
    }
    .preview img{
      width: 100%;
      height: 100%;
      object-fit: cover;
      display: block;
    }
    .previewHint{
      position:absolute;
      left: 12px;
      bottom: 12px;
      background: rgba(17,24,39,0.75);
      color: white;
      padding: 8px 10px;
      border-radius: 12px;
      font-weight: 800;
      font-size: 12px;
    }

    .textarea{
      width:98%;
      min-height: 420px;
      resize: vertical;
      border:1px solid #e5e7eb;
      border-radius:14px;
      padding:18px 16px;
      outline:none;
      font-size:18px;
      line-height: 1.7;
    }
    .textarea:focus{
      border-color:#c7d2fe;
      box-shadow: 0 0 0 5px rgba(99,102,241,0.14);
    }

    .actions{
      display:flex;
      gap:14px;
      margin-top:18px;
      flex-wrap:wrap;
    }

    .btn{
      border:none;
      padding:14px 18px;
      border-radius:14px;
      cursor:pointer;
      font-weight:900;
      font-size:16px;
      transition: all .2s;
    }
    .btn-primary{ background:#4f46e5; color:white; }
    .btn-primary:hover{ background:#4338ca; }
    .btn-secondary{ background:#f3f4f6; color:#111827; }
    .btn-secondary:hover{ background:#e5e7eb; }
    .btn-ghost{ background:transparent; color:#6b7280; }
    .btn-ghost:hover{ background:#f3f4f6; }

    @media (max-width: 900px){
      .main-content{ padding: 16px; }
      .container{ max-width: 100%; }
      .card{ padding: 18px; }
      h3{ font-size: 22px; }
      .input, .textarea{ font-size: 16px; padding: 14px; }
      .textarea{ min-height: 260px; }
      .preview{ height: 200px; }
    }
  `]
})
export class NewArticlePage {
  title = '';
  content = '';
  imageUrl = '';
  imgError = false;
  uploadedFile?: File;

  constructor(
    private store: PostsStore,
    private router: Router,
    private msal: MsalService
  ) { }

  goBack() {
    this.router.navigate(['/articles']);
  }

  clear() {
    this.title = '';
    this.content = '';
    this.imageUrl = '';
    this.imgError = false;
  }

  onImgError() {
    this.imgError = true;
  }
  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const file = input.files[0];

    // Vérifier le type MIME pour s'assurer que c'est bien une image
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner une image valide.');
      return;
    }

    // Créer une URL temporaire pour l'aperçu
    this.imageUrl = URL.createObjectURL(file);
    this.imgError = false;

    // Optionnel : stocker le fichier pour l'envoyer au backend
    this.uploadedFile = file;
  }
  publish() {
    const t = this.title.trim();
    const c = this.content.trim();
    const img = this.imageUrl.trim();
    this.imgError = false;

    if (!t || !c) {
      alert('Titre et contenu sont obligatoires.');
      return;
    }

    const account =
      this.msal.instance.getActiveAccount() ??
      this.msal.instance.getAllAccounts()[0] ??
      null;

    const authorName = account?.name ?? 'Writer';
    const authorEmail = account?.username ?? 'writer';

    this.store.create({
      title: t,
      content: c,
      imageUrl: img || undefined
    });

    this.router.navigate(['/mes-articles']);
  }
}
