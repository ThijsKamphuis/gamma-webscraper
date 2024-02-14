const axios = require('axios');
const cheerio = require('cheerio');
const express = require("express");
const app = express();
const port = 6969;

const cors = require('cors');
app.use(cors({origin: '*'}));

async function scrapeSite(artnr) {
    const url = `https:/gamma.nl/p/${artnr}`;
    const { data } = await axios.get(url)
        .catch(err => {
            throw new Error(String(err.response.status));
        });

    const $ = cheerio.load(data);

    const result = {};
    result.name = ($('h1').text());
    result.img = ($('img.product-main-image').attr('data-src'));
    result.ean = ($(`div[data-product-code="${artnr}"]`).attr('data-ean'));

    return result;

}

app.get("/artinfo", async (req, res) => {
    const {artnr} = req.query;
    try {
        res.send(await scrapeSite(artnr));
    } catch (err) {

        res.sendStatus(err.message);
    }
});

app.listen(port,  () => {
    console.log( 'Server is up and running on ' + port );
});
