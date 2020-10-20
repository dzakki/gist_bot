'use strict';


const
    express = require('express'),
    app = express(),
    router = require("./routes"),
    PORT = process.env.PORT || 1337;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.use(router);


app.listen(PORT, () => console.log('webhook is listening in port: ' + PORT));