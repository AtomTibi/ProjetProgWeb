const pool = require("./database.js");
const products = require("./products.js");
const queries = require("./queries.js");
const cart_mod = require("./cart.js");


let product_list = products.product_list;
let combinaison_list = products.combinaison_list;
let cart = cart_mod.cart;



 async function getProductsfromDB() {  
    try {
        const prod = await pool.query(queries.getProducts);
        prod.rows.forEach(element => {
            var t = products.Produit(element.id_product, element.product_name, element.product_type, element.price, element.sex, element.color);
            product_list.push(t);
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des produits', error);
    }
}


 async function getSingleProductfromDB(id){
    const prod = await pool.query(queries.getProductWithID,[id]);
    var t = products.Produit(prod.rows[0].id_product, prod.rows[0].product_name, prod.rows[0].product_type, prod.rows[0].price, prod.rows[0].sex, prod.rows[0].color);
    return t;
}

 async function getAccessoriesForOneProduct(id){
    const a= await pool.query(queries.getAccessories,[id]);
    const acc = products.Accessory(a.rows[0].id,a.rows[0].nom,a.rows[0].prix);
    return acc;
 }
 

 async function getAccessoriesfromDB(){

    for(const product of product_list){

        const a = await pool.query(queries.getAccessories,[product.id]);

        for (let index = 0; index < a.rows.length; index++) {
        
            product.accessoryList.push(products.Accessory(a.rows[index].id,a.rows[index].nom,a.rows[index].prix));
            
        }
    }

 }


/**
 * Récupère les images associé à produit dans la table product_img
 * et rempli l'attribue url du produit pour qu'on puisse récupérer l'image
 */
async function assignImagetoProd(){

    for(const product of product_list){
        const p = await pool.query(queries.selectImgofProduct, [product.id]);
        product.url = p.rows[0].url;
    } 

    
}


async function getCombinaisonFromDB(){
    const comb = await pool.query(queries.getCombinaisons);

    for (let index = 0; index < comb.rows.length ; index++) {
        
        var c = products.Combinaison(comb.rows[index].type);

        const prod1 = product_list.find(element => element.id === comb.rows[index].id_produit1);
        const prod2 = product_list.find(element => element.id === comb.rows[index].id_produit2);
        const prod3 = product_list.find(element => element.id === comb.rows[index].id_produit3);

    
        c.prod.push(prod1,prod2);

        if(prod3 != undefined) c.prod.push(prod3);

        combinaison_list.push(c);
    }
}

async function getStockForProduct(id_product,taille){

    var t = taille.toLowerCase();

    const stock = await pool.query("SELECT "+taille+" FROM stock WHERE id_produit = "+id_product);

    return stock.rows;

}

async function getAllSizes(id_product){
    const stock = await pool.query(queries.getStocksForProduct,[id_product]);

    return stock.rows;
}

async function updateStockForProduct(id_command,adresse,nom,prenom,horaire,id_produit){

    const update = await pool.query(queries.modifyStock,[id_command,adresse,nom,prenom,horaire,id_produit]);

    return update;

}

async function sendOrder(data){

    const cart= data.cart;
    const command_id = Math.round(Math.random()*1000);
    const totalAmount = products.retrieveTotal(data.cart);

    
    const createOrder = await pool.query(queries.addOrder,[command_id,data.form[0].value,data.form[1].value,data.form[2].value,data.form[3].value,data.form[4].value,data.form[5].value,totalAmount]);
    let addProductstoOrder;
    for (let index = 0; index < cart.length; index++) {

        addProductstoOrder = await pool.query(queries.addOrderContent,[command_id,cart[index].id,cart[index].taille]);      

    }
    
    if(!createOrder || !addProductstoOrder) return false;

    return true;

}

async function retrieveOrders(){

    const orders = await pool.query(queries.getOrders);

    if(!orders) console.log("Erreur order");

    return orders.rows;
}

async function retrieveSpecificOrder(order_id){

    const orders = await pool.query(queries.getSpecificOrder,[order_id]);

    if(!orders) console.log("Erreur order");

    return orders.rows;
}

async function retrieveOrderCart(order_id){

    const cart = await pool.query(queries.getSpecificOrderCart,[order_id]);

    return cart.rows;

}

async function retrieveOrderCartProducts(order_id){

    const cart = await retrieveOrderCart(order_id)
    list = []

    for (let index = 0; index < cart.length; index++) {

        //f()
        var p = await getSingleProductfromDB(cart[index].id);
        p.taille = cart[index].taille;
        list.push(p);
        
    }
    return list;
}
async function updateStock(id,stock,taille){
    const modifyStock = "UPDATE stock SET "+taille.toLowerCase()+" = $1 where id_produit = $2";

    const s = await pool.query(modifyStock,[Number(stock),id]);

    if(!s) return false;

    return true;


}
async function acceptOrder(id_str){

    const id = Number(id_str);

    const delete1 = await pool.query(queries.deleteOrder,[id]);
    const delete2 = await pool.query(queries.deleteOrderContent,[id]);

    if(!delete1 || !delete2) return false;

    return true;

}
async function reduceStockFromProduct(id){

    const reduce = await pool.query(queries.getOrderProduct,[id]);
    for (let index = 0; index < reduce.rows; index++) {

        const num = getStockForProduct(reduce.rows[index].id_product,reduce.rows[index].taille);

        const newStockval = Number(num.rows[0]) - 1;
        const nStock = updateStock(reduce.rows[index].id_product,newStockval.toString(),reduce.rows[index].taille);
        
        if(nStock || num) return false;

    }

    return true;
}
async function addtoCartProd(prod){

    const taille = prod.taille.toLowerCase();
    const addC = await pool.query(queries.addCart, [prod.id,taille]);

    if(!addC) return false
    return true;


}
async function retrieveCart(){

    const panier = await pool.query(queries.getCart);

    list = [];
    for (let index = 0; index < panier.rows.length; index++) {

        var prod = await getSingleProductfromDB(panier.rows[index].id_prod);
        prod.taille = panier.rows[index].taille;
        list.push(prod);

    }
    return list;

}



async function loginDB(email,password){
    const connect = pool.query('SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]);
        if(connect) return true;
        return false;
      
    }



async function deleteProdFromTheCart(id){

    const deletion = await pool.query(queries.deleteProdFromCart,[id]);

    if(!deletion) return false;
    return true;

}


async function initializeProducts() {
    try {
        await getProductsfromDB();
        await assignImagetoProd();
        await getCombinaisonFromDB();
        await getAccessoriesfromDB();
        console.log('Produits initialisés avec succès.');
    } catch (error) {
        console.error('Erreur lors de l\'initialisation des produits', error);
        setTimeout(initializeProducts, 5000);  // 
    }
}




module.exports = {
    getProductsfromDB,
    assignImagetoProd,
    initializeProducts,
    getStockForProduct,
    updateStockForProduct,
    updateStock,
    sendOrder,
    retrieveOrders,
    retrieveSpecificOrder,
    retrieveOrderCart,
    retrieveOrderCartProducts,
    acceptOrder,
    reduceStockFromProduct,
    addtoCartProd,
    retrieveCart,
    getAllSizes,
    addtoCartProd,
    deleteProdFromTheCart,
    getAccessoriesForOneProduct,
    loginDB

}