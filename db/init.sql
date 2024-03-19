--  On crée la base de données, si elle n'existe pas
CREATE DATABASE IF NOT EXISTS webproject;
\c webproject

DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS product_img;
DROP TABLE IF EXISTS accessoires;
DROP TABLE IF EXISTS combinaison;
DROP TABLE IF EXISTS orders;
DROP TABLE IF EXISTS ordersproducts;
DROP TABLE IF EXISTS stock;
DROP TABLE IF EXISTS cart;
DROP TABLE IF EXISTS users;


CREATE TABLE IF NOT EXISTS users (
    id  SERIAL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);

INSERT INTO users (email, password)
VALUES ('root@gmail.com', 'root');


CREATE TABLE IF NOT EXISTS public.cart
(
    id_cart SERIAL,
    id_prod integer NOT NULL,
    id_accessoire integer,
    taille text

);

CREATE TABLE IF NOT EXISTS products
(
    id_product integer NOT NULL,
    product_name text NOT NULL,
    product_type text NOT NULL,
    sex "char",
    color text ,
    price integer NOT NULL DEFAULT 0,
    CONSTRAINT products_pkey PRIMARY KEY (id_product)
);


INSERT INTO products(
    id_product, product_name, product_type, sex, color, price)
VALUES 
    (1, 'T-shirt Gris Homme', 'Manche Longue', 'M','Gris', 25),
    (2, 'Col Roulé Rouge Burberry', 'Pull', 'M', 'Rouge', 15),
    (3, 'Jean Bleu Homme', 'Jean', 'M', 'Bleu', 30),
    (4, 'Jean Gris Homme', 'Jean', 'M', 'Gris', 25),
    (5, 'Jupe Longue Violette', 'Jupe', 'F','Violet', 25),
    (6, 'Chemise Blanche Homme', 'Chemise', 'M','Blanc', 40),
    (7, 'Chemise Beige Homme', 'Chemise', 'M','Beige', 25),
    (8, 'Chemise Oxford Blanche', 'Chemise', 'M','Blanc', 25),
    (9, 'Sweat Noir Homme', 'Pull', 'M','Noir', 55),
    (10, 'Pantalon Comfort Bleu', 'Pantalon', 'M','Bleu', 40),
    (11, 'Veste Habillée Grise', 'Veste', 'M','Gris', 70),
    (12, 'Veste Ajustée Grise', 'Veste', 'M','Gris', 70),
    (13, 'Pantalon Smart Gris', 'Pantalon', 'M','Gris', 40),
    (14, 'Pull Blanc', 'Pull', 'M','Gris', 40),
    (15, 'Robe Evasee', 'Robe', 'F','Noir', 40),
    (16, 'Sweat Capuche Rouge', 'Panta', 'M','Gris', 40);




CREATE TABLE IF NOT EXISTS product_img
(
    id_product integer NOT NULL,
    url text NOT NULL,
    CONSTRAINT product_img_pkey PRIMARY KEY (id_product)
);

INSERT INTO product_img(
	id_product, url)
	VALUES (1, 'ressources/images/vetements/longue-gris.png'),
	(2, '/ressources/images/vetements/col-roule.png'),
	(3, '/ressources/images/vetements/jean.png'),
	(4, '/ressources/images/vetements/jeangris.png'),
	(5, 'ressources/images/vetements/jupe.png'),
    (6, 'ressources/images/vetements/chemise.png'),
	(7, 'ressources/images/vetements/chemisecarreaux.png'),
	(8, 'ressources/images/vetements/chemiseoxford.png'),
    (9, 'ressources/images/vetements/sweatnoir.png'),
    (10, 'ressources/images/vetements/pantaloncomfort.png'),
    (11, 'ressources/images/vetements/vestecomfort.png'),
    (12, 'ressources/images/vetements/vesteajustee.png'),
    (13, 'ressources/images/vetements/pantalonsmart.png'),
    (14, 'ressources/images/vetements/pullblanc.png'),
    (15, 'ressources/images/vetements/robeevasee.png'),
    (16, 'ressources/images/vetements/sweatcapucherouge.png');



CREATE TABLE IF NOT EXISTS public.accessoires
(
    id integer NOT NULL,
    nom text COLLATE pg_catalog."default",
    prix integer,
    url text COLLATE pg_catalog."default",
    id_produit integer,
    CONSTRAINT "Accessoire_pkey" PRIMARY KEY (id)
);

CREATE TABLE IF NOT EXISTS public.combinaison
(
    id_produit1 integer NOT NULL,
    id_produit2 integer NOT NULL,
    type text COLLATE pg_catalog."default",
    id_produit3 integer,
    nom text COLLATE pg_catalog."default",
    sexe "char",
    CONSTRAINT "Combinaison_pkey" PRIMARY KEY (id_produit1, id_produit2)
);


INSERT INTO public.combinaison (id_produit1, id_produit2, type, id_produit3, nom, sexe)
SELECT id_produit1, id_produit2, type, id_produit3, nom, sexe
FROM (VALUES
    (1, 3, 'Comfort', NULL, NULL, NULL),
    (9, 4, 'Comfort', NULL, NULL, NULL),
    (1, 5, 'Comfort', NULL, NULL, NULL),
    (11, 7, 'Business', 10, NULL, NULL),
    (12, 6, 'Business', 10, NULL, NULL),
    (12, 8, 'Business', 13, NULL, NULL)
) AS data(id_produit1, id_produit2, type, id_produit3, nom, sexe);



CREATE TABLE IF NOT EXISTS public.orders
(
    id_command integer NOT NULL,
    adresse text COLLATE pg_catalog."default" NOT NULL,
    nom text COLLATE pg_catalog."default" NOT NULL,
    prenom text COLLATE pg_catalog."default" NOT NULL,
    mail text COLLATE pg_catalog."default" NOT NULL,
    tel text COLLATE pg_catalog."default" NOT NULL,
    horaire text COLLATE pg_catalog."default" NOT NULL,
    montant integer NOT NULL DEFAULT 0,
    CONSTRAINT orders_pkey PRIMARY KEY (id_command)
);
INSERT INTO public.orders(
	id_command, adresse, nom, prenom, mail, tel, horaire, montant)
	VALUES (612, '1 Rue de la Paix, 75000 Paris', 'Dupont', 'Jean', 'jean.dupont@free.fr', '0213338833', '12:16', 55),
    (625, '12 rue Dubois, 75012 Paris', 'Dubois', 'Marianne', 'marianne.dubois@free.fr', '023456648833', '10:16', 50);
CREATE TABLE IF NOT EXISTS ordersproducts
(
    id_commande integer NOT NULL,
    id integer NOT NULL GENERATED ALWAYS AS IDENTITY ( INCREMENT 1 START 1 MINVALUE 1 MAXVALUE 2147483647 CACHE 1 ),
    taille text COLLATE pg_catalog."default" NOT NULL,
    id_produit integer NOT NULL,
    CONSTRAINT ordersproducts_pkey PRIMARY KEY (id)
);

INSERT INTO public.ordersproducts(
	id_commande, taille, id_produit)
	VALUES (625,  'S', 1),
    (625, 'XS', 4),
    (612, 'XS', 5);

CREATE TABLE IF NOT EXISTS public.stock
(
    id_produit integer NOT NULL,
    xs integer,
    s integer,
    m integer,
    l integer,
    xl integer,
    xxl integer,
    CONSTRAINT "Stock_pkey" PRIMARY KEY (id_produit)
);

INSERT INTO public.stock(
	id_produit, xs, s, m, l, xl, xxl)
	VALUES (1, 5, 5, 5, 5, 5, 5),
    (2, 5, 5, 5, 5, 5, 5),
    (3, 5, 5, 5, 5, 5, 5),
    (4, 5, 5, 5, 5, 5, 5),
    (5, 5, 5, 5, 5, 5, 5),
    (6, 5, 5, 5, 5, 5, 5),
    (7, 5, 5, 5, 5, 5, 5),
    (8, 5, 5, 5, 5, 5, 5),
    (9, 5, 5, 5, 5, 5, 5),
    (10, 5, 5, 5, 5, 5, 5),
    (11, 5, 5, 5, 5, 5, 5),
    (12, 5, 5, 5, 5, 5, 5),
    (13, 5, 5, 5, 5, 5, 5),
    (14, 5, 5, 5, 5, 5, 5),
    (15, 5, 5, 5, 5, 5, 5),
    (16, 5, 5, 5, 5, 5, 5);
