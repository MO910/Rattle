const express = require("express"),
    app = express(),
    bodyParser = require("body-parser"),
    authAPIRout = require("./routes/users");
// GraphQL
const { graphqlHTTP } = require("express-graphql");
const schema = require("./graphQl/schema");
// Mongoose Setup
const mongoose = require("mongoose");
const uri =
    "mongodb+srv://SHARK:5feceb66ffc86f38d952786c6d696c79c2dbc239dd4e91b46729d73a27fb57e9@cluster0.opfeb.mongodb.net/Rattel?retryWrites=true&w=majority";
mongoose
    .connect(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(async () => {
        app.use("/", graphqlHTTP({ schema, graphiql: true })); // here disable graphial = false
    });
// bodyParser
app.use(express.json());
// app.use(
//     express.urlencoded({
//         extended: true,
//     })
// );
// Routs
app.use("/auth", authAPIRout);
// Exports
module.exports = app;
