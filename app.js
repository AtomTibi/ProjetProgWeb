// Importation des modules nécessaires
const express = require('express');
const product = require('./public/javascript/products.js');
const card_mod = require('./public/javascript/cart.js');
const database = require('./public/javascript/database.js');
const controller = require('./public/javascript/controller.js');

// Initialisation de l'application Express
const app = express();
const port = 3000;

// Configuration des vues avec EJS
const path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Utilisation des fichiers statiques et du middleware pour l'analyse des données envoyées
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

// Récupération de la liste des produits
let product_list = product.product_list;
controller.initializeProducts();

// Route pour obtenir la liste des produits
app.get('/results', (req, res) => {
    return res.json(product.product_list);
});

// Route pour obtenir la liste des combinaisons
app.get('/combinaisons', (req, res) => {
    return res.json(product.combinaison_list);
});

// Route pour obtenir les combinaisons de type "Comfort"
app.get('/combinaisons/comfort', (req, res) => {
    const comfortCombinaisons = product.combinaison_list.filter(combinaison => combinaison.type === "Comfort");
    return res.json(comfortCombinaisons);
});

// Route pour obtenir les combinaisons de type "Business"
app.get('/combinaisons/business', (req, res) => {
    const businessCombinaisons = product.combinaison_list.filter(combinaison => combinaison.type === "Business");
    return res.json(businessCombinaisons);
});

// Route POST pour obtenir les stocks d'un produit
app.post('/getstocks', async (req, res) => {
    var t = await controller.getStockForProduct(req.body.id_prod, req.body.taille);
    res.send(t[0]);
});

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.render('home', { product: product, controller: controller, product_list: product.product_list, combinaison_list: product.combinaison_list });
});

// Route pour la page du gérant
app.get('/gerant', (req, res) => {
    res.render('gerant', { product_list: product.product_list });
    console.log("Page bien rendu");
});

// Nouveau code pour la route POST pour la connexion
app.post('/login', async (req, res) => {
    var email = req.body.email;
    var password = req.body.password;
    const log = await controller.loginDB(email, password);
    if (log) {
        res.sendStatus(200);
    } else {
        console.log("Failed");
        res.sendStatus(404);
    }
});

// Route POST pour envoyer une commande
app.post('/sendOrder', (req, res) => {
    if (controller.sendOrder(req.body)) {
        res.send("Commande confirmée !");
    } else {
        res.send("Erreur !");
    }
});

// Route POST pour récupérer la liste des commandes
app.post('/ordersList', async (req, res) => {
    var orders = await controller.retrieveOrders();
    res.send(orders);
});

// Route POST pour récupérer les produits d'une commande
app.post('/orderProduct', async (req, res) => {
    var product = await controller.retrieveOrderCartProducts(req.body.id)
    res.send(product);
});

// Route POST pour modifier le stock d'un produit
app.post('/modifyStock', (req, res) => {
    if (controller.updateStock(req.body.id, req.body.stock, req.body.taille)) {
        if (controller.reduceStockFromProduct(req.body.id)) {
            res.sendStatus(200);
        }
    }
});

// Route POST pour confirmer une commande
app.post('/confirm', (req, res) => {
    if (controller.acceptOrder(req.body.id)) {
        res.send("Commande validée !");
    } else {
        res.send("Erreur, la commande n'a pas pu être validée");
    }
});

// Route POST pour réduire le stock d'un produit
app.post('/reduceStock', (req, res) => {
    if (controller.reduceStockFromProduct(req.body.id)) {
        res.sendStatus(200);
    }
});

// Route POST pour ajouter un produit au panier
app.post('/addCart', (req, res) => {
    if (controller.addtoCartProd(req.body)) {
        res.sendStatus(200);
    }
});

// Route POST pour récupérer le contenu du panier
app.post('/cart', async (req, res) => {
    var cartproduct = [];
    const cart = await controller.retrieveCart();
    res.send(cart);
});

// Route POST pour supprimer un produit du panier
app.post('/removeprodCart', async (req, res) => {
    if (controller.deleteProdFromTheCart(req.body.id)) {
        res.sendStatus(200);
    } else {
        res.sendStatus(404);
    }
    const cart = await controller.retrieveCart();
});

// Route POST pour récupérer les accessoires d'un produit
app.post('/fillAccessory', async (req, res) => {
    const acc = await controller.getAccessoriesForOneProduct(req.body.id);
    res.send(acc);
});

// Démarrage du serveur
app.listen(port);
