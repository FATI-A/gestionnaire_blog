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
    author TEXT,
    image TEXT,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ==========================================
-- Insertion d’un article test
-- ==========================================

INSERT INTO article (title, content,author, image)
VALUES (
    'Premier article',
    'Ceci est un article de test.',
    'KARIMA hachemaoui',
    'https://picsum.photos/500'
);
INSERT INTO article (title, content,author, image)
VALUES (
    'Roue du London Eye',
    'Nichee au cœur de Londres,
     la grande roue du London Eye offre une vue imprenable sur la ville. Pour profiter pleinement de cette attraction emblematique,
     vous devez planifier votre visite avec soin. Je vous donne quelques conseils pour tirer le meilleur parti de votre experience.',
    'KARIMA hachemaoui',
    'https://goodmorninglondon.fr/wp-content/uploads/2024/08/London-Eye.jpg'
);
INSERT INTO article (title, content,author, image)
VALUES (
    'Une carte Pokemon vendue pour 16,5 millions de dollars aux encheres',
    'Jamais commercialisee, cette carte rare dite « Pikachu Illustrator » est tres prisee des collectionneurs car dessinee par Atsuko Nishida, la creatrice de Pikachu.
 Elle avait ete vendue en 2021 au YouTubeur americain Logan Paul, qui en profite pour tripler son investissement.',
    'KARIMA hachemaoui',
    'https://img.lemde.fr/2026/02/17/0/0/2542/1695/960/0/75/0/6a4cacf_upload-1-pjdeef5ooju8-capture-d-e-cran-2026-02-17-a-05-26-55.jpg'
);