let addPRecipeForm = document.getElementById('addPR-ajax');
// Modify the objects we need
addPRecipeForm.addEventListener("submit", function (e) {    
    // Prevent the form from submitting
    e.preventDefault();
    // Get form fields we need to get data from
    let inputRecipeID = document.getElementById("input-PR-recipe-ajax").value;
    let inputRate = document.getElementById("input-rate"); 
    let inputPart = document.getElementById("input-RP-part-ajax").value;
    if (inputRecipeID == null || inputRate.value == null || inputPart == null)
    {
        // NEED adding empty input prompt
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        PRecipeID: inputRecipeID,
        rate: inputRate.value,
        input: inputPart
    }    
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("POST", "/addPR-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            // Add the new data to the table
            addRowToTable(xhttp.response);
            // Clear the input fields for another transaction
            inputRate.value = '';
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
    let currentTable = document.getElementById("PRecipeTable");
    // Get the location where we should insert the new row (end of table)
    let newRowIndex = currentTable.rows.length;
    // Get a reference to the new row from the database query (last object)
    let parsedData = JSON.parse(data);
    let newRow = parsedData[parsedData.length - 1]
    // Create a row and 4 cells
    let row = document.createElement("TR");
    let productionRateCell = document.createElement("TD");
    let alternateRecipeCell = document.createElement("TD");
    let partProducedCell = document.createElement("TD");
    let machineCell = document.createElement("TD");
    let inputRateCell = document.createElement("TD");
    let inputRecipeIDCell = document.createElement("TD");
    // Fill the cells with correct data
    productionRateCell.innerText = newRow.id;
    alternateRecipeCell.innerText = newRow.fname;
    partProducedCell.innerText = newRow.fname;
    machineCell.innerText = newRow.fname;
    inputRateCell.innerText = newRow.fname;
    inputRecipeIDCell.innerText = newRow.fname;
    // Add the cells to the row 
    row.appendChild(productionRateCell);
    row.appendChild(alternateRecipeCell);   
    row.appendChild(partProducedCell);
    row.appendChild(machineCell); 
    row.appendChild(inputRateCell);
    row.appendChild(inputRecipeIDCell);  
    // Add the row to the table
    currentTable.appendChild(row);
}