-- ==========================================
-- Création de la base de données
-- ==========================================

CREATE DATABASE blog;

-- ==========================================
-- Se connecter à la base
-- (⚠️ à exécuter seulement dans psql)
-- ==========================================
-- \c blog;

-- ==========================================
-- Suppression de la table si elle existe
-- ==========================================

CREATE TABLE article (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    image TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- Insertion d’un article test
-- ==========================================

INSERT INTO article (title, content, image)
VALUES (
    'Premier article',
    'Ceci est un article de test.',
    'https://picsum.photos/500'
);