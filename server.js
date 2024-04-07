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
        "mongodb+srv://zoelenore:1415Birchave!@assignment15.dg9dui2.mongodb.net/csce242?retryWrites=true&w=majority&appName=assignment15")
    .then(() => console.log("Connected to mongodb..."))
    .catch((err) => console.error("could not connect ot mongodb...", err));

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

let crafts = [
    {
        "id": "1",
        "name": "Beaded JellyFish",
        "image": "bead-jellyfish.jpg",
        "description": "Create a hanging jellyfish using eggcartons and multicolored beads",
        "supplies": [
            "string",
            "egg cartons",
            "beads"
        ]
    },
    {
        "id": "2",
        "name": "Character Bookmarks",
        "image": "bookmarks.jpeg",
        "description": "Create a little birdy bookmark to always remin you were you were",
        "supplies": [
            "yellow construction paper",
            "orange construction paper",
            "black construction paper"
        ]
    },
    {
        "id": "3",
        "name": "Button Flowers",
        "image": "button-flowers.jpeg",
        "description": "Create a fun bouquet of flowers with your favorite buttons",
        "supplies": [
            "multicolored buttons",
            "multicolored flet",
            "green straws",
            "ribbon"
        ]
    },
    {
        "id": "4",
        "name": "Cheerio Necklaces",
        "image": "cheerio-necklace.webp",
        "description": "Create a fun and edible necklace",
        "supplies": [
            "Cheerios or Fruit Loops",
            "Elastic string"
        ]
    },
    {
        "id": "5",
        "name": "Cotton Ball Cupcakes",
        "image": "cotton-ball-cupcakes.webp",
        "description": "Decorate your fun filled cupcake however you want.",
        "supplies": [
            "Construction Paper",
            "Cotton Balls",
            "Black Sharpie",
            "Glitter"
        ]
    },
    {
        "id": "6",
        "name": "School Themed Mason Jars",
        "image": "decorated-jars.jpeg",
        "description": "Let's make mason jars to ",
        "supplies": [
            "Construction Paper",
            "Cotton Balls",
            "Black Sharpie",
            "Glitter"
        ]
    },
    {
        "id": "7",
        "name": "Egg Carton Flowers",
        "image": "egg-carton-flowers.jpg",
        "description": "Make a beautiful bouquet with egg cartons and other items you can find around the house",
        "supplies": [
            "Egg Cartons",
            "Butons",
            "Green Pipe Cleaner",
            "Ribbon",
            "Canvas"
        ]
    },
    {
        "id": "8",
        "name": "Finger Puppets",
        "image": "finger-puppets.jpeg",
        "description": "These little critters are easy to make, and will entertain your little one while they make a show.",
        "supplies": [
            "Pom-poms",
            "Googly Eyes",
            "Pipe Cleaner"
        ]
    },
    {
        "id": "9",
        "name": "Ribbon Flower Headbands",
        "image": "flower-headbands.jpg",
        "description": "Let your little one show off her new style with these pretty and customizable headbands",
        "supplies": [
            "Plain headband",
            "Ribbon",
            "Buttons",
            "Gems"
        ]
    },
    {
        "id": "10",
        "name": "Hand Print Fish Puppets",
        "image": "handprint-fish.jpg",
        "description": "We all need to take every opportunity we can to remember those tiny hands, and what better way to do it, then to make fish puppets!",
        "supplies": [
            "Popsicle sticks",
            "Cardstock",
            "Gems",
            "Googly Eyes"
        ]
    },
    {
        "id": "11",
        "name": "Hand Print Tree",
        "image": "hand-print-tree.jpeg",
        "description": "This is a fun way to get your little one into finger painting.",
        "supplies": [
            "Watercolor Paper",
            "Finger paint"
        ]
    },
    {
        "id": "12",
        "name": "Melted Bead Bowl",
        "image": "melted-bead-bowl.jpeg",
        "description": "All they need to do is shape their faviorte design, warm it up and they have a brand new bowl.",
        "supplies": [
            "Beads",
            "Bowl",
            "Parchment paper"
        ]
    },
    {
        "id": "13",
        "name": "Monster Kites",
        "image": "monster-rolls.jpg",
        "description": "Let's make those scary toilet paper rolls fly!",
        "supplies": [
            "Toilet paper rolls",
            "Paint",
            "Tissue Paper",
            "String"
        ]
    },
    {
        "id": "14",
        "name": "Pool Noodle Boats",
        "image": "noodle-boats.png",
        "description": "Let's make a boat that will actually float, due to the floating bottom of a pool noodle.",
        "supplies": [
            "Pool Noodle",
            "Straw",
            "Plastic Paper"
        ]
    },
    {
        "id": "15",
        "name": "Paper Plate Bees",
        "image": "paper-plate-bees.jpeg",
        "description": "Let's have fun with making cute little bees, or big bees actually.",
        "supplies": [
            "Paper Plate",
            "Googly Eyes",
            "Close Pins",
            "Black pom poms",
            "Yellow Paint",
            "Black Paint"
        ]
    },
    {
        "id": "16",
        "name": "Paper Plate Dinosaurs",
        "image": "paper-plate-dinosaurs.jpg",
        "description": "Who would have thought that half a paper plate would be the base of a dinosaur.",
        "supplies": [
            "Paper Plate",
            "Paint",
            "Close Pins",
            "Construction Paper"
        ]
    },
    {
        "id": "17",
        "name": "Porcupine Leafs",
        "image": "porcupine-leaf.webp",
        "description": "Let's turn an ordinary paper plate into a fun filled mask.",
        "supplies": [
            "Leafs",
            "Berries",
            "Acorns",
            "Construction Paper"
        ]
    },
    {
        "id": "18",
        "name": "Rainbow Cloud",
        "image": "rainbow-cloud.webp",
        "description": "Some cotton and color and you'll have a beautiful rainbow.",
        "supplies": [
            "Paper Plate",
            "Cotton Balls",
            "Construction Paper"
        ]
    },
    {
        "id": "19",
        "name": "Fun Shaped Crayons",
        "image": "shaped-crayons.jpg",
        "description": "Let's melt some crayons together and let them harden into fun shapes.",
        "supplies": [
            "Broken Crayons",
            "Mold"
        ]
    },
    {
        "id": "20",
        "name": "Straw Farris Wheel",
        "image": "straw-faris-wheel.jpg",
        "description": "It might be too small to ride, but this farris wheel is the most colorful of all.",
        "supplies": [
            "Multicolored straws",
            "Platform"
        ]
    },
    {
        "id": "21",
        "name": "Sunny String",
        "image": "sun-string.jpg",
        "description": "Let's practice our fine motor skills while we weave the string into a fun sun.",
        "supplies": [
            "Yellow String",
            "Paper Plate",
            "Yellow construction paper",
            "Yellow and Orange beads"
        ]
    },
    {
        "id": "22",
        "name": "Tissue Ballerinas",
        "image": "tisue-dancer.jpeg",
        "description": "These beautiful dancers will look great on display",
        "supplies": [
            "Pipe cleaner",
            "Tissue Paper",
            "Elastics"
        ]
    },
    {
        "id": "23",
        "name": "Toilet Paper Roll Animals",
        "image": "toilet-paper-animals.jpeg",
        "description": "These beautiful dancers will look great on display",
        "supplies": [
            "Toilet Paper Rolls",
            "Construction Paper",
            "Googly Eyes"
        ]
    },
    {
        "id": "24",
        "name": "Toilet Paper Butterfly",
        "image": "toilet-paper-butterfly.jpg",
        "description": "Such a sweat little flyer",
        "supplies": [
            "Toilet Paper Rolls",
            "Construction Paper",
            "Googly Eyes",
            "Buttons"
        ]
    },
    {
        "id": "25",
        "name": "Valentines Jar",
        "image": "valentines-jar.webp",
        "description": "So much hearts all in one",
        "supplies": [
            "Clay",
            "Glitter"
        ]
    }];

    //Fetch all the crafts in Mongo and add them to the Array
    Craft.find({}) // Use find() without a callback
    .then(documents => {
        // Iterate over the array of documents
        documents.forEach(doc => {
            // Push each document into the 'crafts' array
            crafts.push({
                id: doc.id,
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



app.listen(10000, () => {
    console.log("Listening on port 10000");
});


