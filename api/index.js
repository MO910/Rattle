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
    "mongodb+srv://SHARK:XJ9WcIYAV5UmFJjc@cluster0.qibbwql.mongodb.net/?retryWrites=true&w=majority";
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
app.use(
    express.urlencoded({
        extended: true,
    })
);
// Routs
app.use("/auth", authAPIRout);
// Exports
module.exports = app;
