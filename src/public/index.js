let artinput = document.getElementById('artinput');
artinput.addEventListener("keydown", function (event) {
    if (event.key === " "|| event.key === "Enter") {
        event.preventDefault();
        let artnr = artinput.value.trim();
        if (artnr !== "" && !isNaN(Number(artnr)) && artnr.length === 6) {
            addArticle(artnr);
        }
        artinput.value = "";
    }
});

function addArticle(artnr) {
    let artList = document.getElementById("artlist");
    let art = document.createElement("li");
    art.classList.add("artnr")
    art.textContent = artnr;
    artList.appendChild(art);
}

function clearList() {
    let artList = document.getElementById("artlist");
    while (artList.firstChild) {
        artList.removeChild(artList.lastChild)
    }
}

async function fetchProducts() {
    clearProducts()
    

    const artList = document.getElementsByClassName("artnr");
    const artNrList = Array.from(artList);

    for (const li of artNrList) {
        let productInfo;
        await fetch(`https://api.gamma.thijsk.systems/artinfo?artnr=${li.textContent}`)
            .then(r => r.json()).then(r => productInfo = r);

        const product = document.createElement("div");
        product.classList.add("product");
        product.id = `product-${li.textContent}`;

        let productName = document.createElement("p");
        productName.classList.add("productname");
        productName.innerText = productInfo.name;
        product.appendChild(productName);


        let productImg = document.createElement("img");
        productImg.classList.add("productimg");
        productImg.src = productInfo.img;
        productImg.style.maxHeight = '100px';
        productImg.style.padding= '10px'
        product.appendChild(productImg);


        let productEAN = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        productEAN.classList.add("productEAN");
        productEAN.setAttribute("id", `EAN-${li.textContent}`);
        product.appendChild(productEAN);

        document.getElementById("products").appendChild(product);

        JsBarcode(`#EAN-${li.textContent}`, productInfo.ean, {
            format: "ean13",
            background: 'rgba(0,0,0,0)',
            width: 1,
            height: 50,
        });
    }
}

function clearProducts() {
    let products = document.getElementById("products");
    while (products.firstChild) {
        products.removeChild(products.lastChild)
    }
}

