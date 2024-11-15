function showform(dowhat) {
	/*
	* four DIVS: browse, insert, update, delete
	* this function sets one visible the others not
	*/
	if (dowhat == 'insert') {
		document.getElementById('browse').style.display = 'none';
		document.getElementById('insert').style.display = 'block';
		document.getElementById('update').style.display = 'none';
		document.getElementById('delete').style.display = 'none';
	}
	else if (dowhat == 'update') {
		document.getElementById('browse').style.display = 'none';
		document.getElementById('insert').style.display = 'none';
		document.getElementById('update').style.display = 'block';
		document.getElementById('delete').style.display = 'none';
	}
	else if (dowhat == 'delete') {
		document.getElementById('browse').style.display = 'none';
		document.getElementById('insert').style.display = 'none';
		document.getElementById('update').style.display = 'none';
		document.getElementById('delete').style.display = 'block';
	}
else if (dowhat == 'all') {
		document.getElementById('browse').style.display = 'block';
		document.getElementById('insert').style.display = 'block';
		document.getElementById('update').style.display = 'block';
		document.getElementById('delete').style.display = 'block';
	}
	else { //by default display browse
		document.getElementById('browse').style.display = 'block';
		document.getElementById('insert').style.display = 'none';
		document.getElementById('update').style.display = 'none';
		document.getElementById('delete').style.display = 'none';
	}
}

//display the section of insert and hide other sections
function newItem() { showform('insert'); }

//display the section of update and hide other sections. FOR Machine
function showMachineUpdate(machineName,machineEnergy,machineID) {
	showform('update'); 
	document.getElementById("input-machinename-update").value = machineName;
	document.getElementById("input-energy-update").value = machineEnergy;
	document.getElementById("updateMachineId").value = machineID;
}

//display the section of update and hide other sections. FOR Parts
function showPartUpdate(partName,partId) {
	showform('update');
	document.getElementById("input-Part-update").value = partName;
	document.getElementById("updatePartId").value = partId;
}

//display the section of update and hide other sections. FOR PartsRecipes
function showPartsRecipesupdate(itemID,flowRate) {
    showform('update');
    document.getElementById("updatePRecipeId").value = itemID;
    document.getElementById("update-rate").value = flowRate;
}

//display the section of update and hide other sections. FOR Recipes
function showRecipeUpdate(alterRecip,recipeRate,recipeID) {
    showform('update');
    document.getElementById("updateRecipeId").value = recipeID;
    document.getElementById("update-Alternate").value = alterRecip;
    document.getElementById("update-Production").value = recipeRate;
}

//display the section of delete and hide other sections
function showDelete(itemName,itemID) {
	showform ('delete');
	document.getElementById("deleteItemId").value = itemID;
	document.getElementById("deleteItemName").value = itemName;
}

//display the section of delete and hide other sections
function showDeletePR(itemID) {
	showform ('delete');
	document.getElementById("deleteItemId").value = itemID;
}

function deleteM() {
	mId = document.getElementById("deleteItemId").value;
	deleteMachine(mId);
}

function deleteP() {
	pId = document.getElementById("deleteItemId").value;
	deletePart(pId);
}

function deleteR() {
	rId = document.getElementById("deleteItemId").value;
	deleteRecipe(rId);
}

function deletePR() {
	prId = document.getElementById("deleteItemId").value;
	deletePR(prId);
}
function showAll() { showform ('all'); }

//display the table for current webpage
function browsePeople() { showform ('browse'); }
