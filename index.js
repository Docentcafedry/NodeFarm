const fs = require("fs");
const http = require("node:http");
const url = require("url");

const overview = fs.readFileSync(
  `${__dirname}/templates/overview.html`,
  "utf-8"
);

const card = fs.readFileSync(`${__dirname}/templates/card.html`, "utf-8");

const product = fs.readFileSync(`${__dirname}/templates/product.html`, "utf-8");

const dataJson = fs.readFileSync(`${__dirname}/dev-data/data.json`, "utf-8");

const data = JSON.parse(dataJson);

function replaceProduct(temp, product) {
  let output = temp.replace(/{%NAME%}/g, product.productName);
  output = output.replace(/{%IMAGE%}/g, product.image);
  output = output.replace(/{%QUATITY%}/g, product.quantity);
  output = output.replace(/{%PRICE%}/g, product.price);
  output = output.replace(/{%FROM%}/g, product.from);
  output = output.replace(/{%NUTRIENTS%}/g, product.nutrients);
  output = output.replace(/{%ID%}/g, product.id);
  output = output.replace(/{%DESCRIPTION%}/g, product.description);

  if (!product.organic) {
    output = output.replace(/{%ORGANIC%}/g, "not-organic");
  }
  return output;
}

const server = http.createServer((req, res) => {
  const { pathname, query } = url.parse(req.url, true);

  if (pathname === "/" || pathname === "/overview") {
    const cards = data.map((prod) => replaceProduct(card, prod)).join(" ");
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const overviewTemplate = overview.replace(/{%CARDS%}/g, cards);

    res.end(overviewTemplate);
  } else if (pathname === "/product") {
    res.writeHead(200, {
      "Content-type": "text/html",
    });

    const productTemplate = replaceProduct(product, data[query.var]);

    res.end(productTemplate);
  }
});

server.listen(8000, "127.0.0.1", () => {
  console.log("Listening on 127.0.0.1:8000");
});
