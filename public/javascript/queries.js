const getProducts = "select * from products";
const getCombinaisons = "select * from combinaison";
const getAccessories = "select * from accessoires WHERE id_produit = $1";

const addProduct = "INSERT INTO products () VALUES ()";
const selectImgofProduct = "SELECT * FROM product_img WHERE id_product = $1";
const getProductWithID = "SELECT * FROM products where id_product = $1";
const addImgtoProduct = "INSERT INTO products_img () VALUES ()";
//const getStock = "SELECT $1 FROM stock WHERE id_produit = $2"
const modifyStock = "UPDATE stock SET $1 = $2 where id_produit = $3";
const addOrder = "INSERT INTO orders (id_command,nom,prenom,adresse,tel,mail,horaire,montant) VALUES ($1,$2,$3,$4,$5,$6,$7,$8)";
const addOrderContent = "INSERT INTO ordersproducts (id_commande,id_produit,taille) VALUES ($1,$2,$3)";
const getOrders = "SELECT * FROM orders";
const getSpecificOrder = "SELECT * from orders WHERE id_command = $1";
const getSpecificOrderCart = "SELECT * from ordersproducts WHERE id_commande = $1";
const deleteOrder = " DELETE from orders WHERE id_command = $1";
const deleteOrderContent = " DELETE from ordersproducts WHERE id_commande = $1";
const getOrderProduct = "SELECT id_product,taille from ordersproducts WHERE id_commande = $1";
const getStocksForProduct = "SELECT * FROM stock WHERE id_produit = $1";
const addCart = "INSERT INTO cart (id_prod,taille) VALUES ($1,$2)";
const addCartAccesory = "INSERT INTO cart (id_accesoire,taille) VALUES ($1,$2)";

const getCart = "SELECT * FROM cart";
const deleteCart = "TRUNCATE cart";
const deleteProdFromCart = "DELETE from cart WHERE id_prod = $1";


module.exports = {
    getProducts,
    getCombinaisons,
    getAccessories,
    addProduct,
    selectImgofProduct,
    getProductWithID,
    addImgtoProduct,
    modifyStock,
    addOrder,
    addOrderContent,
    getOrders,
    getSpecificOrder,
    getSpecificOrderCart,
    deleteOrder,
    deleteOrderContent,
    getOrderProduct,
    getStocksForProduct,
    addCart,
    getCart,
    deleteCart,
    deleteProdFromCart
}
