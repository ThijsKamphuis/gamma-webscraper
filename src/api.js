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

    const { name, size } = getDimensions(($('h1').text()));

    let result = {};
    result.name = name;
    result.size = size;
    result.img = ($('img.product-main-image').attr('data-src'));
    result.ean = ($(`div[data-product-code="${artnr}"]`).attr('data-ean'));
    result.type = $('th.attrib:contains("Type")').next('td.value').find('a.feature-value').text();
    console.log(result);
    return result;
}

function getDimensions(name) {
    const dRegex = [
        /\d+x\d+x\d+\s*cm/g, // _x_x_ cm
        /\d+x\d+\s*cm/g, // _x_ cm
    ];
    let size = null;
    for (const regex of dRegex) {
        const match = name.match(regex);
        if (match) {
            size = match[0];
            name = name.replace(size, "").trim();
            break;
        }
    }
    return { name, size };
}

app.get('/artinfo', async (req, res) => {
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
