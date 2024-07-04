'use strict';
var http = require('http');
var url = require('url');
var querystring = require('querystring');
var port = process.env.PORT || 1337;

function checkDiscount(purchaseValue) {
    let discount;

    if (purchaseValue < 100) {
        discount = 0;
    } else if (purchaseValue < 500) {
        discount = 5;
    } else {
        discount = 10;
    }

    if (discount === 0) {
        return `Purchase Value is ${purchaseValue}, there are no discount.`;
    } else {
        return `Purchase Value is ${purchaseValue}, discount is ${discount}%.`;
    }
}

http.createServer(function (req, res) {
    if (req.method === 'GET') {
        // Display the HTML form
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <html>
            <body>
                <form method="post" action="/">
                    <label for="purchaseValue">Enter Purchase Value:</label>
                    <input type="number" id="purchaseValue" name="purchaseValue" required>
                    <input type="submit" value="Submit">
                </form>
            </body>
            </html>
        `);
    } else if (req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            var postData = querystring.parse(body);
            var purchaseValue = parseFloat(postData.purchaseValue);
            if (!isNaN(purchaseValue)) {
                console.log('Parsed Purchase Value:', purchaseValue);
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end(checkDiscount(purchaseValue));
            } else {
                console.log('Invalid Purchase Value:', postData.purchaseValue);
                res.writeHead(400, { 'Content-Type': 'text/plain' });
                res.end('Please provide a valid purchase value.');
            }
        });
    }
}).listen(port, function () {
    console.log('Server running at http://localhost:' + port);
});
