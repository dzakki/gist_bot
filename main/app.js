'use strict';

if (process.env.NODE_ENV === 'development') {
    require("dotenv").config()
}

const
    express = require('express'),
    app = express(),
    router = require("./routes"),
    path = require('path'),
    PORT = process.env.PORT || 1337;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const publicPath = path.join(__dirname, 'view');

console.log(path.join(publicPath, 'index.html'))
app.get('/webview', (req, res) => {
    res.sendFile(path.join(publicPath, 'index.html'));
});

app.use(router);


app.listen(PORT, () => console.log('webhook is listening in port: ' + PORT));