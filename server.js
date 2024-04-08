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
        "mongodb+srv://zoelenore:1415Birchave!@assignment15.dg9dui2.mongodb.net/hw17?retryWrites=true&w=majority&appName=assignment15")    .then(() => console.log("Connected to mongodb..."))
    .catch((err) => console.error("DB Error: Could not connect to MongoDB.", err));

const craftSchema = new mongoose.Schema({
    id: String,
    name: String,
    image: String,
    description: String,
    supplies: [String]
});

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});


const Craft = mongoose.model("crafts", craftSchema);

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
    let filename; // Declare filename variable here
    const suppliesArray = req.body.supplies.split(',').map(item => item.trim());
    req.body.supplies = suppliesArray;
    

    if (req.body.imgsrc !== "") {
        // If imgsrc is not empty, set filename to imgsrc
        filename = req.body.imgsrc;
    } else {
        // If imgsrc is empty, check if a file is uploaded
        if (req.file && req.file.filename) {
            filename = req.file.filename;
        } else {
            // If neither imgsrc nor file is available, handle this condition accordingly
            console.log("Neither imgsrc nor file is available");
            res.status(400).send("Neither imgsrc nor file is available");
            return;
        }
    }

    // Throw away imgsrc, it's a placeholder
    delete req.body.imgsrc;
    filename = extractFilename(filename);

    console.log("Received POST");
    console.log("Filename: " + filename);

    // Update req.body.image with the value of filename
    req.body.image = filename;

    console.log("Req.body: ", req.body);

    // Validate the craft data
    const result = validateCraft(req.body);
    if (result.error) {
        // Handle validation error
        res.status(400).send("Improper validation of payload " + result.error.details[0].message);
        return;
    }
    const supplyString = req.body.supplies;
    if (!Array.isArray(supplyString)) {
        const supplyArray = supplyString.split(",");
        req.body.supplies = supplyArray;
    }   

    // Check if _id is not -1, if so, update the existing craft
    if (req.body._id !== "-1") {
        
        Craft.findOneAndUpdate(
            { _id: req.body._id },
            { $set: req.body },
            { new: true }
        )
            .then(updatedCraft => {
                if (updatedCraft) {
                    console.log("Craft updated successfully");
                    res.send(updatedCraft);
                } else {
                    console.log("Craft not found for updating");
                    res.status(404).send("Craft not found for updating");
                }
            })
            .catch(error => {
                console.error('DB Error updating craft:', error);
                res.status(500).send('DB Error updating craft');
            });
    } else {
        // If _id is -1, save a new craft to the database
        const newCraft = {
            name: req.body.name,
            image: req.body.image,
            description: req.body.description,
            supplies: req.body.supplies
        };

        const newCraftDB = new Craft(newCraft);
        newCraftDB.save()
            .then(savedCraft => {
                console.log("Craft saved successfully");
                res.send(savedCraft);
            })
            .catch(error => {
                console.error('DB Error creating craft:', error);
                res.status(500).send('DB Error creating craft');
            });
    }
});


function extractFilename(url) {
    // Split the URL by forward slashes
    const parts = url.split('/');
    // Get the last part (which should be the filename)
    const filename = parts[parts.length - 1];
    return filename;
}

const validateCraft = (craft) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        name: Joi.string().min(3).required(),
        image: Joi.string().min(5).required(),
        description: Joi.string().min(1).required(),
        supplies: Joi.allow(),
    });
    return schema.validate(craft);
}

app.get("/api/crafts", (req, res) => {
    // Fetch all the crafts from MongoDB
    Craft.find({})
        .then(documents => {
            // Map each document to the desired format
            const crafts = documents.map(doc => ({
                id: doc._id,
                name: doc.name,
                image: doc.image,
                description: doc.description,
                supplies: doc.supplies
            }));
            // Respond with the fetched crafts data
            res.json(crafts);
        })
        .catch(err => {
            console.error('DB Error retrieving crafts:', err);
            // Handle error
            res.status(500).send('DB Error retrieving crafts');
        });
});

app.listen(3002, () => {
    console.log("Listening on port 3002");
});