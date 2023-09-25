const fs = require("fs")
const http = require("http")
const url = require("url")

//const read = fs.readFileSync('./simple.txt',"utf-8")
//console.log(read)
//const textwrite = "this text is to be written in file using writefile fs"
//const write=fs.writeFileSync("./write.txt",textwrite)

//const write=fs.readFile("./simple.txt","utf-8",(err,data)=>{
//console.log(data)
//})
//console.log("file is readed asyncronesly")

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g,product.productName);
    output=output.replace(/{%IMAGE%}/g,product.image);
    output=output.replace(/{%PRICE%}/g,product.price);
    output=output.replace(/{%FROM%}/g,product.from);
    output=output.replace(/{%NUTRIENTS%}/g,product.nutrients);
    output=output.replace(/{%QUANTITY%}/g,product.quantity);
    output=output.replace(/{%DESCRIPTION%}/g,product.description);
    output=output.replace(/{%ID%}/g,product.id);

    if(!product.organic)output=output.replace(/{%NOT_ORGANIC%}/g,'not-organic');
    return output;
}

const template_overview = fs.readFileSync(`./templates/overview.html`, "utf-8");
const template_product = fs.readFileSync(`./templates/product.html`, "utf-8");
const template_card = fs.readFileSync(`./templates/card.html`, "utf-8");

const data = fs.readFileSync(`./dev-data/data.json`, "utf-8");
const dataObj = JSON.parse(data)

const server = http.createServer((req, res) => {
    const {query,pathname} =url.parse(req.url,true);

    if (pathname === "/" || pathname === "/overview") {
        res.writeHead(200, { "Content-type": "text/html" })
        const cardsHtml = dataObj.map(el => replaceTemplate(template_card, el)).join("");
        const output = template_overview.replace("{%PRODUCT_CARDS%}",cardsHtml);
        res.end(output)
    }
    else if (pathname === "/product") {
        res.writeHead(200, { "Content-type": "text/html" })
        const product = dataObj[query.id];
        const output = replaceTemplate(template_product,product)
        res.end(output)

    }
    else if (pathname === "/api") {

        res.writeHead(200, { "Content-type": "text/html" })
        res.end(data)
    }
    else{
        res.writeHead(404, { "Content-type": "application/json" });
        res.end("page not found invalid url")
    }
})

server.listen(8000, "127.0.0.1", () => {
    console.log("app listen on port 8000")
})



