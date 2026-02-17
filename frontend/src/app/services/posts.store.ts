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
  date: string;
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
        authorAvatarUrl: post.authorAvatarUrl,
        date: post.date || new Date().toISOString(),
        updatedAt: post.updatedAt || undefined 
      })),
    error: (err) => console.error('Erreur chargement posts :', err)
  });
}

  create(input: { title: string; content: string; imageUrl?: string }) {
  const postToSend = {
    title: input.title,
    content: input.content,
    image: input.imageUrl,
    authorName: this.userName
  };

  this.http.post<BlogPost>(this.apiUrl, postToSend).subscribe({
    next: (createdPost) => {
      this.posts = [
        {
          ...createdPost,
          date: createdPost.date || new Date().toISOString()
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
        ? { ...p, title: patch.title, content: patch.content, imageUrl: patch.imageUrl, date: now }
        : p
    );
  }

deletePost(id: string) {
  return this.http.delete(`${this.apiUrl}/${id}`).subscribe({
    next: () => {
      this.posts = this.posts.filter(p => p.id !== id);
    },
    error: (err) => console.error('Erreur suppression post :', err)
  });
}
}