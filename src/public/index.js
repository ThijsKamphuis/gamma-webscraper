
async function getInfo() {
    const artnr = document.getElementById('artinput').value
    let result;
    await fetch(`https://api.gamma.thijsk.systems/artinfo?artnr=${artnr}`)
        .then(r => r.json())
        .then(r => result = r)

    document.getElementById("productname").innerText = result.name;
    document.getElementById("productimg").src = result.img
    JsBarcode("#ean", result.ean, {
        format: "EAN13",
        background: 'rgba(0,0,0,0)',
    });


}
