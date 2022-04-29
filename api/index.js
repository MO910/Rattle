const express = require("express"),
    app = express(),
    bodyParser = require("body-parser");
// bodyParser
// app.use(bodyParser.json());
// Routs
app.get("/lala", (req, res) => {
    console.log(req.query);
    res.json({
        msg: "lkfsadj",
    });
    console.log(";llfksadj;lkfjas;okldfjsl;akdfjsa;ldfkjas");
});
// Exports
module.exports = app;
