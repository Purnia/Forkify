// Global app controller

import Search from './models/Search';
import Recipe from './models/Recipe';
import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import { elements, renderLoader, clearLoader} from './views/base';


/** global state of the app
 * search object
 * current recipe object
 * shopping list object 
 * liked recipes
 */
const state = {};


// SEARCH CONTROLLER
const controlSearch = async () => {
    // 1) get query from the view
    const query = searchView.getInput();
    

    if(query) {
        // 2) New search object and add it to state
        state.search = new Search(query);

        // 3) prepare UI for results
            searchView.clearInput();
            searchView.clearResults();
            renderLoader(elements.searchRes);
        // 4) Search for recipes 

        try{
            
            await state.search.getResults(); //getResults is async so the res is a promise. so youll have to await 
            
            //5) render results on UI
            clearLoader();
            searchView.renderResults(state.search.result);
        } catch(err) {
            alert ('Error!')
            clearLoader();
        }
        
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();

});


elements.searchRes.addEventListener('click' , e => {
    const btn = e.target.closest('.btn-inline')
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults();
        searchView.renderResults(state.search.result, goToPage);
        
    }
});

//RECIPE CONTROLLER

const controlRecipe = async () => {

    //get id from url
    const id = window.location.hash.replace('#', '');
    console.log(id);

    if (id) {
        //prepare ui for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        // highlight selected search item
        if (state.search) searchView.highlightSelected(id);

        //create recipe object
        state.recipe = new Recipe(id);

        //get recipe data

        try{
            await state.recipe.getRecipe();
            state.recipe.parseIngredients();

            //cal servings and time
            state.recipe.calcServing();
            state.recipe.calcTime();

            //render the recipe
            clearLoader();
            recipeView.renderRecipe(state.recipe);
    
            console.log(state.recipe);
        } catch (err) {
            alert('Error Processing Recipe!')
        }
       

    }
}

// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe);

['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));

//handing recipe button clicks
elements.recipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        //dec button is clicked
        state.recipe.updateServings('dec');
        recipeView.updateServingsIng(state.recipe);

    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        //inc button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIng(state.recipe);
    }
    console.log(state.recipe);
});