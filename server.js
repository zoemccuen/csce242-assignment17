const express = require("express");
const Joi = require("joi");
const mongoose = require("mongoose");
const multer = require('multer')
const cors = require("cors");
const { ReadConcern } = require("mongodb");
const path = require('path');
const app = express();

app.use(express.static("public")); // Use the Public folder for html, scripts, and css
app.use(express.json()); // Process JSON
app.use(cors()); // Cross-site/domain allowance

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, __dirname + '/public/images/'); // Specify your upload destination
    },
    filename: function (req, file, cb) {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext); // Rename file with timestamp and original extension
    }
});

const upload = multer({ storage: storage });

mongoose
    .connect(
        "mongodb+srv://zoelenore:1415Birchave!@assignment15.dg9dui2.mongodb.net/hw17?retryWrites=true&w=majority&appName=assignment15")
    .then(() => console.log("Connected to mongodb..."))
    .catch((err) => console.error("DB Error: Could not connect to MongoDB.", err));

const craftSchema = new mongoose.Schema({
    id: String,
    name: String,
    image: String,
    description: String,
    supplies: [String]
});

const Craft = mongoose.model("crafts", craftSchema);

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

let crafts = [];

    //Fetch all the crafts in Mongo and add them to the Array
    Craft.find({}) // Use find() without a callback
    .then(documents => {
        // Iterate over the array of documents
        documents.forEach(doc => {
            // Push each document into the 'crafts' array
            crafts.push({
                id: doc._id,
                name: doc.name,
                image: doc.image,
                description: doc.description,
                supplies: doc.supplies
            });
        });        
    })
    .catch(err => {
        console.error('DB Error retrieving crafts:', err);
        // Handle error
    });

app.post("/api/crafts", upload.single("image"), (req, res) => {
    const filename = req.file.filename
    console.log("Recieved POST");
    console.log(req.body);
    req.body["image"] = filename;
    const result = validateCraft(req.body);
    if (result.error) {
        res.status(400).send("Improper validation of payload " + result.error.details[0].message);
        return;
    }

    const newCraft = {
        id: crafts.length + 1,
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        supplies: req.body.supplies.split(",")
    };

    const newCraftDB = new Craft({
        id: crafts.length + 1,
        name: req.body.name,
        image: req.body.image,
        description: req.body.description,
        supplies: req.body.supplies.split(",")
    });

    // Save the new craft document to the database
    newCraftDB.save()
        .then(() => {
            crafts.push(newCraft);
            res.send(newCraft);
        })
        .catch(error => {
            console.error('DB Error creating craft:', error);
            res.status(500).send('DB Error creating craft');
        });

});

const validateCraft = (craft) => {
    const schema = Joi.object({
        id: Joi.allow(""),
        name: Joi.string().min(3).required(),
        image: Joi.string().min(5).required(),
        description: Joi.string().min(1).required(),
        supplies: Joi.allow(),
    });
    return schema.validate(craft);
}

app.get("/api/crafts", (req, res) => {
    console.log("/api/crafts/ called. Returning json");
    res.json(crafts);
});

app.listen(3000, () => {
    console.log("Listening on port 3000");
});