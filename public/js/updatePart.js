// Get the objects we need to modify
let updatePersonForm = document.getElementById('updatePart-ajax');

// Modify the objects we need
updatePersonForm.addEventListener("submit", function (e) {   
    // Prevent the form from submitting
    e.preventDefault();
    // Get form fields we need to get data from
    let inputpartname = document.getElementById("input-Part-update");
    let PartID = document.getElementById("updatePartId");
    // Get the values from the form fields
    let partValue = inputpartname.value;
    let partID = PartID.value;

    // currently the database table for bsg_people does not allow updating values to NULL
    // so we must abort if being bassed NULL for homeworld
    if (partValue == null || partID == null)
    {
        // NEED adding empty input prompt
        return;
    }

    // Put our data we want to send in a javascript object
    let data = {
        part: partValue,
        pId: partID,
    }
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("PUT", "/updatePart-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 200) {

            // Add the new data to the table
            updateRow(xhttp.response, partID);

        }
        else if (xhttp.readyState == 4 && xhttp.status != 200) {
            console.log("There was an error with the input.")
        }
    }

    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));

})


function updateRow(data, partID){
    let parsedData = JSON.parse(data);
    
    let table = document.getElementById("partTable");

    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == partID) {

            // Get the location of the row where we found the matching person ID
            let updateRowIndex = table.getElementsByTagName("tr")[i];

            // Get td of homeworld value
            let td = updateRowIndex.getElementsByTagName("td")[3];

            // Reassign homeworld to our value we updated to
            td.innerHTML = parsedData[0].name; 
       }
    }
}