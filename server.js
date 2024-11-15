/*
    SETUP
*/

// Express
var express = require('express');
var app = express();

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.set("port", 58472);

// Database
var mysql = require("./database/db.js");

// Handlebars
var exphbs = require('express-handlebars');
const { engine } = require('express-handlebars');
app.engine('.hbs', exphbs.engine({extname: ".hbs"}));
app.set('view engine', '.hbs');

// Static Files
app.use(express.static('public'));

function createMachineTable() {
    var createString =
    "CREATE OR REPLACE TABLE Machines (" +
    "MachineID INT AUTO_INCREMENT unique NOT NULL," +
    "MachineName varchar(45) NOT NULL," +
    "Energy decimal(10,2) NOT NULL," +
    "PRIMARY KEY (MachineID));"
    mysql.pool.query(createString, function () {});
}

function createPartTable() {
    var createString =
    "CREATE OR REPLACE TABLE Parts (" +
    "PartID int AUTO_INCREMENT  NOT NULL," +
    "PartName varchar(45)," +
    "PRIMARY KEY (PartID));"
    mysql.pool.query(createString, function () {});
}

function createPartsRecipeTable() {
    var createString =
    "CREATE OR REPLACE TABLE PartsRecipes (" +
    "PartsRecipeID INT AUTO_INCREMENT unique NOT NULL," +
    "RecipeID int(11) NOT NULL," +
    "PartInputID int(11)," +
    "PartConsumptionRate decimal(10,2) NOT NULL," +
    "FOREIGN KEY (RecipeID)" +
    "REFERENCES Recipes (RecipeID)" +
    "   ON UPDATE CASCADE" +
    "	ON DELETE CASCADE," +
    "FOREIGN KEY (PartInputID)" +
    "REFERENCES Parts (PartID)" +
    "	ON UPDATE CASCADE" +
    "	ON DELETE CASCADE," +
    "PRIMARY KEY (PartsRecipeID));" +
    mysql.pool.query(createString, function () {});
}

function createRecipeTable() {
    var createString =
        "CREATE OR REPLACE TABLE Recipes (" +
        "RecipeID int AUTO_INCREMENT  NOT NULL," +
        "PartsProducedID int NOT NULL," +
        "AlternateRecipe varchar(255) NOT NULL" +
        "PartProductionRate decimal(10,2) NOT NULL," +
        "MachineID int NOT NULL," +
        "FOREIGN KEY (PartsProducedID)" +
        "REFERENCES Parts (PartID)" +
        "	ON UPDATE CASCADE" +
        "	ON DELETE CASCADE," +
        "FOREIGN KEY (MachineID)" +
        "REFERENCES Machines (MachineID)" +
        "	ON UPDATE CASCADE" +
        "	ON DELETE CASCADE," +
        "PRIMARY KEY (RecipeID));"
    mysql.pool.query(createString, function () {});
}


/*
    ROUTES
*/

// GET main page ROUTES(machine page)
app.get("/", function (req, res) {
    mysql.pool.query(query1, function (err, rows, result) {
        if (err) {
            if (err.code === 'ER_NO_SUCH_TABLE') {
                mysql.pool.query("DROP TABLE IF EXISTS Machines", function () {
                    createMachineTable();
                });
            } else { console.log(err) }
        }
        res.render('machines', {data: rows});
    })});

/***************************************************************
 * 
 * 1. Machine
 * 
 * *************************************************************/
// select from Machines
let query1 = "SELECT MachineID, MachineName AS Machine, Energy AS 'Engergy(MW)' FROM Machines";

// machine page route.
app.get("/machines", function (req, res) {
    mysql.pool.query(query1, function (err, rows, result) {
        if (err) {
            if (err.code === 'ER_NO_SUCH_TABLE') {
                mysql.pool.query("DROP TABLE IF EXISTS Machines", function () {
                    createMachineTable();
                });
            } else { console.log(err) }
        }
        res.render('machines', {data: rows});
    })});

// add item to Machine table
app.post('/addMachine-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;
    let query = `INSERT INTO Machines (MachineName, Energy) VALUES (?, ?)`;

    // Create the query and run it on the database
    mysql.pool.query(query, [data.machineName,parseFloat(data.Energy)], function(error, rows, fields){
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT on Machine
            mysql.pool.query(query1, function(error, rows, fields){
                // If there was an error on the second query, send a 400
                if (error) {                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else { res.send(rows); }
            })}})});

// update item to Machine table
app.put('/updateMachine-ajax', function(req,res,next){
    let data = req.body;
  
    let energy = parseFloat(data.energy);
    let machineId = parseInt(data.mId);
  
    let queryUpdate = `UPDATE Machines SET MachineName = ?, Energy = ? WHERE MachineID = ?`;
    // Run the 1st query
    mysql.pool.query(queryUpdate, [data.machine, energy, machineId], function(error, rows, fields){
        if (error) {            
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else
        {
            // Run the second query
            mysql.pool.query(query1, [machineId], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }})}})});

// delete item from Machine table
app.delete('/deleteMachine-ajax', function(req,res,next){
    let data = req.body;
    //let machineID = ;
    let query = `DELETE FROM Machines WHERE machineID = ?`;
    
    // Run the query
    mysql.pool.query(query, [parseInt(data.mId)], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else { res.sendStatus(204); }
    })});


/***************************************************************
 * 
 * 2. Parts
 * 
 * *************************************************************/
// select from Parts
let query2 = "SELECT PartID, PartName AS Part FROM Parts"

// part page route.
app.get("/items", function (req, res) {
    mysql.pool.query(query2, function (err, rows, result) {
        if (err) {
            if (err.code === 'ER_NO_SUCH_TABLE') {
                mysql.pool.query("DROP TABLE IF EXISTS Parts", function () {
                    createPartTable();
                });
            } else { console.log(err) }
        }
        res.render('parts', {data: rows});
    })});

// add item to Parts table
app.post('/addPart-ajax', function(req, res) 
{
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;  
    // Create the query and run it on the database
    let query = `INSERT INTO Parts (PartName) VALUES ('${data.partName}')`;

    mysql.pool.query(query, function(error, rows, fields){
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT on Parts
            mysql.pool.query(query2, function(error, rows, fields){
                // If there was an error on the second query, send a 400
                if (error) { 
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else { res.send(rows); }
              })}})});

// update item to Parts table
app.put('/updatePart-ajax', function(req,res,next){
    let data = req.body;
  
    let queryUpdate = `UPDATE Parts SET PartName = ? WHERE PartID = ?`;
    let select = `SELECT * FROM Parts WHERE PartID = ?`;
    // Run the 1st query
    mysql.pool.query(queryUpdate, [data.part, parseInt(data.pId)], function(error, rows, fields){
        if (error) {            
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else
        {
            // Run the second query
            mysql.pool.query(select, [parseInt(data.pId)], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }})}})});

// delete item from Parts table
app.delete('/deletePart-ajax', function(req,res,next){
    let data = req.body;

    let query = `DELETE FROM Parts WHERE PartID = ?`;    
    // Run the query
    mysql.pool.query(query, [parseInt(data.pId)], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else { res.sendStatus(204); }
    })});

/***************************************************************
 * 
 * PartsRecipes
 * 
 * *************************************************************/
// select from PartsRecipes
let query3 = `SELECT PartsRecipes.PartsRecipeID, Parts.PartName AS 'Part Produced', Recipes.PartProductionRate AS "Production Rate", Recipes.AlternateRecipe AS "Alternate Recipe", Machines.MachineName AS "Machine", PartsRecipes.PartConsumptionRate AS "Part Consumption Rate", InputPart.PartName AS "Input Part" FROM PartsRecipes JOIN Recipes ON PartsRecipes.RecipeID = Recipes.RecipeID JOIN Parts ON Parts.PartID = Recipes.PartsProducedID JOIN Machines ON Machines.MachineID = Recipes.MachineID JOIN Parts AS InputPart ON InputPart.PartID = PartsRecipes.PartInputID`;
let query3_2 = `SELECT Recipes.RecipeID, Parts.PartName FROM Recipes JOIN Parts ON Parts.PartID = Recipes.PartsProducedID`
let query3_3 = `SELECT Parts.PartID, Parts.PartName From Parts`
//partsRecipe page route.
app.get("/partsrecipes", function (req, res) {
    mysql.pool.query(query3, function (err, rows, result) {
        let PRcepes = rows        
        if (err) {
            if (err.code === 'ER_NO_SUCH_TABLE') {
                mysql.pool.query("DROP TABLE IF EXISTS workouts", function () {
                    createPartsRecipeTable();
                });
            } else { console.log(err) }
        }
        mysql.pool.query(query3_2, (error, rows, fields) => {            
            let recipes = rows;
            if (err) {
                if (err.code === 'ER_NO_SUCH_TABLE') {
                    mysql.pool.query("DROP TABLE IF EXISTS Recipes", function () {
                        createRecipeTable();
                    });
                } else {
                    console.log(err)
                };
            }            
            mysql.pool.query(query3_3, (error, rows, fields) => {            
                let parts = rows;
                if (err) {
                    if (err.code === 'ER_NO_SUCH_TABLE') {
                        mysql.pool.query("DROP TABLE IF EXISTS Recipes", function () {
                            createPartTable();
                        });
                    } else {
                        console.log(err)
                    };
                }
                return res.render('partsrecipes', {data: PRcepes, recipes: recipes, parts: parts});
            })
        })
    })});

// add item to PartsRecipes table
app.post('/addPR-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;  
    // Create the query and run it on the database
    let query = `INSERT INTO PartsRecipes (RecipeID,PartInputID,PartConsumptionRate) VALUES ((SELECT Recipes.RecipeID FROM Recipes WHERE Recipes.RecipeID = ?), (SELECT Parts.PartID FROM Parts WHERE Parts.PartID = ?), ?)`;
    mysql.pool.query(query, [parseInt(data.PRecipeID),parseInt(data.input),parseInt(data.rate)], function(error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT on Parts
            mysql.pool.query(query4, function(error, rows, fields){
                // If there was an error on the second query, send a 400
                if (error) {                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else { res.send(rows); }})}})});

// update item to PartsRecipes table
app.put('/updatePR-ajax', function(req,res,next) {;
    let data = req.body;
    let queryUpdate = `UPDATE PartsRecipes SET PartInputID = ?, PartConsumptionRate = ? WHERE PartsRecipeID = ?`;
    let select = `SELECT * FROM PartsRecipes WHERE PartsRecipeID = ?`;
    // Run the 1st query
    mysql.pool.query(queryUpdate, [parseInt(data.input), parseFloat(data.rate), parseInt(data.PRecipeID)], function(error, rows, fields){
        if (error) {            
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else
        {
            // Run the second query
            mysql.pool.query(select, [parseInt(data.PRecipeID)], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }})}})});

// delete item from PartsRecipes table
app.delete('/deletePR-ajax', function(req,res,next){
    let data = req.body;
    let query = `DELETE FROM PartsRecipes WHERE PartsRecipeID = ?`;    
    // Run the query
    mysql.pool.query(query, [parseInt(data.prId)], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else { res.sendStatus(204); }
    })});

/***************************************************************
 * 
 * Recipes
 * 
 * *************************************************************/
// select from Recipes
let query4 = "SELECT RecipeID, Parts.PartName AS 'Part Produced', Recipes.AlternateRecipe, PartProductionRate AS 'Production Rate', Machines.MachineName FROM Recipes JOIN Parts ON Parts.PartID = Recipes.PartsProducedID JOIN Machines ON Machines.MachineID = Recipes.MachineID";
let query4_2 = "SELECT * FROM Parts;";
let query4_3 = "SELECT * FROM Machines;";
// recipe page route.
app.get('/recipes', function (req, res) {    
	mysql.pool.query(query4, function (err, rows, result) {
        let recipes = rows;
		if (err) {
			if (err.code === 'ER_NO_SUCH_TABLE') {
				mysql.pool.query("DROP TABLE IF EXISTS Recipes", function () {
                    createRecipeTable();
                });
            } else {
                console.log(err)
            };
        }
        mysql.pool.query(query4_2, (error, rows, fields) => {            
            let parts = rows;
            if (err) {
                if (err.code === 'ER_NO_SUCH_TABLE') {
                    mysql.pool.query("DROP TABLE IF EXISTS Recipes", function () {
                        createPartTable();
                    });
                } else {
                    console.log(err)
                };
            }            
            mysql.pool.query(query4_3, (error, rows, fields) => {            
                let machines = rows;
                if (err) {
                    if (err.code === 'ER_NO_SUCH_TABLE') {
                        mysql.pool.query("DROP TABLE IF EXISTS Recipes", function () {
                            createMachineTable();
                        });
                    } else {
                        console.log(err)
                    };
                }
                return res.render('recipes', {data: recipes, parts: parts, machines: machines});
            })
        })
        
        //res.render('recipes', {data: rows});
    })});

// add item to Recipe table
app.post('/addRecipe-ajax', function(req, res) {
    // Capture the incoming data and parse it back to a JS object
    let data = req.body;  
    // Create the query and run it on the database
    let query = `INSERT INTO Recipes (PartsProducedID,AlternateRecipe,PartProductionRate,MachineID) VALUES ( (SELECT PartID FROM Parts WHERE PartID = ?), ?, ?, (SELECT MachineID FROM Machines WHERE MachineID = ?))`;
    mysql.pool.query(query, [parseInt(data.partP),data.alternateR,parseFloat(data.productionR),parseInt(data.machineID)], function(error, rows, fields) {
        // Check to see if there was an error
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error)
            res.sendStatus(400);
        }
        else
        {
            // If there was no error, perform a SELECT on Parts
            mysql.pool.query(query4, function(error, rows, fields){
                // If there was an error on the second query, send a 400
                if (error) {                    
                    // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
                    console.log(error);
                    res.sendStatus(400);
                }
                // If all went well, send the results of the query back.
                else { res.send(rows); }})}})});

// update item to Recipes table
app.put('/updateRecipe-ajax', function(req,res,next) {;
    let data = req.body;
    let queryUpdate = `UPDATE Recipes SET PartsProducedID = (SELECT Parts.PartID FROM Parts WHERE PartID = ?), AlternateRecipe = ?, PartProductionRate = ?, MachineID = (SELECT Machines.MachineID FROM Machines WHERE MachineID = ?) WHERE RecipeID = ?`;
    let select = `SELECT * FROM Recipes WHERE RecipeID = ?`;
    // Run the 1st query
    mysql.pool.query(queryUpdate, [parseInt(data.recipe), data.Alternate, parseFloat(data.Production), parseInt(data.Machine), parseInt(data.rId)], function(error, rows, fields){
        if (error) {            
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        // If there was no error, we run our second query and return that data so we can use it to update the people's
        // table on the front-end
        else
        {
            // Run the second query
            mysql.pool.query(select, [parseInt(data.rId)], function(error, rows, fields) {
                if (error) {
                    console.log(error);
                    res.sendStatus(400);
                } else {
                    res.send(rows);
                }})}})});

// delete item from recipe table
app.delete('/deleteRecipe-ajax', function(req,res,next){
    let data = req.body;
    let query = `DELETE FROM Recipes WHERE RecipeID = ?`;    
    // Run the query
    mysql.pool.query(query, [parseInt(data.rId)], function(error, rows, fields){
        if (error) {
            // Log the error to the terminal so we know what went wrong, and send the visitor an HTTP response 400 indicating it was a bad request.
            console.log(error);
            res.sendStatus(400);
        }
        else { res.sendStatus(204); }
    })});


app.listen(app.get('port'), function () {
    console.log('Express started on local:' + app.get('port') + '; press Ctrl-C to terminate.');});

