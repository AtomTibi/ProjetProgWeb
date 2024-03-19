let combinaison_list = [];


$(document).ready(function () {

    showSizes();

    $("#combinaisonbutton").on("click", () => {
        getCombinaisonListFromServer();
        setBuyButtonAction();
        createDropdownButton();
    });


    /*Bouton qui permet de choisir le type de combinaison*/
    function createDropdownButton() {

        var filtersDiv = document.querySelector('.filters');
        var children = filtersDiv.getElementsByTagName('*');

        for (var i = 0; i < children.length; i++) {
            children[i].style.display = 'none';

        }

        // Créer l'élément de liste déroulante (dropdown)
        var dropdownDiv = document.createElement('div');
        dropdownDiv.classList.add('dropdown');

        // Créer le bouton de la liste déroulante
        var dropdownButton = document.createElement('button');
        dropdownButton.classList.add('btn', 'btn-primary', 'dropdown-toggle', 'mb-2');
        dropdownButton.type = 'button';
        dropdownButton.id = 'sizeDropdown';
        dropdownButton.setAttribute('data-bs-toggle', 'dropdown');
        dropdownButton.setAttribute('aria-expanded', 'false');
        dropdownButton.textContent = 'Type';

        // Créer les options de la liste déroulante
        var dropdownMenu = document.createElement('div');
        dropdownMenu.classList.add('dropdown-menu');
        dropdownMenu.setAttribute('aria-labelledby', 'sizeDropdown');

        var types = ['Tout','Business','Comfort'];
        
        for (var i = 0; i < types.length; i++) {
            var option = document.createElement('a');
            option.classList.add('dropdown-item');
            option.href = '#';
            option.textContent = types[i];
            option.setAttribute('data-type', types[i]); // Ajout de l'attribut data-type
            dropdownMenu.appendChild(option);
        }
        
        dropdownMenu.addEventListener('click', function(e) {
            e.preventDefault(); // Prévenir le comportement par défaut du clic sur le lien
            if (e.target.getAttribute('data-type') === 'Comfort') { // Vérifier si l'option "Comfort" a été cliquée
                console.log("click comfort");
                getCombinaisonComfortListFromServer(); // Exemple d'appel de fonction
                // showCombinaisons();
            }else if (e.target.getAttribute('data-type') === 'Business') { // Vérifier si l'option "Comfort" a été cliquée
                console.log("click business");
                getCombinaisonBusinessListFromServer();
                // showCombinaisons();
            }else{
                getCombinaisonListFromServer();
            }
        });

        // Ajouter les éléments à la structure HTML
        dropdownDiv.appendChild(dropdownButton);
        dropdownDiv.appendChild(dropdownMenu);
        filtersDiv.appendChild(dropdownDiv)

    }

    function showSizes() {
        $(".product").each(function () {
            $(this).on("click", () => {
                if (!($(this).find(".size-container").is(":visible"))) {
                    $(this).find(".size-container").css("display", "block");
                } else {
                    $(this).find(".size-container").css("display", "none");
                }
            })
        })

    }

    //Fonction qui permet l'affichage des combinaisons 
    function showCombinaisons() {
        $("#rowproducts").empty();

        var cp = $("<div/>", { class: "combinaisonparent row" });

        for (const combinaison of combinaison_list) {
            
            
            var combi = $("<div/>", { class: "combinaison col-md-6 col-lg-3 mb-4" });
            combi.data('variable', combinaison);

            var produitsDiv = $("<div/>", { class: "products-div" }); // div pour les produits

            var index = 0;

            //On intialise le prix de la combinaison
            var totalPrice = 0;

            for (const produit of combinaison.prod) {
                totalPrice += produit.prix;
                var produitdiv = $("<div/>", { id: "produit" + produit.id + index, class: "combinaison-product" });
                index++;
                produitdiv.data("nom", produit.nom);
                produitdiv.data("color", produit.color);
                produitdiv.data("price", produit.prix);
                produitdiv.prepend('<img src="' + produit.url + '"/>');

                var produit_info = $("<div/>", { class: "product_info" });
                produit_info.text(produit.nom);


                var sizeContainer = $("<div/>", { class: "size-container" });
                sizeContainer.css("display", "none"); // Masquer le sizeContainer par défaut

                //Exemples factices tailles
                var sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
                var stock = [2, 2, 0, 0, 3, 3];  // T
                for (var i = 0; i < sizes.length; i++) {
                    var sizeButton = $("<button/>", { class: "size-button", "data-size": sizes[i], "data-stock": stock[i] }).text(sizes[i]);
                    sizeContainer.append(sizeButton);
                }

                produitdiv.append(produit_info);
                produitdiv.append(sizeContainer); // ajouter sizeContainer à chaque produit
                produitsDiv.append(produitdiv); // ajouter chaque produit à la div parente

                produitdiv.on("click", function () {
                    console.log("C'est un produit combinaison");
                    const sizeContainer = $(this).find(".size-container");
                    if (sizeContainer) {
                        sizeContainer.toggle(); // Basculer l'affichage du sizeContainer
                    }
                });
            }

            //On ajoute les elements qu'il faut à la combinaison
            combi.append(produitsDiv); // ajouter la div parente à la combinaison                        
            var buyButton = $("<button/>", { class: "buy-button" }).text("Acheter (" + totalPrice + "$)");
            combi.append(buyButton);

            //On ajoute la combinaison à l'ensemble des combinaisons 
            cp.append(combi);
        }

        $("#rowproducts").append(cp);
    }


    //Fonction qui qui permet d'afficher/d'avoir les combinaisons de type "Comfort"
    function getCombinaisonComfortListFromServer() {
        return $.ajax({
            url: '/combinaisons/comfort',
            type: 'get',
            dataType: 'JSON',
            async: true,
            success: function (data) {
                combinaison_list = []; // Vider la liste avant d'ajouter de nouvelles combinaisons
                for (let index = 0; index < data.length; index++) {
                    combinaison_list.push(data[index]);
                }
                showCombinaisons(); // Appelerla fonction pour afficher les combinaisons
            }
        });
    }


    //Fonction qui qui permet d'afficher/d'avoir les combinaisons de type "Business"
    function getCombinaisonBusinessListFromServer() {
        return $.ajax({
            url: '/combinaisons/business',
            type: 'get',
            dataType: 'JSON',
            async: true,
            success: function (data) {
                combinaison_list = []; // Videz la liste avant d'ajouter de nouvelles combinaisons
                for (let index = 0; index < data.length; index++) {
                    combinaison_list.push(data[index]);
                }
                showCombinaisons(); // Appelez la fonction pour afficher les combinaisons
            }
        });
    }
    

    //Fonction qui qui permet d'afficher/d'avoir les combinaisons 
    function getCombinaisonListFromServer() {
        return $.ajax({
            url: '/combinaisons', // l'URL pour récupérer toutes les combinaisons, pas seulement les combinaisons confort
            type: 'get',
            dataType: 'JSON',
            async: true,
            success: function (data) {
                combinaison_list = []; // videz la liste avant d'ajouter de nouvelles combinaisons
                for (let index = 0; index < data.length; index++) {
                    combinaison_list.push(data[index]);
                }
                showCombinaisons(); // appelez la fonction pour afficher les combinaisons
            }
        });
    }
    
    function setBuyButtonAction() {

        $("#comb").each(function () {
            var c = $(this);
            $(this).find(".buy-button").on("click", () => {
      
                for (let index = 0; index <c.data("variable").prod.length; index++) {
                    addtoCart(c.data("variable").prod[index]);
                                    
                }
                

            })

        })
    }

});



function addtoCart(prod){
    $.ajax({
        url: '/addCart',
        type: 'POST',
        data : prod,
        async: true,
        success: function (data) {
        }
    })
}

