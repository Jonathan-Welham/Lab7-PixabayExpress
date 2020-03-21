var express = require("express");
var bodyparser = require("body-parser");
var request = require('request');
var app = express();
var jsdom = require("jsdom");

const {JSDOM} = jsdom;
const {window} = new JSDOM();
const{document} = (new JSDOM('')).window;
global.document = document;
var $ = require("jquery")(window);

app.set("view engine", "ejs");
app.use(express.static("public")); //folder for images, css, js
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

var keywords = ["cats", "dogs", "animals", "cars", "otters"];
//routes
app.get("/", async function(req, res){

  let randomKey = Math.floor(Math.random() * 5);
  let orient = req.query.orientation;
  let parsedData = await getImages(keywords[randomKey], orient);

  console.dir("parsedData: " + parsedData); //displays content of the object

  res.render("index", {"images":parsedData});

}); //root route


app.get("/results", async function(req, res){

    //console.dir(req);
    let keyword = req.query.keyword; //gets the value that the user typed in the form using the GET method

    let orient = req.query.orientation;

    let parsedData = await getImages(keyword, orient);

    res.render("results", {"images":parsedData});

});//results route


//Returns all data from the Pixabay API as JSON format
function getImages(keyword, orientation){


    return new Promise( function(resolve, reject){
        request('https://pixabay.com/api/?key=5589438-47a0bca778bf23fc2e8c5bf3e&q='
          +keyword+"&orientation="+orientation,
                 function (error, response, body) {

            if (!error && response.statusCode == 200  ) { //no issues in the request

                 let parsedData = JSON.parse(body); //converts string to JSON

                 resolve(parsedData);

                //let randomIndex = Math.floor(Math.random() * parsedData.hits.length);
                //res.send(`<img src='${parsedData.hits[randomIndex].largeImageURL}'>`);
                //res.render("index", {"image":parsedData.hits[randomIndex].largeImageURL});

            } else {
                reject(error);
                console.log(response.statusCode);
                console.log(error);
            }

          });//request

    });

}


//starting server
app.listen(process.env.PORT, function(){
    console.log("Express server is running...");
});
