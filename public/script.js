class Craft {
    constructor(id, name, image, description, supplies) {
        this.id = id;
        this.name = name;
        this.image = "images/" + image;
        this.description = description;
        this.supplies = supplies;
    }

    static async fetch(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const craftData = await response.json();
            const craft = craftData.map(craftData => {
                const { id, name, image, description, supplies } = craftData;
                return new Craft(id, name, image, description, supplies);
            });
            return craft;
        } catch (error) {
            console.error('Error fetching data:', error);
            return [];
        }
    }

    get renderCraft() {
        /* Make the main section to hold all the craft info      
           The craft cards are just the image for the craft project, but when clicked on
           they will open a modal lightbox with details about the craft project.
        */
        const craftProject = document.createElement("section");
        craftProject.classList.add("craft-card"); // Flex container for top portion
        const target = "modal-" + this.id;

        // Make the photo of the craft - to the right and is 300px
        const craftPhoto = document.createElement("img");
        craftPhoto.src = this.image;
        craftPhoto.classList.add("photo-craft");
        craftProject.onclick = () => { modalOpen(target); };
        craftProject.appendChild(craftPhoto);

        return craftProject;
    }

    
    get expandedSection() {
        const craftDetailCard = document.createElement("section");
        const target = "modal-" + this.id
        craftDetailCard.classList.add("w3-modal");
        craftDetailCard.id = target;

        /* Add the main div which will contain the modal */
        const infoDiv = document.createElement("div");
        infoDiv.classList.add("w3-modal-content");
        infoDiv.classList.add("expanded-info");

        /* Add the next div which will contain the Content of the modal */
        const contentDiv = document.createElement("div");
        // contentDiv.classList.add("w3-container");

        /* Add Close Button for Modal */
        const closeButton = document.createElement("span");
        closeButton.classList.add("w3-button");
        closeButton.classList.add("w3-display-topright");
        closeButton.classList.add("close-button");
        closeButton.onclick = () => { modalClose(target); };
        closeButton.innerHTML = "&times;";

        /* Put close button into the container for the expanded info card */
        contentDiv.appendChild(closeButton);

        /* Create an image element for the craft project */
        const craftPhoto = document.createElement("img");
        craftPhoto.src = this.image;
        craftPhoto.classList.add("craft-photo-small");

        /* Create header for the title */
        const heading = document.createElement("h2");
        heading.classList.add("craft-details-header");
        heading.innerText = this.name;

        const dLink = document.createElement("a");
        dLink.innerHTML = "	&#9249;";
        craftDetails.append(dLink);
        dLink.id = "delete-link";

        /* Create the text div and elements */
        const craftDetails = document.createElement("p");
        let craftText = "";
        craftText += "<p>" + this.description + "</p>";
        craftText += "<p><h3>Supplies Needed</h3></p>";
        craftText += "<ul>";
        this.supplies.forEach((craftSupply) => {
            craftText += "<li>" + toTitleCase(craftSupply) + "</li>";
        });
        craftText += "</li>";

        craftDetails.innerHTML = craftText;

        /* Create div to contain the expanded text and image */
        const infoCard = document.createElement("div");
        infoCard.classList.add("craft-details");
        infoCard.appendChild(heading);
        infoCard.appendChild(craftDetails);

        /* Put InfoCard into the modal content under the close button */
        contentDiv.appendChild(infoCard);

        /* Add the inside stuff to the modal dialog */
        infoDiv.appendChild(craftPhoto);
        infoDiv.appendChild(contentDiv);
        craftDetailCard.appendChild(infoDiv);

        return craftDetailCard;
    }
}

const modalOpen = (theName) => {
    document.getElementById(theName).style.display = "block";
}

const modalClose = (theName) => {
    const theForm = document.getElementById("add-crafts-form");
    theForm.reset();
    document.getElementById("img-prev").src = "";
    document.getElementById(theName).style.display = "none";
}

const loadCraft = async () => {
    const url = "https://csce242-assignment17-iox5.onrender.com/api/crafts";
    try {
        const craft = await Craft.fetch(url);
        return await craft;
    } catch (error) {
        console.log(error);
    }
}

// It bugs me when the JSON has lowercase to start the supply names, so this fixes it
const toTitleCase = str => {
    return str.replace(/\w\S*/g, txt => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

//If the input for supplies is not empty, then add a new text input to the form and drop the button
const addSupplies = () => {
    const theForm = document.getElementById("add-crafts-form");
    const suppliesTable = document.getElementById("supplies-section");
    const currentSupplies = suppliesTable.querySelectorAll("input.short-input");
    const lastRow = document.getElementById("add-supplies");
    let supplyCount = currentSupplies.length;
    if (currentSupplies[supplyCount - 1].value !== "") {
        const newRow = document.createElement("tr");
        let newSupplyData = "<td class='right'>&nbsp;</td>";
        newSupplyData += "<td class='left'>";
        newSupplyData += "<input class='short-input' type='text' id='supplies-" + supplyCount + "' name='supplies-" + supplyCount + "' ";
        newSupplyData += " value='" + currentSupplies[supplyCount - 1].value + "' required /></td></tr>";
        newRow.innerHTML = newSupplyData;
        // Check if lastRow is a direct child of suppliesTable
        if (lastRow.parentNode === suppliesTable.querySelector("tbody")) {
            suppliesTable.querySelector("tbody").insertBefore(newRow, lastRow);
            document.getElementById("supplies-0").value = "";
        } else {
            console.error("Error: lastRow is not a direct child of suppliesTable.");
        }
    }
}

const initGallery = async () => {
    const fileInput = document.getElementById('file-button');
    const imgPrev = document.getElementById('img-prev');
    let craftArray = await loadCraft();
    let photoGallery = document.getElementById("craft-section");
    const theTable = document.getElementById('supplies-section');

    let tableHTML = '<thead></thead><tbody><tr id="add-supplies"><td class="right">Supplies</td>';
    tableHTML += '<td class="left"><input class="short-input" type="text" id="supplies-0" name="supplies-0" required />';
    tableHTML += '<button id="add-supply" type="button">Add Supply</button></td></tr></tbody>';

    theTable.innerHTML = tableHTML;
    
    if (craftArray !== undefined && craftArray.length > 0) {
        craftArray.forEach((aCraft) => {
            photoGallery.append(aCraft.renderCraft);
            photoGallery.append(aCraft.expandedSection);
        })
    }
    document.getElementById("icon-add").onclick = () => { modalOpen("add-craft"); };
    document.getElementById("add-craft-cancel").onclick = () => { modalClose("add-craft"); };
    document.getElementById("add-supply").onclick = () => { addSupplies(); };
    document.getElementById("icon-pencil").onclick = () => { editCraft("&#9999"); };
    document.getElementById("icon-delete").onclick = () => { deleteCraft("&#10005"); };
    document.getElementById("add-crafts-form").reset();
    dLink.onclick = deleteCraft.bind(this, craft);
    document.getElementById("img-prev").src = "";

    fileInput.addEventListener('change', function () {
        const file = this.files[0]; // Get the selected file
        if (file) {
            const reader = new FileReader(); // Create a new FileReader object
            reader.onload = function (e) {
                imgPrev.src = e.target.result; // Set the image source to the uploaded file's data URL
            }
            reader.readAsDataURL(file); // Read the uploaded file as a data URL            
        } else {
            imgPrev.src = '#'; // Reset the image source if no file is selected
        }
    });
}

const addEditCraft = async (e) => {
    e.preventDefault();
    const form = document.getElementById("add-crafts-form");
    const formData = new FormData(form);
    formData.append("supplies", getSupplies());
    for (let i = 0; i < getSupplies().length; i++) {
        formData.delete("supplies-" + i);
    }
    let response;

    console.log("in post");
    response = await fetch("/api/crafts", {
        method: "POST",
        body: formData,
    });
    console.log(response);
    modalClose("add-craft");
    document.getElementById("craft-section").innerHTML = "";
    initGallery();
}

const deleteCraft = async(craft)=> {
    let response = await fetch(`/api/crafts/${craft._id}`, {
      method:"DELETE",
      headers:{
        "Content-Type":"application/json;charset=utf-8"
      }
    });
  
    if(response.status != 200){
      console.log("Error deleting");
      return;
    }
  
    let result = await response.json();
    resetForm();
    showRecipes();
    document.getElementById("dialog").style.display = "none";
  };

const getSupplies = () => {
    const inputs = document.querySelectorAll("#supplies-section input");
    const supplies = [];
    inputs.forEach((input) => {
        supplies.push(input.value);
    });

    return supplies;
}

window.onload = () => {
    initGallery();

    if (document.getElementById("add-crafts-form") != null) {
        document.getElementById("add-crafts-form").addEventListener("submit", async function (event) {
            event.preventDefault(); // Prevent default form submission
        });
        document.getElementById("add-crafts-form").onsubmit = addEditCraft;
    }
}
