let artinput = document.getElementById('artinput');
artinput.addEventListener("keydown", function (event) {
    if (event.key === " " || event.key === "Enter") {
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
    art.id = artnr
    art.textContent = artnr;
    artList.appendChild(art);
}

document.getElementById("artlist").addEventListener("click", function(click) {
    // Check if the clicked element is the delete button
    if (click.target && click.target.classList.contains("artnr")) {
        // Delete the parent <li> element
        click.target.remove();
    }
});

function clearList() {
    let artList = document.getElementById("artlist");
    while (artList.firstChild) {
        artList.removeChild(artList.lastChild)
    }
}

async function generateProducts() {
    clearProducts()

    const artList = document.getElementsByClassName("artnr");
    const artNrList = Array.from(artList);

    for (const li of artNrList) {
        let productInfo;
        try {
            await fetch(`https://api.gamma.thijsk.systems/artinfo?artnr=${li.textContent}`)
                .then(r => r.json()).then(r => productInfo = r);
        } catch (err) {
            console.log(`Product ${li.textContent} does not exist`);
            continue;
        }

        const product = document.createElement("div");
        product.classList.add("product");
        product.id = `product-${li.textContent}`;

        let productName = document.createElement("p");
        productName.classList.add("productname");
        productName.innerText = productInfo.name;
        product.appendChild(productName);

        const productAttr = document.createElement("div");
        productAttr.classList.add("productattr");
        productAttr.id = `productattr-${li.textContent}`;
        product.appendChild(productAttr);

        let productImg = document.createElement("img");
        productImg.classList.add("productimg");
        productImg.src = productInfo.img;
        productAttr.appendChild(productImg);

        const productData = document.createElement("div");
        productData.classList.add("productdata");
        productData.id = `productdata-${li.textContent}`;
        productAttr.appendChild(productData);

        let productSize = document.createElement("p");
        productSize.classList.add("productsize");
        productSize.innerText = productInfo.size;
        productData.appendChild(productSize);

        let productNr = document.createElement("p");
        productNr.classList.add("productnr");
        productNr.innerText = li.textContent;
        productData.appendChild(productNr);

        let productEAN = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        productEAN.classList.add("productean");
        productEAN.setAttribute("id", `EAN-${li.textContent}`);
        productData.appendChild(productEAN);

        document.getElementById("products").appendChild(product);

        JsBarcode(`#EAN-${li.textContent}`, productInfo.ean, {
            format: "ean13",
            background: 'rgba(0,0,0,0)',
            width: 1,
            height: 50,
            margin: 0,
        });
    }
}

function clearProducts() {
    let products = document.getElementById("products");
    while (products.firstChild) {
        products.removeChild(products.lastChild)
    }
}


