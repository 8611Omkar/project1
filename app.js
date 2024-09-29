const express = require("express");
const app = express();
const mongoose = require("mongoose")
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")


const MONGO_URL ="mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(() => {
    console.log('Connected to database')
    })
    .catch(err => {
        console.log(err);
    });

async function main() {
    await mongoose.connect(MONGO_URL);
    // console.log("Connected to database");

}

app.set("view engine","ejs");
app .set("views",path.join(__dirname, "views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("._method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "public")));    //for css and js files

app.get("/", (req, res) => {
    res.send("Hi I am root");
});

//index route
app.get("/listings", async (req, res) => {
    const allListings = await Listing.find({});
    res.render("./listings/index.ejs", { allListings });
});

//new route
app.get("/listings/new", (req, res) => {
    res.render("./listings/new.ejs");
});

//show route
app.get("/listings/:id", async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/show.ejs", { listing });
});

//create route
app.post("/listings", async (req, res) => {
    // let { title, description, price, location, country } = req.body;
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
});

//edit route
app.get("/listings/:id/edit",async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    res.render("./listings/edit.ejs", { listing });
    });

//update route
app.put("/listings/:id", async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, {...req.body.listing});
    res.redirect(`/listings/${id}`);
});

//delete route
app.delete("/listings/:id", async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listings");
});

// data intialization and testing
// app.get("/testListing", async (req, res) => {
//         let sampleListing = new Listing({
//             title:"My New Villa",
//             description:"This is a beautiful villa",
//             price: 1200,
//             location: "Calangute, Goa",
//             country: "India",
//         });

//         await sampleListing.save();
//         console.log("sample was saved");
//         res.send("successfull testing");
//     });
app.listen(8080, () =>{
    console.log("server is listening to port 8080");
    
})