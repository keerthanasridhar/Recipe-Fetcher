// import str from './models/Search';
// //import str from './views/searchView'

// //import {add as a, multiply as m,ID} from './views/searchView';
//  import * as searchView from  './views/searchView';
//  import str2 from './views/searchView';

// console.log(`Using imported functions! ${searchView.add(5, str2)} and ${searchView.multiply(3, 5)}.${str} and ${str2}`);

//APIkey: 687f5a8af4ec189da7bfd38e24f10ee9
//API http://food2fork.com/api/search


//Not all browsers allow the fetch function and so we installa axios to make it compatible with other browsers using npm

import Search from './models/Search';
import * as searchView from './views/searchView';
import {
    elements,
    renderLoader,
    clearLoader,
} from './views/base'; //All the elements from the base.js
import Recipe from './models/Recipe';

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
        searchView.clearResults(); //That is once your search you need to clear it in the searchlist
        renderLoader(elements.searchRes);

        //4) Search for recipes
        await state.search.getResults();

        //5 Render results in UI
        //console.log(state.search.result);
        clearLoader();
        searchView.renderResults(state.search.result);


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

const r = new Recipe(47025);

r.getRecipe();
console.log(r);
debugger;