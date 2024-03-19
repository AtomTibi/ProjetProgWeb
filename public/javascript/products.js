// Liste des produits
let product_list = [];
// Liste des combinaisons
let combinaison_list = [];

// Fonction pour créer une combinaison
function Combinaison(type, prix) {
    // Définition d'un objet combinaison
    var c = {
        prod: [],
        type: type,
        prix: prix
    };
    return c;
}

// Fonction pour créer un accessoire
function Accessory(id, nom, prix) {
    // Définition d'un objet accessoire
    var a = {
        id: id,
        nom: nom,
        prix: prix
    };
    return a;
}

// Fonction pour créer un produit
function Produit(id, name, type, prix, sex, color) {
    // Définition d'un objet produit
    var p = {
        id: id,
        nom: name,
        type: type,
        prix: prix,
        sex: sex,
        color: color,
        url: "vide",
        accessoryList: [],
        taille: ""
    };
    return p;
}

// Fonction pour ajouter un produit à la liste
function add_produit(product) {
    product_list.push(product);
}

// Fonction pour calculer le total d'une liste de produits
function retrieveTotal(list) {
    var total = 0;
    for (let index = 0; index < list.length; index++) {
        total += Number(list[index].prix);
    }
    return total;
}

// Fonction pour afficher la liste des produits
function print_product_list() {
    product_list.forEach(element => {
        print_product(element);
    });
}

// Fonction pour afficher les détails d'un produit
function print_product(product) {
    console.log(product.id + " " + product.color);
}

// Export des fonctions et des listes pour une utilisation externe
module.exports = {
    product_list,
    combinaison_list,
    Produit,
    Combinaison,
    Accessory,
    add_produit,
    retrieveTotal,
    print_product_list,
    print_product
};
