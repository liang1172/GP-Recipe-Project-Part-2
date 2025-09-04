/**recipe-page.js
 * This script defines the CRUD operations for Recipe objects in the Recipe Management Application.
 */

const BASE_URL = "http://localhost:8081"; // backend URL

let recipes = [];

// Wait for DOM to fully load before accessing elements
window.addEventListener("DOMContentLoaded", () => {

    /* 
     * TODO: Get references to various DOM elements
     * - Recipe name and instructions fields (add, update, delete)
     * - Recipe list container
     * - Admin link and logout button
     * - Search input
    */
    let addName = document.getElementById("add-recipe-name-input");
    let addInstructions = document.getElementById("add-recipe-instructions-input");
    let addButton = document.getElementById("add-recipe-submit-input");
    let updateName = document.getElementById("update-recipe-name-input");
    let updateInstructions = document.getElementById("update-recipe-instructions-input");
    let updateButton = document.getElementById("update-recipe-submit-input");
    let deleteName = document.getElementById("delete-recipe-name-input");
    let deleteButton = document.getElementById("delete-recipe-submit-input");
    let recipeList = document.getElementById("recipe-list");
    let adminLink = document.getElementById("admin-link");
    let logoutButton = document.getElementById("logout-button");
    let searchInput = document.getElementById("search-input");
    let searchButton = document.getElementById("search-button");
    
    /*
     * TODO: Show logout button if auth-token exists in sessionStorage
     */
    if (sessionStorage.getItem("auth-token")) {
        logoutButton.style.display = "block";
    }
    /*
     * TODO: Show admin link if is-admin flag in sessionStorage is "true"
     */
    if (sessionStorage.getItem("is-admin") === "true") {
        adminLink.style.display = "block";
    }
    /*
     * TODO: Attach event handlers
     * - Add recipe button → addRecipe()
     * - Update recipe button → updateRecipe()
     * - Delete recipe button → deleteRecipe()
     * - Search button → searchRecipes()
     * - Logout button → processLogout()
     */
    addButton.onclick = addRecipe;
    updateButton.onclick = updateRecipe;
    deleteButton.onclick = deleteRecipe;
    searchButton.onclick = searchRecipes;
    logoutButton.onclick = processLogout;
    /*
     * TODO: On page load, call getRecipes() to populate the list
     */
    getRecipes();

    /**
     * TODO: Search Recipes Function
     * - Read search term from input field
     * - Send GET request with name query param
     * - Update the recipe list using refreshRecipeList()
     * - Handle fetch errors and alert user
     */
    async function searchRecipes() {
        // Implement search logic here
        let term = searchInput.value.trim();
        if (!term) {
            getRecipes();
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/recipes?name=${encodeURIComponent(term)}`, {
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                }
            });
            if (response.ok) {
                recipes = await response.json();
                refreshRecipeList();
            } else {
                alert("Failed to search recipe");
            }
        } catch (error) {
            console.error("Error during searching for recipes:", error);
        }
    }

    /**
     * TODO: Add Recipe Function
     * - Get values from add form inputs
     * - Validate both name and instructions
     * - Send POST request to /recipes
     * - Use Bearer token from sessionStorage
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function addRecipe() {
        // Implement add logic here
        let name = addName.value.trim();
        let instructions = addInstructions.value.trim();
        if (!name || !instructions) {
            alert("Name and Instructions required");
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/recipes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                },
                body: JSON.stringify({name, instructions})
            });
            if (response.ok) {
                addName.value = "";
                addInstructions.value = "";
                getRecipes();
            } else {
                alert("Failed to add recipe");
            }
        } catch (error) {
            console.error("Error during adding recipe:", error);
        }
    }

    /**
     * TODO: Update Recipe Function
     * - Get values from update form inputs
     * - Validate both name and updated instructions
     * - Fetch current recipes to locate the recipe by name
     * - Send PUT request to update it by ID
     * - On success: clear inputs, fetch latest recipes, refresh the list
     */
    async function updateRecipe() {
        // Implement update logic here
        let name = updateName.value.trim();
        let instructions = updateInstructions.value.trim();
        if (!name || !instructions) {
            alert("New Name and new Instructions required");
            return;
        }
        let recipe = recipes.find(r => r.name.toLowerCase() === name.toLowerCase());
        if (!recipe) {
            alert("Recipe not found");
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": 'application/json',
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                },
                body: JSON.stringify({name, instructions})
            });
            if (response.ok) {
                updateName.value = "";
                updateInstructions.value = "";
                getRecipes();
            } else {
                alert("Failed to update recipe");
            }
        } catch (error) {
            console.error("Error during updating recipe:", error);
        }
    }

    /**
     * TODO: Delete Recipe Function
     * - Get recipe name from delete input
     * - Find matching recipe in list to get its ID
     * - Send DELETE request using recipe ID
     * - On success: refresh the list
     */
    async function deleteRecipe() {
        // Implement delete logic here
        let name = deleteName.value.trim();
        if (!name) {
            alert("Enter a recipe name to delete that is in the recipe list.");
            return;
        }
        let recipe = recipes.find(r => r.name.toLowerCase() === name.toLowerCase());
        if (!recipe) {
            alert("Recipe not found");
            return;
        }
        try {
            const response = await fetch(`${BASE_URL}/recipes/${recipe.id}`, {
                method: "DELETE",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                }
            });
            if (response.ok) {
                deleteName.value = "";
                getRecipes();
            } else {
                alert("Failed to delete recipe");
            }
        } catch (error) {
            console.error("Error during deleting recipe:", error);
        }
    }

    /**
     * TODO: Get Recipes Function
     * - Fetch all recipes from backend
     * - Store in recipes array
     * - Call refreshRecipeList() to display
     */
    async function getRecipes() {
        // Implement get logic here
        try {
            const response = await fetch (`${BASE_URL}/recipes`, {
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                }
            });
            if (!response.ok) throw new Error("Failed to fetch recipes");

            recipes = await response.json();
            refreshRecipeList();
        } catch (error) {
            console.error("Error during fetching for recipes:", error);
        }
    }

    /**
     * TODO: Refresh Recipe List Function
     * - Clear current list in DOM
     * - Create <li> elements for each recipe with name + instructions
     * - Append to list container
     */
    function refreshRecipeList() {
        // Implement refresh logic here
        recipeList.innerHTML = "";
        recipes.forEach(r => {
            let li = document.createElement("li");
            li.textContent = `${r.name}: ${r.instructions}`;
            recipeList.appendChild(li);
        });
    }

    /**
     * TODO: Logout Function
     * - Send POST request to /logout
     * - Use Bearer token from sessionStorage
     * - On success: clear sessionStorage and redirect to login
     * - On failure: alert the user
     */
    async function processLogout() {
        // Implement logout logic here
        try {
            const response = await fetch(`${BASE_URL}/logout`, {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + sessionStorage.getItem("auth-token")
                }
            });
            if (response.ok) {
                sessionStorage.clear();
                window.location.href = "../login/login-page.html";
            } else {
                alert("Failed to logout");
            }
        } catch (error) {
            console.error("Error during logging out:", error);
        }
    }
});
