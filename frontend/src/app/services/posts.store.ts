import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MsalService } from '@azure/msal-angular';

export type BlogPost = {
  id: string;
  title: string;
  content: string;
  imageUrl?: string;
  authorName: string;
  authorEmail: string;
  authorAvatarUrl?: string;
  createdAt: string;
  updatedAt?: string;
};

@Injectable({ providedIn: 'root' })
export class PostsStore {
  posts: BlogPost[] = [];
  userName: string = '';
  userEmail: string = '';

  private apiUrl = 'http://localhost:3000/posts';

  constructor(private http: HttpClient, private msal: MsalService) {
    this.loadUser();
    this.loadPosts();
  }

  private loadUser() {
    const account = this.msal.instance.getActiveAccount() ?? this.msal.instance.getAllAccounts()[0] ?? null;
    this.userEmail = (account?.username || '').toLowerCase();
    this.userName = account?.name || 'Utilisateur';
  }

  loadPosts() {
    this.http.get<BlogPost[]>(this.apiUrl).subscribe({
      next: (data) =>
        this.posts = data.map(post => ({
          ...post,
          authorName: post.authorName || this.userName,
          authorEmail: post.authorEmail || this.userEmail,
          authorAvatarUrl: post.authorAvatarUrl
        })),
      error: (err) => console.error('Erreur chargement posts :', err)
    });
  }

  create(input: { title: string; content: string; imageUrl?: string }) {
  const now = new Date().toISOString();
  const postToSend = {
    title: input.title,
    content: input.content,
    authorName: this.userName,
    authorEmail: this.userEmail,
    imageUrl: input.imageUrl
  };

  this.http.post<BlogPost>(this.apiUrl, postToSend).subscribe({
    next: (createdPost) => {
      this.posts = [
        {
          ...createdPost,
          createdAt: now
        },
        ...this.posts
      ];
    },
    error: (err) => console.error('Erreur création post :', err)
  });
}

  update(id: string, patch: { title: string; content: string; imageUrl?: string }) {
    const now = new Date().toISOString();
    this.posts = this.posts.map(p =>
      p.id === id
        ? { ...p, title: patch.title, content: patch.content, imageUrl: patch.imageUrl, updatedAt: now }
        : p
    );
  }

  delete(id: string) {
    this.posts = this.posts.filter(p => p.id !== id);
  }
}