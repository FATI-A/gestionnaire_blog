import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { PostsStore, BlogPost } from '../services/posts.store';
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';

type EditModel = {
  title: string;
  content: string;
  imageUrl: string;
};

@Component({
  selector: 'app-articles-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="top">
        <div class="titleBlock"></div>

        <div class="search">
          <input class="input" [(ngModel)]="query" placeholder="Rechercher..." />
        </div>
      </div>

      <div *ngIf="onlyMine && minePosts.length === 0" class="emptyNice">
        <div class="emptyIcon">📝</div>
        <div class="emptyTitle">Vous n’avez encore rien publié</div>
        <div class="emptySub">
          Créez votre premier article en cliquant sur <b>✍️ Nouveau</b>.
        </div>
      </div>

      <div *ngIf="!onlyMine && filtered.length === 0" class="empty">
        Aucun article trouvé.
      </div>

      <div class="list" *ngIf="filtered.length > 0">
        <article class="card" *ngFor="let p of filtered">
          <div class="image-wrapper">
            <img *ngIf="p.imageUrl; else fallbackImg" [src]="p.imageUrl" alt="Image article" />
            <ng-template #fallbackImg>
              <div class="fallback">🖼️</div>
            </ng-template>
          </div>

          <div class="body">
            <div class="cardTop">
              <h2 class="title">{{ p.title }}</h2>
              <span class="date">{{ formatDate(p.updatedAt || p.date) }}</span>
            </div>

            <!-- MODE AFFICHAGE -->
            <ng-container *ngIf="!isEditing(p); else editTpl">
              <p class="content">{{ excerpt(p.content) }}</p>
            </ng-container>

            <!-- MODE EDITION -->
            <ng-template #editTpl>
              <div class="editBox">
                <label class="label">Titre</label>
                <input class="editInput" [(ngModel)]="editModel.title" />

                <label class="label">Image URL (optionnel)</label>
                <input class="editInput" [(ngModel)]="editModel.imageUrl" placeholder="https://..." />

                <label class="label">Contenu</label>
                <textarea class="editArea" [(ngModel)]="editModel.content" rows="10"></textarea>

                <div class="editActions">
                  <button class="btn primary" (click)="confirmSave(p)" [disabled]="saving">
                    <i class="fa-solid fa-floppy-disk"></i>
                    Enregistrer
                  </button>

                  <button class="btn ghost" (click)="cancelEdit()" [disabled]="saving">
                    <i class="fa-solid fa-xmark"></i>
                    Annuler
                  </button>
                </div>

                <div class="error" *ngIf="errorMsg">{{ errorMsg }}</div>
              </div>
            </ng-template>

            <div class="footer">
              <div class="author">
                <img class="avatar" [src]="getAvatarUrl(p)" alt="Avatar" />
                <div class="authorMeta">
                  <div class="authorName">{{ p.authorName }}</div>
                  <div class="authorEmail">{{ p.authorEmail }}</div>
                </div>
              </div>

              <!-- Actions seulement si c’est mon article -->
              <div class="actions" *ngIf="canEdit(p)">
                <button class="btn primary" (click)="startEdit(p)" [disabled]="saving || isEditing(p)">
                  <i class="fa-solid fa-pen-to-square"></i>
                  Modifier
                </button>

                <button class="btn danger" (click)="confirmDelete(p)" [disabled]="saving">
                  <i class="fa-solid fa-trash"></i>
                  Supprimer
                </button>
              </div>
            </div>
          </div>
        </article>
      </div>
    </div>
  `,
  styles: [`
    .page{
      max-width:1800px;
      margin:0 auto;
      padding:16px;
      font-family:Segoe UI, Arial;
    }

    .top{
      display:grid;
      grid-template-columns: 1fr minmax(240px, 640px) 1fr;
      align-items:end;
      gap:12px;
      margin-bottom: 10px;
    }

    .search{
      justify-self:center;
      width:100%;
      max-width:640px;
    }

    .input{
      width:100%;
      min-height:44px;
      border:1px solid #e5e7eb;
      border-radius:14px;
      padding:12px 14px;
      outline:none;
      font-size:16px;
      box-sizing:border-box;
      background:#fff;
    }
    .input:focus{
      border-color:#2563eb;
      box-shadow:0 0 0 4px rgba(37,99,235,.15);
    }

    .empty{margin-top:14px;color:#6b7280}

    .emptyNice{
      margin-top:18px;
      background: linear-gradient(180deg, #ffffff, #f8fafc);
      border: 1px solid #eef2f7;
      border-radius: 22px;
      padding: 28px;
      display:flex;
      flex-direction:column;
      align-items:center;
      text-align:center;
      box-shadow:0 10px 30px rgba(0,0,0,.06);
    }
    .emptyIcon{font-size:54px; margin-bottom:10px}
    .emptyTitle{font-size:24px; font-weight:900; color:#111827}
    .emptySub{margin-top:8px; font-size:16px; color:#6b7280; max-width:720px}

    .list{
      display:flex;
      flex-direction:column;
      gap:16px;
      margin-top:14px;
    }

    .card{
      display:flex;
      gap:18px;
      background:#fff;
      border:1px solid #eef2f7;
      border-radius:20px;
      padding:18px;
      transition:.2s;
      overflow:hidden;
      min-height:500px;
      align-items:stretch;
    }
    .card:hover{
      transform:translateY(-2px);
      box-shadow:0 10px 26px rgba(0,0,0,.08);
    }

    .image-wrapper{
      flex:0 0 33%;
      max-width:33%;
      height:500px;
      border-radius:16px;
      overflow:hidden;
      background:#f3f4f6;
    }
    .image-wrapper img{
      width:100%;
      height:100%;
      object-fit:cover;
      display:block;
    }
    .fallback{
      width:100%;
      height:100%;
      display:flex;
      align-items:center;
      justify-content:center;
      font-size:48px;
      color:#9ca3af;
    }

    .body{
      flex:1 1 67%;
      min-width:0;
      display:flex;
      flex-direction:column;
      padding-right:6px;
    }

    .cardTop{
      display:flex;
      justify-content:space-between;
      gap:12px;
      align-items:flex-start;
      flex-wrap:wrap;
    }
    .title{
      margin:0;
      color:#111827;
      font-size:clamp(20px, 3.2vw, 34px);
      font-weight:900;
      line-height:1.15;
      flex:1 1 320px;
      min-width:0;
    }
    .date{
      font-size:clamp(13px, 2.2vw, 18px);
      color:#6b7280;
      white-space:nowrap;
      margin-top:6px;
      flex:0 0 auto;
    }

    .content{
      margin:12px 0 0;
      color:#374151;
      font-size:clamp(16px, 2.4vw, 20px);
      line-height:1.65;
    }

    .footer{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:12px;
      margin-top:auto;
      padding-top:14px;
    }

    .author{
      display:flex;
      align-items:center;
      gap:10px;
      min-width:0;
    }
    .avatar{
      width:44px;
      height:44px;
      border-radius:999px;
      object-fit:cover;
      border:2px solid #eef2f7;
      background:#f3f4f6;
      flex:0 0 auto;
    }

    .actions{
      display:flex;
      gap:10px;
      flex:0 0 auto;
    }

    /* ✅ Boutons bleus & rouges */
    .btn{
      border:1px solid #e5e7eb;
      background:#fff;
      border-radius:12px;
      padding:10px 12px;
      font-weight:800;
      cursor:pointer;
      transition:.15s;
      display:flex;
      align-items:center;
      gap:8px;
    }
    .btn:hover{
      transform:translateY(-1px);
      box-shadow:0 8px 18px rgba(0,0,0,.08);
    }
    .btn:disabled{
      opacity:.6;
      cursor:not-allowed;
      transform:none;
      box-shadow:none;
    }

    .btn.primary{
      background:#2563eb;
      border-color:#2563eb;
      color:#fff;
    }
    .btn.primary:hover{
      box-shadow:0 10px 20px rgba(37,99,235,.25);
    }

    .btn.danger{
      background:#dc2626;
      border-color:#dc2626;
      color:#fff;
    }
    .btn.danger:hover{
      box-shadow:0 10px 20px rgba(220,38,38,.25);
    }

    .btn.ghost{
      background:#f3f4f6;
      border-color:#e5e7eb;
      color:#111827;
    }

    /* Edit form */
    .editBox{
      margin-top:12px;
      background:#f8fafc;
      border:1px solid #eef2f7;
      border-radius:16px;
      padding:14px;
    }
    .label{
      display:block;
      font-weight:800;
      color:#374151;
      margin:10px 0 6px;
    }
    .editInput, .editArea{
      width:100%;
      box-sizing:border-box;
      border:1px solid #e5e7eb;
      border-radius:12px;
      padding:10px 12px;
      font-size:15px;
      outline:none;
      background:#fff;
    }
    .editInput:focus, .editArea:focus{
      border-color:#2563eb;
      box-shadow:0 0 0 4px rgba(37,99,235,.15);
    }
    .editActions{
      display:flex;
      gap:10px;
      margin-top:12px;
      justify-content:flex-end;
    }
    .error{
      margin-top:10px;
      color:#dc2626;
      font-weight:800;
    }

    @media (max-width: 980px){
      .top{grid-template-columns:1fr;}
      .search{justify-self:stretch; width:100%; max-width:100%;}
      .card{flex-direction:column; min-height:unset;}
      .image-wrapper{flex:none; max-width:100%; width:100%; height:260px;}
    }

    @media (max-width: 520px){
      .cardTop{flex-direction:column; align-items:flex-start;}
      .date{margin-top:4px;}
      .actions{width:100%; justify-content:flex-end;}
      .editActions{flex-direction:column;}
    }
  `]
})
export class ArticlesPage implements OnInit {
  constructor(
    private store: PostsStore,
    private router: Router,
    private msal: MsalService,
    private http: HttpClient
  ) {}

  query = '';
  onlyMine = false;
  userEmail = '';

  apiBase = 'http://localhost:3000';

  editingId: number | null = null;
  editModel: EditModel = { title: '', content: '', imageUrl: '' };
  saving = false;
  errorMsg = '';

  ngOnInit(): void {
    this.onlyMine = this.router.url.startsWith('/mes-articles');

    const account =
      this.msal.instance.getActiveAccount() ??
      this.msal.instance.getAllAccounts()[0] ??
      null;

    this.userEmail = (account?.username || '').toLowerCase();
  }

  get minePosts(): BlogPost[] {
    if (!this.userEmail) return [];
    return this.store.posts.filter(p => (p.authorEmail || '').toLowerCase() === this.userEmail);
  }

  get filtered(): BlogPost[] {
    const q = this.query.trim().toLowerCase();
    const base = this.onlyMine ? this.minePosts : this.store.posts;

    if (!q) return base;

    return base.filter(p =>
      (p.title || '').toLowerCase().includes(q) ||
      (p.content || '').toLowerCase().includes(q) ||
      (p.authorName || '').toLowerCase().includes(q) ||
      (p.authorEmail || '').toLowerCase().includes(q)
    );
  }

  excerpt(text: string) {
    const clean = (text || '').trim();
    return clean.length > 1000 ? clean.slice(0, 1000) + '…' : clean;
  }

  formatDate(iso: string) {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { year: 'numeric', month: 'short', day: '2-digit' });
  }

  getAvatarUrl(p: BlogPost): string {
    const direct = (p as any).authorAvatarUrl?.trim?.() || '';
    if (direct) return direct;

    const name = (p.authorName || 'User').trim();
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=2563eb&color=fff`;
  }

  canEdit(p: BlogPost): boolean {
    if (!this.userEmail) return false;
    return (p.authorEmail || '').toLowerCase() === this.userEmail;
  }

  private getId(p: BlogPost): number | null {
    const id = (p as any).id;
    return typeof id === 'number' ? id : null;
  }

  isEditing(p: BlogPost): boolean {
    const id = this.getId(p);
    return id !== null && this.editingId === id;
  }

  startEdit(p: BlogPost) {
    if (!this.canEdit(p)) return;

    const id = this.getId(p);
    if (id === null) {
      Swal.fire({
        icon: 'error',
        title: 'Erreur',
        text: "Impossible de modifier : l'article n'a pas d'id."
      });
      return;
    }

    this.errorMsg = '';
    this.editingId = id;
    this.editModel = {
      title: p.title || '',
      content: p.content || '',
      imageUrl: (p as any).imageUrl || ''
    };
  }

  cancelEdit() {
    this.editingId = null;
    this.errorMsg = '';
    this.editModel = { title: '', content: '', imageUrl: '' };
  }

  async confirmSave(p: BlogPost) {
    const res = await Swal.fire({
      icon: 'question',
      title: 'Confirmer la mise à jour ?',
      text: `Voulez-vous enregistrer les modifications de "${p.title}" ?`,
      showCancelButton: true,
      confirmButtonText: 'Oui, enregistrer',
      cancelButtonText: 'Annuler',
      confirmButtonColor: '#2563eb'
    });

    if (res.isConfirmed) {
      await this.saveEdit(p);
    }
  }
async saveEdit(p: BlogPost) {
  if (!this.canEdit(p)) return;

  const id = this.getId(p);
  if (id === null) return;

  const title = this.editModel.title.trim();
  const content = this.editModel.content.trim();

  if (!title || !content) {
    this.errorMsg = 'Titre et contenu sont obligatoires.';
    return;
  }

  this.saving = true;
  this.errorMsg = '';

  try {
    this.store.update(id.toString(), {
      title,
      content,
      imageUrl: this.editModel.imageUrl.trim()
    });

    await Swal.fire({
      icon: 'success',
      title: 'Mise à jour réussie',
      text: 'Votre article a été mis à jour.',
      confirmButtonColor: '#2563eb'
    });

    this.cancelEdit();
  } catch (e) {
    console.error(e);
    await Swal.fire({
      icon: 'error',
      title: 'Erreur',
      text: "Erreur lors de l'enregistrement. Vérifie l'API.",
      confirmButtonColor: '#2563eb'
    });
  } finally {
    this.saving = false;
  }
}

 async confirmDelete(p: BlogPost) {
  const res = await Swal.fire({
    icon: 'warning',
    title: 'Supprimer cet article ?',
    text: `Cette action est irréversible : "${p.title}"`,
    showCancelButton: true,
    confirmButtonText: 'Oui, supprimer',
    cancelButtonText: 'Annuler',
    confirmButtonColor: '#dc2626'
  });

  if (res.isConfirmed) {
    this.saving = true;
    this.store.deletePost(p.id);
    this.saving = false;

    await Swal.fire({
      icon: 'success',
      title: 'Supprimé',
      text: 'Votre article a été supprimé.',
      confirmButtonColor: '#2563eb'
    });
  }
}
}