let cart = [];

function addProducttoCart(product){
    cart.push(product);
}

function validateCart(){
    cart = [];
}


function getTotalPrice(){
    var total_price = 0;
    for (let index = 0; index < cart.length; index++) {
        total_price += cart[index].prix;
        
    }
    return total_price;
}
module.exports = {
    cart,
    getTotalPrice,
    addProducttoCart
}