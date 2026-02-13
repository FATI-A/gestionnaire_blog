import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { PostsStore, BlogPost } from '../services/posts.store';

@Component({
  selector: 'app-articles-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="page">
      <div class="top">
        <div class="titleBlock">
        </div>

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

      <!-- message normal si recherche vide -->
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
              <span class="date">{{ formatDate(p.updatedAt || p.createdAt) }}</span>
            </div>

            <p class="content">{{ excerpt(p.content) }}</p>

            <div class="footer">
              <div class="author">
                <img class="avatar" [src]="getAvatarUrl(p)" alt="Avatar" />
                <div class="authorMeta">
                  <div class="authorName">{{ p.authorName }}</div>
                  <div class="authorEmail">{{ p.authorEmail }}</div>
                </div>
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

    /* ✅ Top responsive: recherche au milieu et largeur auto */
    .top{
      display:grid;
      grid-template-columns: 1fr minmax(240px, 640px) 1fr;
      align-items:end;
      gap:12px;
      margin-bottom: 10px;
    }
    .titleBlock{justify-self:start}
    .spacer{justify-self:end}

    .pageTitle{margin:0;color:#111827;font-size:34px;font-weight:900}
    .sub{margin:6px 0 0;color:#6b7280;font-size:16px}

    .search{
      justify-self:center;
      width:100%;
      max-width:640px; /* ✅ au lieu de width fixe */
    }

    .input{
      width:100%;
      min-height:44px; /* ✅ bon sur mobile */
      border:1px solid #e5e7eb;
      border-radius:14px;
      padding:12px 14px;
      outline:none;
      font-size:16px;
      box-sizing:border-box;
      background:#fff;
    }
    .input:focus{
      border-color:#c7d2fe;
      box-shadow:0 0 0 4px rgba(99,102,241,.12);
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

    /* ✅ Titre + Date responsive */
    .cardTop{
      display:flex;
      justify-content:space-between;
      gap:12px;
      align-items:flex-start;
      flex-wrap:wrap; /* ✅ autorise retour ligne */
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
    .authorMeta{
      display:flex;
      flex-direction:column;
      line-height:1.1;
      min-width:0;
    }
    .authorName{
      font-weight:900;
      color:#111827;
      font-size:clamp(14px, 2.2vw, 16px);
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      max-width:520px;
    }
    .authorEmail{
      font-size:clamp(12px, 2vw, 14px);
      color:#6b7280;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      max-width:520px;
    }

    /* ✅ Responsive tablette */
    @media (max-width: 980px){
      .top{grid-template-columns:1fr;}
      .search{justify-self:stretch; width:100%; max-width:100%;}
      .card{flex-direction:column; min-height:unset;}
      .image-wrapper{flex:none; max-width:100%; width:100%; height:260px;}
      .authorName,.authorEmail{max-width:100%;}
    }

    /* ✅ Responsive mobile (date sous le titre) */
    @media (max-width: 520px){
      .cardTop{flex-direction:column; align-items:flex-start;}
      .date{margin-top:4px;}
    }
  `]
})
export class ArticlesPage implements OnInit {
  constructor(private store: PostsStore, private router: Router, private msal: MsalService) {}

  query = '';
  onlyMine = false;

  userEmail = '';

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
      p.title.toLowerCase().includes(q) ||
      p.content.toLowerCase().includes(q) ||
      p.authorName.toLowerCase().includes(q) ||
      p.authorEmail.toLowerCase().includes(q)
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
    const direct = (p.authorAvatarUrl || '').trim();
    if (direct) return direct;
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(p.authorName || 'User')}&background=4f46e5&color=fff`;
  }
}
