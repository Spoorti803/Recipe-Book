document.addEventListener('DOMContentLoaded', () => {
    const recipeForm = document.getElementById('recipe-form');
    const recipeList = document.getElementById('recipe-list');
    const searchInput = document.getElementById('search');
    
    let recipes = JSON.parse(localStorage.getItem('recipes')) || [];
    let editingIndex = -1; // Index of the recipe currently being edited
  
    const renderRecipes = (recipesToRender) => {
      recipeList.innerHTML = '';
      recipesToRender.forEach((recipe, index) => {
        const recipeItem = document.createElement('div');
        recipeItem.className = 'recipe-item';
  
        const recipeImg = document.createElement('img');
        recipeImg.src = recipe.photo;
        recipeItem.appendChild(recipeImg);
  
        const recipeName = document.createElement('h3');
        recipeName.textContent = recipe.name;
        recipeItem.appendChild(recipeName);
  
        const viewRecipeButton = document.createElement('button');
        viewRecipeButton.textContent = 'View Recipe';
        viewRecipeButton.className = 'view-recipe-button';
        
        viewRecipeButton.addEventListener('click', () => {
          const details = recipeItem.querySelector('.recipe-details');
          details.style.display = details.style.display === 'none' || details.style.display === '' ? 'block' : 'none';
        });
       
        recipeItem.appendChild(viewRecipeButton);
  
        const recipeDetails = document.createElement('div');
        recipeDetails.className = 'recipe-details';
  
        const ingredientsList = document.createElement('p');
        ingredientsList.textContent = `Ingredients:`;
        const ingredientsUl = document.createElement('ul');
       
        recipe.ingredients.split('\n').forEach(ingredient => {
          const listItem = document.createElement('li');
          listItem.textContent = ingredient;
          ingredientsUl.appendChild(listItem);
        });
        
        recipeDetails.appendChild(ingredientsList);
        recipeDetails.appendChild(ingredientsUl);
  
        const instructionsList = document.createElement('p');
        instructionsList.textContent = `Instructions:`;
        const instructionsUl = document.createElement('ul');
        
        recipe.instructions.split('\n').forEach(instruction => {
          const listItem = document.createElement('li');
          listItem.textContent = instruction;
          instructionsUl.appendChild(listItem);
        });
       
        recipeDetails.appendChild(instructionsList);
        recipeDetails.appendChild(instructionsUl);
        recipeItem.appendChild(recipeDetails);
  
        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.className = 'edit-button';
       
        editButton.addEventListener('click', () => {
          populateFormForEditing(index);
        });
        recipeItem.appendChild(editButton);
  
        recipeList.appendChild(recipeItem);
      });
    };
  
    const saveRecipesToLocalStorage = () => {
      localStorage.setItem('recipes', JSON.stringify(recipes));
    };
  
    const handleFormSubmit = (e) => {
      e.preventDefault();
  
      const name = document.getElementById('recipe-name').value;
      const ingredients = document.getElementById('ingredients').value;
      const instructions = document.getElementById('instructions').value;
      const photoFile = document.getElementById('recipe-photo').files[0];
  
      const reader = new FileReader();
      reader.onload = () => {
        const photo = reader.result;
        if (editingIndex === -1) {
          const newRecipe = { name, ingredients, instructions, photo };
          recipes.push(newRecipe);
        } else {
          recipes[editingIndex] = { name, ingredients, instructions, photo };
        }
        
        saveRecipesToLocalStorage();
        renderRecipes(recipes);
        recipeForm.reset();
        editingIndex = -1;
        document.querySelector('button[type="submit"]').textContent = 'Save Recipe';
      };
  
      if (photoFile) {
        reader.readAsDataURL(photoFile);
      } else {
        if (editingIndex !== -1) {
          const currentRecipe = recipes[editingIndex];
          const updatedRecipe = { name, ingredients, instructions, photo: currentRecipe.photo };
          recipes[editingIndex] = updatedRecipe;
          saveRecipesToLocalStorage();
          renderRecipes(recipes);
          recipeForm.reset();
          editingIndex = -1;
          document.querySelector('button[type="submit"]').textContent = 'Save Recipe';
        }
      }
    };
  
    const populateFormForEditing = (index) => {
      const recipe = recipes[index];
      document.getElementById('recipe-name').value = recipe.name;
      document.getElementById('ingredients').value = recipe.ingredients;
      document.getElementById('instructions').value = recipe.instructions;
      editingIndex = index;
      document.querySelector('button[type="submit"]').textContent = 'Update Recipe';
    };
  
    searchInput.addEventListener('input', () => {
      const searchQuery = searchInput.value.toLowerCase();
      const filteredRecipes = recipes.filter(recipe =>
        recipe.name.toLowerCase().includes(searchQuery) ||
        recipe.ingredients.toLowerCase().includes(searchQuery)
      );
      renderRecipes(filteredRecipes);
    });
  
    recipeForm.addEventListener('submit', handleFormSubmit);
  
    renderRecipes(recipes);
  });
  