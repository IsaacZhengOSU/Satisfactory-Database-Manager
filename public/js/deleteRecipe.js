function deleteRecipe(recipeId) {

    if (recipeId == null)
    {
        // NEED adding empty input prompt
        return;
    }
    
    
    // Put our data we want to send in a javascript object
    let data = { rId: recipeId };
    // Setup our AJAX request
    var xhttp = new XMLHttpRequest();
    xhttp.open("DELETE", "/deleteRecipe-ajax", true);
    xhttp.setRequestHeader("Content-type", "application/json");
    // Tell our AJAX request how to resolve
    xhttp.onreadystatechange = () => {
        if (xhttp.readyState == 4 && xhttp.status == 204) {
            // Add the new data to the table
            deleteRow(recipeId);
        }
        else if (xhttp.readyState == 4 && xhttp.status != 204) {
            console.log("There was an error with the input.")
        }
    }
    // Send the request and wait for the response
    xhttp.send(JSON.stringify(data));
}

function deleteRow(recipeId){
    let table = document.getElementById("recipeTable");
    for (let i = 0, row; row = table.rows[i]; i++) {
       //iterate through rows
       //rows would be accessed using the "row" variable assigned in the for loop
       if (table.rows[i].getAttribute("data-value") == recipeId) {
            table.deleteRow(i);
            break;
       }
    }
}