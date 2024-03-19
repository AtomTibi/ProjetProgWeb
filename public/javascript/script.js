//Definition des variables globales
let productsContainer;
let storedProducts;
let btnFinaliser = document.querySelector("#BtnFinaliser");
let panier = document.querySelector(".panier-items");
let panierlist = [];



document.addEventListener('DOMContentLoaded', function () {

    //Permet d'initialiser les produits
    initializeProducts();
    // getCartFromBack();
    // Fonction pour la finalisation de commande
    handleFinalizeOrder();
    //Fonction qui genere les listeners pour la connexion
    generateListerConnection();
    //Fonction qui sert au tri des vetements
    handleProductFilter();
    //Fonction qui sert aux interaction avec la panier
    handleCartInteractions();
    //Fonction utile pour les accessoires et interactions avec le produit
    handleSizeAndAccessoriesInteractions();
    //Fonction qui gere la connection
    listenerConnection();
    //Fonction pour la finalisation de commandes
    finalizeOrder();    


});


//Fonction qui permet l'initialisation des produits
function initializeProducts() {
    const products = document.querySelectorAll('.product');
    productsContainer = document.querySelector('.products-container');
    storedProducts = Array.from(products);
    setProductsObjet();
}

function handleFinalizeOrder() {
    document.getElementById('BtnFinaliser').addEventListener('click', function () {
        document.getElementById('finaliserCommandeModal').style.display = 'block';
        document.querySelector('.panier-banner').style.display = 'none';
    });

    document.getElementById('closeModal').addEventListener('click', function () {
        document.getElementById('finaliserCommandeModal').style.display = 'none';
    });
}

//Fonction qui ajoute des listeners 
function handleProductFilter() {
    addListenerForFilter('#categoriemenu .dropdown-item', 'active');
    addListenerForFilter('#colormenu .dropdown-item', 'active');

    //Rajouter des listener pour chaque elements qui ont data-category(utilise pour la navbar)
    document.querySelectorAll('[data-category]').forEach(function (element) {
        element.addEventListener('click', function (event) {
            event.preventDefault();
            var selectedCategory = event.target.getAttribute('data-category');
            filterProducts(selectedCategory, 'Tout');
        });
    });
    

}

function handleCartInteractions() {
    // Sélectionner le bouton panier en utilisant la classe 'panier-btn'
    const panierBouton = document.querySelector('.panier-btn');

    panierBouton.addEventListener('click', function (event) {
        const panierBanner = document.querySelector('.panier-banner');
        if (panierBanner.style.display === 'block') {
            panierBanner.style.display = 'none';
        } else {
            updateBtnFinaliserDisplay();
            panierBanner.style.display = 'block';
        }
    });
}

function handleSizeAndAccessoriesInteractions() {
    productsContainer.addEventListener("click", function (event) {
        const product = event.target.closest(".product");
        if (product) {
            const sizeContainer = product.querySelector(".size-container");
            if (sizeContainer) {
                sizeContainer.style.display = sizeContainer.style.display === "block" ? "none" : "block";
            }
        }
    });

    document.querySelectorAll('.product').forEach(function (product) {
        product.addEventListener("click", function (event) {
            const sizeContainer = product.querySelector(".size-container");
            sizeContainer.style.display = sizeContainer.style.display === "block" ? "none" : "block";
        });
    });

    document.querySelectorAll('.accessory').forEach(function (accessory) {
        accessory.addEventListener("click", function (event) {
            event.stopPropagation();
        });
    });

    const sizeButtons = document.querySelectorAll(".size-button");
    sizeButtons.forEach(function (sizeButton) {
        sizeButton.addEventListener("click", function (sizeEvent) {
            const product = sizeEvent.target.closest(".product");
            const size = sizeEvent.target.innerText;
            addToCart(product, size);
        });
    });
}

function addListenerForFilter(selector, activeClass) {
    var items = document.querySelectorAll(selector);

    var getActiveValue = function (selector) {
        var activeItem = document.querySelector(selector + '.' + activeClass);
        return activeItem ? activeItem.getAttribute('data-value') : null;
    };

    items.forEach(function (item) {
        item.addEventListener('click', function (event) {
            event.preventDefault();
            items.forEach(el => el.classList.remove(activeClass));
            event.target.classList.add(activeClass);

            var selectedColor = getActiveValue('#colormenu .dropdown-item');
            var selectedCategory = getActiveValue('#categoriemenu .dropdown-item');


            filterProducts(selectedCategory, selectedColor);
        });
    });
}




function generateListerConnection() {

    document.getElementById("closeConnexion").addEventListener("click", function () {
        document.getElementById("connexion").style.display = "none";

    });

    document.getElementById("connexionTab").addEventListener("click", function () {
        // Change le style des onglets
        this.classList.add("connexion-tab-active");
        document.getElementById("inscriptionTab").classList.remove("connexion-tab-active");

        // Affiche le contenu de l'onglet connexion
        document.getElementById("connexionPane").classList.add("connexion-pane-active");
        document.getElementById("inscriptionPane").classList.remove("connexion-pane-active");
    });

    document.getElementById("inscriptionTab").addEventListener("click", function () {
        // Change le style des onglets
        this.classList.add("connexion-tab-active");
        document.getElementById("connexionTab").classList.remove("connexion-tab-active");

        // Affiche le contenu de l'onglet inscription
        document.getElementById("inscriptionPane").classList.add("connexion-pane-active");
        document.getElementById("connexionPane").classList.remove("connexion-pane-active");
    });

    //Listener qui permet l'affichag/disparition de la div connection
    document.querySelector(".connection-btn").addEventListener("click", function () {
        const connexionDiv = document.getElementById("connexion");
        if (connexionDiv.style.display === "none") {
            connexionDiv.style.display = "block";
        } else {
            connexionDiv.style.display = "none";
        }
    });


    var titreElement = document.getElementById('titre');

    titreElement.addEventListener('click', function () {
         resetPage();
    });



}

//Fonction qui permet la mise à jour du bouton "Finaliser Commande"
function updateBtnFinaliserDisplay() {
    panier = document.querySelector(".panier-items");
    if (panier.children.length === 0) {
        $("#BtnFinaliser").css("display", "none");
    } else {
        $("#BtnFinaliser").css("display", "block");
    }
}


function chooseAccessory() {
    $(".accessories-dropdown").each(function () {
        var acc = $(this);
        $(this).on("change", function () {
            const id = JSON.parse($(this).val()).id;



        })
    })


}
function updateTotalAmount(amountToAdd) {
    const totalAmountElement = document.getElementById("totalAmount");
    const currentTotalAmount = parseFloat(totalAmountElement.innerText);
    if (!isNaN(amountToAdd)) {
        const newTotalAmount = currentTotalAmount + amountToAdd;
        totalAmountElement.innerText = newTotalAmount.toFixed(2);
    }
}





function renderCart() {

    for (let index = 0; index < panierlist.length; index++) {

        updateTotalAmount(panierlist[index].prix);

        const panierItem = document.createElement("div");
        panierItem.classList.add("panier-item");
        panierItem.innerText = panierlist[index].nom + " - Taille: " + panierlist[index].taille;

        if (panierlist[index].accessoryList.length == 1) {
            panierItem.innerText = panierlist[index].nom + " - Taille: " + panierlist[index].taille + " - Accessoires" + panierlist[index].accessoryList[0].nom;
            updateTotalAmount(panierlist[index].accessoryList[0].prix);

        }

        const removeButton = document.createElement("button");
        removeButton.classList.add("remove-button");
        removeButton.innerText = "Retirer";
        removeButton.addEventListener("click", function () {
            const itemPrice = panierlist[index].prix;
            updateTotalAmount(-itemPrice);
            if (panierlist[index].accessoryList.length == 1) {
                updateTotalAmount(-panierlist[index].accessoryList[0].prix);


            }

            deleteArticleFromCart(panierlist[index].id);

            panierlist.pop();
            panierItem.remove();

            updateBtnFinaliserDisplay();
        });

        // Ajouter le bouton de suppression à l'entrée du panier
        panierItem.append(removeButton);


        const panier = document.querySelector(".panier-items");
        panier.appendChild(panierItem);

        // Ajouter l'entrée du panier à la div "panier-banner"        
    }



}
function correctAccessoryList(product, id) {
    list = [];
    for (let index = 0; index < product.variable.accessoryList.length; index++) {
        if (product.variable.accessoryList[index].id == id) list.add(list);
    }
    return list;
}
function findAccessory(product) {

    const a = product.querySelector('.accessories-dropdown');

    if (a.value == "") {
        product.variable.accessoryList = [];
        return -1;
    }

    return a.value.id;
}
//Fonction qui permet l'ajoute de produit au panier
function addToCart(product, size) {

    // Récupérer les informations sur le produit
    const sizeButton = product.querySelector(`.size-button[data-size="${size}"]`);

    getStockValue(product.variable.id, size).then(function (result) {
        const stock = Object.values(result);

        // Vérifier si le stock est supérieur à 0
        if (stock <= 0) {
            alert("Désolé, ce produit est en rupture de stock.");
            return;
        }
        // fillAccessoryList(product.variable.id).then(function (result){
        // product.variable.accessoryList = [result];
        // const acc_id = findAccessory(product);
        // correctAccessoryList(product,acc_id);


        product.variable.taille = size;
        panierlist.push(product.variable);

        addtoCartBack(product.variable);
        renderCart();

        // Ajouter l'entrée du panier à la div "panier-banner"


        // Fermer le size-container après avoir ajouté le produit au panier
        const sizeContainer = product.querySelector(".size-container");
        sizeContainer.style.display = "none";

        updateBtnFinaliserDisplay();

        //       })

    })


}



//Fonction qui permet de filtrer les prodtuis et de recréer l'ensemble des produits
function filterProducts(selectedCategory, selectedColor) {
    var categoryDropdown = document.querySelector('#categoryDropdown');
    categoryDropdown.textContent = selectedCategory;

    var colorDropdown = document.querySelector('#colorDropdown');
    colorDropdown.textContent = selectedColor;

    var filteredProducts = storedProducts.filter(function (product) {
        var productColor = product.variable.color ? product.variable.color.replace(/\s/g, '') : '';

        var productCategory = product.variable.type ? product.variable.type.replace(/\s/g, '') : '';

        return (selectedCategory === 'Tout' || productCategory === selectedCategory) &&
            (selectedColor === 'Tout' || productColor === selectedColor);
    });

    while (productsContainer.firstChild) {
        productsContainer.removeChild(productsContainer.firstChild);
    }

    var row = document.createElement('div');
    row.classList.add('row');
    productsContainer.appendChild(row);

    filteredProducts.forEach(function (product, index) {
        if (index % 4 === 0 && index !== 0) {
            row = document.createElement('div');
            row.classList.add('row');
            productsContainer.appendChild(row);
        }

        var col = document.createElement('div');
        col.classList.add('col-md-6', 'col-lg-3', 'mb-4');
        row.appendChild(col);

        var productDiv = document.createElement('div');
        productDiv.id = 'product' + product.id;
        productDiv.classList.add('product');
        productDiv.setAttribute('data-value', '');
        productDiv.setAttribute('data-nom', product.nom);
        productDiv.setAttribute('data-color', product.color);
        productDiv.setAttribute('data-price', product.price);
        productDiv.setAttribute('data-type', product.type);


        var productContent = `
            <img src="${product.variable.url}">
            <div class="product-info">
            <h6><em>${product.variable.nom ? product.variable.nom.toUpperCase() : ''}</em></h6>
                <h6><b>${product.variable.prix}$</b></h6>
                <div class="size-container">
                    <!-- Ici vous devez ajouter les boutons pour les tailles -->
                </div>
            </div>
            <div class="accessory" data-nom="Casquette" data-category="Accessoire" data-color="Noir" data-price="10">
                <select class="accessories-dropdown">
                    <option value=" ">Sélectionnez un accessoire</option>
                    <!-- Ici vous devez ajouter les options pour les accessoires -->
                </select>
                <button class="accessories-button">Ajouter l'accessoire au panier</button>
            </div>
        `;

        productDiv.innerHTML = productContent;
        col.appendChild(productDiv);
    });

}



function emptyPanier() {
    panierlist = [];
    panier = document.querySelector(".panier-items");
    panier.querySelectorAll(".panier-item").forEach(e => e.remove());

    const totalAmountElement = $("#totalAmount");
    totalAmountElement.text(0);

}
function finalizeOrder() {
    const form = $("#finaliserCommandeForm");

    form.submit(function (e) {
        e.preventDefault(e);
        var form2 = $("#finaliserCommandeForm");

        return $.ajax({
            url: '/sendOrder',
            type: 'post',
            data: { form: form2.serializeArray(), cart: panierlist },
            async: true,
            success: function (data) {
                alert(data);
                //form2.reset();
                $("form").trigger('reset');
                emptyPanier();
            }

        });


    })

}


function getStockValue(id, size) {
    return $.ajax({
        url: '/getstocks',
        type: 'post',
        data: { id_prod: id, taille: size },
        async: true,
        success: function (data) {
            return data;
        }

    })
}

function renderGerant() {
    $.ajax({
        url: '/gerant',
        type: 'get',
        success: function (data) {
            $('html').html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('AJAX call failed.');
            console.log(textStatus + ': ' + errorThrown);
        }
    });
}

/*Fonction qui permet de reset la page*/
function resetPage() {
    window.location.reload();
}


//Fonction qui gerer la connction
function listenerConnection() {
   
        $('#connexionForm').on('submit', function(event) {
            console.log("submit connexion form");
            event.preventDefault();  
            loginUser();
        });

}


function loginUser() {
    var email = $('#connexionEmail').val();
    var password = $('#connexionPassword').val();
    
    $.ajax({
        type: "POST",
        url: "/login",
        data: { email: email, password: password },
        success: function(response) {
            // Vous pouvez gérer la réponse du serveur ici.
            // Par exemple, vous pouvez rediriger l'utilisateur vers une autre page :
            window.location = '/gerant';
        },
        error: function(jqXHR, textStatus, errorThrown) {
            // Gérer les erreurs de la requête ici.
            console.log(textStatus, errorThrown);
        }
    });
}



//Fonction qui renvoie le gerant
function renderGerant() {
    $.ajax({
        url: '/gerant',
        type: 'get',
        success: function (data) {
            $('body').html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('AJAX call failed.');
            console.log(textStatus + ': ' + errorThrown);
        }
    });
}






/**
 * Associe à chaque produit, un objet produit lui correspondant
 */
function setProductsObjet() {

    return $.ajax({
        url: '/results',
        type: 'get',
        dataType: 'JSON',
        async: true,
        success: function (data) {
            for (let index = 0; index < storedProducts.length; index++) {
                storedProducts[index].variable = data[index];

            }
        }

    });



}

function addtoCartBack(prod) {

    $.ajax({
        url: '/addCart',
        type: 'POST',
        dataType: 'JSON',
        data: prod,
        async: true,
        success: function (data) {
        }
    })


}
function getCartFromBack() {
    $.ajax({
        url: '/cart',
        type: 'POST',
        dataType: 'JSON',
        async: true,
        success: function (data) {
            panierlist = data;
            renderCart();
        }
    })

}

function removeCartBack(prod) {

    $.ajax({
        url: '/removeCart',
        type: 'POST',
        dataType: 'JSON',
        async: true,
        success: function (data) {
        }
    })

}

function deleteArticleFromCart(id) {
    $.ajax({
        url: '/removeprodCart',
        type: 'POST',
        data: { id: id },
        async: true,
        success: function (data) {
        }
    })
}

function fillAccessoryList(id) {
    return $.ajax({
        url: '/fillAccessory',
        type: 'POST',
        data: { id: id },
        async: true,
        success: function (data) {
            return data;

        }

    })
}


function renderGerant() {
    $.ajax({
        url: '/gerant',
        type: 'get',
        success: function (data) {
            $('html').html(data);
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log('AJAX call failed.');
            console.log(textStatus + ': ' + errorThrown);
        }
    });
}

