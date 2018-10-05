// import str from './models/Search';
// //import str from './views/searchView'

// //import {add as a, multiply as m,ID} from './views/searchView';
//  import * as searchView from  './views/searchView';
//  import str2 from './views/searchView';

// console.log(`Using imported functions! ${searchView.add(5, str2)} and ${searchView.multiply(3, 5)}.${str} and ${str2}`);

//APIkey: 687f5a8af4ec189da7bfd38e24f10ee9
//API http://food2fork.com/api/search


//Not all browsers allow the fetch function and so we installa axios to make it compatible with other browsers using npm

import {
    elements,
    renderLoader,
    clearLoader,
} from './views/base'; //All the elements from the base.js

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likesView from './views/likesView';
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';



/** Global state of app
 * Search object
 * Current recipe
 * Shopping list object
 * Liked recipes
 */

const state = {};
/**------------ SEARCH CONTROLLER ----------*/


//Function when the form is submitted
const controlSearch = async () => {
    // 1) get the query from the view
    const query = searchView.getInput();

    //console.log(query); //dynamicallly change the search query account to the users view

    if (query) {
        //2)New Search object and add it to the state
        state.search = new Search(query);

        // 3) prepare UI for results
        searchView.clearInput();
        searchView.clearResults();

        //That is once your search you need to clear it in the searchlist
        renderLoader(elements.searchRes);

        //4) Search for recipes
        try {
            await state.search.getResults();
            //5 Render results in UI
            //console.log(state.search.result);

            clearLoader();
            searchView.renderResults(state.search.result);
        } catch (error) {
            alert('Something wrong with the search...');
            clearLoader();
        }
    }
}
//Adding an event listener
elements.SearchForm.addEventListener('submit', e => {
    e.preventDefault(); //To prevent the browser from reloading
    controlSearch();
});


elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline');
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResults(); // clear the results first

        searchView.renderResults(state.search.result, goToPage);
        //console.log(goToPage);
    }
});

/**------------ RECIPE CONTROLLER------------- */

// const r = new Recipe(16553);
// //debugger;
// r.getRecipe();
// console.log(r);


//Need to make the recipe clicked on show on the center
//using hashchange we can get the recipe ID of all the recipes displayed from the API

const controlRecipe = async () => {
    //Get the Id from the URL
    const id = window.location.hash.replace('#', '');



    if (id) {
        //Prepare UI for changes
        recipeView.clearRecipe();
        renderLoader(elements.recipe);

        //highlight the search item
        if (state.search) {
            searchView.highlightedSelected(id);
        }


        //create new recipe object
        //We are taking it from the state
        state.recipe = new Recipe(id);


        try {
            //get recipe Data
            //---->calling the get from the server asynchronously
            //Parse ingredients and get recipe
            await state.recipe.getRecipe();

            // console.log(state.recipe.Ingredients);
            state.recipe.parseIngredients();
            //debugger;

            //Calculate servings and time
            state.recipe.calcTime();
            state.recipe.servingTime();


            //render the recipe
            //console.log(state.recipe);
            clearLoader();
            recipeView.renderRecipe(state.recipe,
                state.likes.isLiked(id)
            );
        } catch (err) {
            console.log(err);
            alert('Error processing recipe!');
        }

    }

};

// window.addEventListener('hashchange', controlRecipe);

// window.addEventListener('load', controlRecipe);

// to use multiple event listener and then we use by taking it as an array and then adding an event

['hashchange', 'load'].forEach(event => addEventListener(event, controlRecipe));


/**------------ LIST CONTROLLER------------- */

const controlList = () => {

    //Create a new list if there isnt any
    if (!state.list) {
        state.list = new List();
    }

    //Add each ingredient to thelist
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
}


//Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;


    //handle the delete button
    if (e.target.closest('.shopping__delete, shopping__delete *')) {
        //Delete from the state
        state.list.deleteItem(id);

        //delete from UI
        listView.deleteItem(id);

        //handling the updated event
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value);
        state.list.updateCount(id, val);

    }

});


/**------------ LIKE CONTROLLER------------- */
// //TEstign
// state.likes = new Likes();
// likesView.toggleLikeMenu(state.likes.getNumLikes);

window.addEventListener('load', () => {
    state.likes = new Likes();

    //Restore links
    // debugger;
    state.likes.readStorage();

    //Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    //Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
});

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    const currentID = state.recipe.id;

    //User has not yet liked current recipe
    if (!state.likes.isLiked(currentID)) {
        //Add the like to the state
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        );
        //Toggle the like button
        likesView.toggleButton(true);

        //add like to the UI list
        likesView.renderLike(newLike);
        // console.log(state.likes);

        //User has likes the current recipe    
    } else {

        //remove the like to the state
        state.likes.deleteLikes(currentID);
        //Toggle the like button
        likesView.toggleButton(false);
        //remove like to the UI list

        likesView.deleteLike(currentID);

    }
    likesView.toggleLikeMenu(state.likes.getNumLikes());
};

//Restore the loca



//handling the recipe and increase the servinsg we create an event delegation
elements.recipe.addEventListener('click', e => {

    if (e.target.closest('.btn-decrease, .btn-decrease *')) {
        // decrease button is clicked -->settings limit
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsIngredients(state.recipe);
        }
    } else if (e.target.closest('.btn-increase, .btn-increase *')) {
        // decrease button is clicked

        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } else if (e.target.closest('.recipe__btn--add, .recipe__btn--add *')) {
        //Add ingredient to shopping list
        controlList();
    } else if (e.target.closest('.recipe__love', 'recipe__love *')) {
        //Like controller
        controlLike();

    }
    //console.log(state.recipe);

});