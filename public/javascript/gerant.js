// Cette fonction est exécutée lorsque le document est prêt
$(document).ready(function () {
    // Appelle la fonction getOrderList() pour récupérer la liste des commandes
    getOrderList();
    // Appelle la fonction retrieveStockAmount() pour récupérer les quantités en stock
    retrieveStockAmount();
    // Attache les écouteurs d'événements aux boutons d'ajout et de retrait de stock
    attachListeners();
});

// Fonction pour attacher les écouteurs d'événements aux boutons d'ajout et de retrait de stock
function attachListeners() {
    // Pour chaque bouton d'ajout de stock, ajoute un écouteur d'événement pour la fonction modifyStock
    $(".add-stock-btn").each(function(button){
        $(this).on("click",modifyStock);
    });
    
    // Pour chaque bouton de retrait de stock, ajoute un écouteur d'événement pour la fonction modifyStock
    $(".remove-stock-btn").each(function(button){
        $(this).on("click",modifyStock);
    });
}

// Fonction pour valider une commande
function validateOrder(event) {
    // Récupère la commande correspondante à l'événement
    var order = $(event.target).closest("tr");
    var id = order.attr("id").replace("order","");
    // Supprime la commande de l'affichage
    order.remove();
    // Confirme la commande en appelant la fonction confirmOrder avec l'ID de la commande
    confirmOrder(id);
}

// Fonction pour modifier le stock d'un produit
function modifyStock(event) {
    // Récupère la ligne correspondante à l'événement
    var row = $(event.target).closest("tr");
    // Récupère les éléments nécessaires pour modifier le stock
    const sizeSelect = row.find(".size-select");
    const quantityInput = row.find(".quantity-input");
    const td = $(".stock-cell");
    const selectedSize = sizeSelect.val();
    const addQuantity = parseInt(quantityInput.val(), 10);
    const stockSpan = td.find(`.stock-value[data-size='${selectedSize}']`);
    const currentStock = parseInt($(stockSpan[0]).text(), 10);
    
    var newStock;
    // Vérifie si le bouton cliqué est un bouton d'ajout ou de retrait
    if ($(event.target).attr("name") === "add") {
        newStock = currentStock + addQuantity;
    } else {
        newStock = currentStock - addQuantity;
    }
    
    // Met à jour la quantité en stock
    $(stockSpan[0]).text(newStock);
    
    // Modifie le stock dans la base de données en appelant la fonction modifyStockDB
    modifyStockDB(row.attr("value"), selectedSize, newStock);
}

// Fonction pour récupérer les quantités en stock
function retrieveStockAmount() {
    // Pour chaque élément ayant la classe "product-stock"
    $(".product-stock").each(function(element) {
        const id = $(this).attr("value");
        // Pour chaque élément ayant la classe "stock-value"
        $(this).find(".stock-value").each(function (element2) {
            var t = $(this);
            // Appelle la fonction getStockValue pour récupérer la quantité en stock
            getStockValue(id, $(this).attr("data-size")).then(function(result) {
                const stock = Object.values(result);
                // Met à jour la quantité en stock affichée
                t.text(stock);
            });
        });
    });
}

// Fonction pour ajouter une commande à la liste des commandes
function addOrdertoList(t) {
    for (let index = 0; index < t.length; index++) {
        // Appelle la fonction getOrderProduct pour récupérer les produits de la commande
        getOrderProduct(t[index].id_command).then(function(result) {
            var row = $("<tr>",{class:"row_orders",id:"order"+t[index].id_command});
            var a = $("<th>",{class:"orders"});
            a.text(t[index].id_command);
            var client_name = t[index].prenom + " " + t[index].nom; 
            var tdname = $("<td>",{});
            tdname.text(client_name);
            var tdproduct = $("<td>",{class:"product_cell"});
            for (let index = 0; index < result.length; index++) {
                var product_info = $("<div>",{class:"product_info"});
                product_info.text(result[index].nom +" " + result[index].taille);
                tdproduct.append(product_info);  
            }
            var td_adress = $("<td>",{});
            td_adress.text(t[index].adresse);
            var td_button = $("<td>",{});
            var button = $("<button>",{class:"btn btn-danger btn-sm",value:"Valider"});
            button.text("Valider");
            td_button.append(button);
            button.on("click", validateOrder);
            row.append([a,tdname,tdproduct,td_adress,td_button]);
            $(".tableOrder").append(row);
        });
    }
}


// Fonction pour récupérer la quantité en stock d'un produit
function getStockValue(id, size) {
    return $.ajax({
        url: '/getstocks',
        type: 'post',
        data: {id_prod : id, taille : size},
        async: true,
        success: function(data) {
            return data;
        }
    });
}

// Fonction pour confirmer une commande
function confirmOrder(id) {
    return $.ajax({
        url: '/confirm',
        type: 'post',
        data : {id : id},
        async: true,
        success: function(data) {
        }
    });
}

// Fonction pour modifier le stock d'un produit dans la base de données
function modifyStockDB(id, taille, stock) {
    return $.ajax({
        url: '/modifyStock',
        type: 'post',
        data: {id:id, stock:stock, taille:taille},
        async: true,
        success: function(data) {
        }
    });
}

// Fonction pour récupérer la liste des stocks
function getStockList() {
    return $.ajax({
        url: '/stockList',
        type: 'post',
        async: true,
        success: function(data) {
        }
    });
}

// Fonction pour récupérer la liste des commandes
function getOrderList() {
    return $.ajax({
        url: '/ordersList',
        type: 'post',
        async: true,
        success: function(data) {
            // Appelle la fonction addOrdertoList pour ajouter les commandes à la liste
            addOrdertoList(data);
        }
    });
}

// Fonction pour récupérer les produits d'une commande
function getOrderProduct(id) {
    return $.ajax({
        url: '/orderProduct',
        type: 'post',
        data: {id:id},
        async: true,
        success: function(data) {
            return data;
        }
    });
}