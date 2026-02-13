import { Injectable } from '@angular/core';

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
  posts: BlogPost[] = [
    {
      id: crypto.randomUUID(),
      title: 'L’avenir du développement web avec Angular',
      content: `
Le développement web a connu une évolution spectaculaire au cours des dernières années.
Des sites statiques, nous sommes passés à des applications riches, interactives et sécurisées.

Angular s’impose aujourd’hui comme l’un des frameworks les plus puissants pour construire
des applications web modernes. Grâce à TypeScript, à une architecture claire et à une
gestion avancée des rôles et de la sécurité, Angular est particulièrement adapté aux
applications professionnelles et aux projets de grande envergure.

Son intégration naturelle avec des solutions comme Azure Active Directory permet de gérer
facilement l’authentification, les rôles (Reader, Writer, Admin) et l’accès sécurisé aux
fonctionnalités sensibles.

Avec le support du lazy loading, des performances améliorées et un écosystème mature,
Angular reste un choix stratégique pour le futur du développement web.
      `,
      imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475',
      authorName: 'Admin Blog',
      authorEmail: 'admin@blog.dev',
      authorAvatarUrl: 'https://i.pravatar.cc/150?img=12',
      createdAt: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      title: 'Un second article',
      content: 'Encore un exemple d’article, pour tester le design blog.',
      authorName: 'fatiha',
      authorEmail: 'fatihazaki922@gmail.com',
      createdAt: new Date().toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2'
    }
  ];

  create(input: {
    title: string;
    content: string;
    authorName: string;
    authorEmail: string;
    imageUrl?: string;
  }) {
    const now = new Date().toISOString();
    const post: BlogPost = {
      id: crypto.randomUUID(),
      title: input.title,
      content: input.content,
      authorName: input.authorName,
      authorEmail: input.authorEmail,
      createdAt: now,
      imageUrl: input.imageUrl
    };
    this.posts = [post, ...this.posts];
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
