let addRecipeForm = document.getElementById('addRecipe-ajax');
// Modify the objects we need
addRecipeForm.addEventListener("submit", function (e) {    
    // Prevent the form from submitting
    e.preventDefault();
    // Get form fields we need to get data from
    let partProduced = document.getElementById("input-PartProduced-ajax").value;
    let alternateRecipe = document.getElementById("AlternateRecipe"); 
    let productionRate = document.getElementById("ProductionRate");
    let machine = document.getElementById("input-Machine-ajax").value;
    if (partProduced == null || alternateRecipe == null || productionRate == null || machine == null)
    {
        // NEED adding empty input prompt
        return;
    }
    
    // Put our data we want to send in a javascript object
    let data = {        
        partP: partProduced,
        alternateR: alternateRecipe.value,
        productionR: productionRate.value,
        machineID: machine,
    }    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/addRecipe-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addRowToTable(xhttp.response);
            // Clear the input fields for another transaction        
            partProduced = "";
            alternateRecipe = "";
            productionRate = "";
            machine = "";
        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
})

// Creates a single row from an Object representing a single record from 
// bsg_people
addRowToTable = (data) => {

    // Get a reference to the current table on the page and clear it out.
    let currentTable = document.getElementById("recipeTable");
    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;
    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]
    // Create a row and 4 cells
    let row = document.createElement("TR");
    let partProducedCell = document.createElement("TD");
    let alternateRecipeCell = document.createElement("TD");
    let productionRateCell = document.createElement("TD");
    let machineCell = document.createElement("TD");
    
    //here adding the columns

    // Fill the cells with correct data
    partProducedCell.innerText = newRow.id;
    alternateRecipeCell.innerText = newRow.fname;
    productionRateCell.innerText = newRow.id;
    machineCell.innerText = newRow.fname;
    // Add the cells to the row 
    row.appendChild(partProducedCell);
    row.appendChild(alternateRecipeCell); 
    row.appendChild(productionRateCell);
    row.appendChild(machineCell);
    //here adding the columns
    // Add the row to the table
    currentTable.appendChild(row);
}