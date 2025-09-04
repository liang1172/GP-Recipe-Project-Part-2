/**ingredient-page.js
 * This script defines the add, view, and delete operations for Ingredient objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

/* 
 * TODO: Get references to various DOM elements
 * - addIngredientNameInput
 * - deleteIngredientNameInput
 * - ingredientListContainer
 * - searchInput (optional for future use)
 * - adminLink (if visible conditionally)
 */
let addIngredientName = document.getElementById("add-ingredient-name-input");
let addIngredientButton = document.getElementById("add-ingredient-submit-button");
let deleteIngredientName = document.getElementById("delete-ingredient-name-input");
let deleteIngredientButton = document.getElementById("delete-ingredient-submit-button");
let ingredientList = document.getElementById("ingredient-list");
let adminLink = document.getElementById("back-link");
/* 
 * TODO: Attach 'onclick' events to:
 * - "add-ingredient-submit-button" → addIngredient()
 * - "delete-ingredient-submit-button" → deleteIngredient()
 */
addIngredientButton.onclick = addIngredient;
deleteIngredientButton.onclick = deleteIngredient;
/*
 * TODO: Create an array to keep track of ingredients
 */
let ingredients = [];
/* 
 * TODO: On page load, call getIngredients()
 */
getIngredients();

/**
 * TODO: Add Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from addIngredientNameInput
 * - Validate input is not empty
 * - Send POST request to /ingredients
 * - Include Authorization token from sessionStorage
 * - On success: clear input, call getIngredients() and refreshIngredientList()
 * - On failure: alert the user
 */
async function addIngredient() {
    // Implement add ingredient logic here
    let name = addIngredientName.value.trim();
    if (!name) {
        alert("Name is required");
        return;
    }
    try {
        const response = await fetch(`${BASE_URL}/ingredients`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            },
            body: JSON.stringify({name})
        });
        if (response.ok) {
            addIngredient.value = "";
            await getIngredients();
        } else {
            alert("Failed to add ingredient");
        } 
    } catch (error) {
        console.error("Error during adding ingredient:", error);
    }
}


/**
 * TODO: Get Ingredients Function
 * 
 * Requirements:
 * - Fetch all ingredients from backend
 * - Store result in `ingredients` array
 * - Call refreshIngredientList() to display them
 * - On error: alert the user
 */
async function getIngredients() {
    // Implement get ingredients logic here
    try {
        const response = await fetch(`${BASE_URL}/ingredients`, {
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            }
        });
        if (response.ok) {
            ingredients = await response.json();
            refreshIngredientList();
        } else {
            alert("Failed to get all ingredients");
        }
    } catch (error) {
        console.error("Error fetching all ingredients");
    }
}


/**
 * TODO: Delete Ingredient Function
 * 
 * Requirements:
 * - Read and trim value from deleteIngredientNameInput
 * - Search ingredientListContainer's <li> elements for matching name
 * - Determine ID based on index (or other backend logic)
 * - Send DELETE request to /ingredients/{id}
 * - On success: call getIngredients() and refreshIngredientList(), clear input
 * - On failure or not found: alert the user
 */
async function deleteIngredient() {
    // Implement delete ingredient logic here
    let name = deleteIngredientName.value.trim();
    if (!name) {
        alert("Name is required");
        return;
    }
    let ingredient = ingredients.find(i =>i.name.toLowerCase() === name.toLowerCase());
    if (!ingredient) {
        alert("Ingredient not found");
        return;
    }
    try {
        const response = await fetch(`${BASE_URL}/ingredients/${ingredient.id}`, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
            }
        });
        if (response.ok) {
            deleteIngredientName.value = "";
            await getIngredients();
        } else {
            alert("Failed to delete ingredient");
        }
    } catch (error) {
        console.error("Error during deleting ingredient");
    }
}


/**
 * TODO: Refresh Ingredient List Function
 * 
 * Requirements:
 * - Clear ingredientListContainer
 * - Loop through `ingredients` array
 * - For each ingredient:
 *   - Create <li> and inner <p> with ingredient name
 *   - Append to container
 */
function refreshIngredientList() {
    // Implement ingredient list rendering logic here
    ingredientList.innerHTML = "";
    ingredients.forEach(i => {
        let li = document.createElement("li");
        let p = document.createElement("p");
        p.textContent = i.name;
        li.appendChild(p);
        ingredientList.appendChild(li);
    });
}
