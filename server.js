// Include Server Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");

//Require Article Schema
var Article = require(".models/Article");

// Creat Instance of Express
var app = express();
// Sets an initial port. We'll use this later in our listener
var PORT = process.env.PORT || 3000;

// Run Morgan fro Logging
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.text());
app.use(bodyParser.json({ type: "application/vnd.api+json" }));

app.use(express.static("./public"));

// ------------------------------------------------------

// MongoDB Configuration
mongoose.connect("mongodb://localhost/nytreact");
var db = mongoose.connection;

db.on("error", function(err) {
	console.log("Mongoose Error: ", err);
});

db.once("open", function() {
	console.log("Mongoose connection successful");
});

// -------------------------------------------------

// Main "/" Route. This wil redirect the user to the rendered react application
app.get("/", function(req, res) {
	res.sendfile(__dirname + "/public/index.html");
});

// This is the route we will send GET requests to retieve our most recent search data
// We will call this route the moment our page gets rendered
app.get("/api", function(req, res) {

	// We will find all the records, sort it in descending order, then limit the records to 5
	Article.find({}).sort([
		["date", "descending"]
	]).limit(5).exec(function(err, doc) {
		if (err) {
			console.log(err);
		}
		else {
			res,send(doc);
		}
	});
});

// This is the route we will send POST requests to save search
app.post("/api", function(req, res) {
	console.log("BODY: " + req.body.title);

	// Here we'll save the location based on the JSON input
	// We'll use Date.now() to always get the current date and time
	Article.create({
		title: req.body.title
		date: Date.now()
	}, function(err) {
		if (err) {
			console.log(err);
		}
		else {
			res.send("Saved Search!")
		}
	});
});

// -----------------------------------------------------

// Listener
app.listen(PORT, function() {
	console.log("App listening on PORT: " + PORT);
});