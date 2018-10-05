// export const add = (a, b) => a + b;

// export const multiply = (a, b) => a * b;

// export const ID = 23;

// export default 'blah blah blah !';

//Retrun the input value of the fields
import {
    elements
} from './base'; //All the elements from the base.js

//debugger;
export const getInput = () => elements.searchInput.value; //Since its a arrow function it will implicitly return a value;

//To read the input from the inpur form  and  display it on the page based on what is searched


export const clearInput = () => {
    elements.searchInput.value = '';
};

export const clearResults = () => {
    elements.searchResultList.innerHTML = '';
    //Clear the pagination button results
    elements.searchResPages.innerHTML = '';
}

export const highlightedSelected = id => {

    const resultArr = Array.from(document.querySelectorAll('.results__link'));
    resultArr.forEach(el => {
        el.classList.remove('results__link--active');
    })
    //select all the list of elements or recipes
    document.querySelector(`.results__link[href = "#${id}"]`).classList.add('results__link--active');
};

//Eg: 'pasta with tomato and spinach'
/*
acc: 0/acc+ cur.length = 0+5 = 5/ newTitle = ['pasta']
acc: 5/acc+ cur.length = 5+4 = 9/ newTitle = ['pasta','with']
acc: 9/acc+ cur.length = 9+6 = 15/ newTitle = ['pasta','with','tomato']
acc: 15/acc+ cur.length = 15+3 = 18/(18>the limit) newTitle = ['pasta','with','tomato'] doesnt push
acc: 15/acc+ cur.length = 15+ = 25/(18>the limit) newTitle = ['pasta','with','tomato'] doesnt push

*/
export const limitRecipeTitle = (title, limit = 20) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newTitle.push(cur);

            }
            return acc + cur.length;
        }, 0);
        //return the result
        return `${newTitle.join(' ')}...`
    }
    return title;
}
//Take each and every recipe received and render it.
const renderRecipe = recipe => {

    //To clear the text from the input field after being searched


    const markup =
        `<div> 
        <li>
    <a class="results__link" href="#${recipe.recipe_id}">
        <figure class="results__fig">
            <img src="${recipe.image_url}" alt="Test">
        </figure>
        <div class="results__data">
            <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
            <p class="results__author">${recipe.publisher}</p>
        </div>
    </a>
</li> <div>`;
    var txt = document.createElement("div")
    txt.innerHTML = markup;


    //debugger;
    //Since we're using a insertadjacent element we put it in a dive element by crearing 
    //the a div and then we insert it in the html and
    elements.searchResultList.insertAdjacentElement('beforeend', txt);


    //elements.searchResultList.insertAdjacentHTML('beforeend',markup);

};
//Creation of the render pagination button 
//the type: 'prev' or 'next'
const createButton = (page, type) => `
 <button class="btn-inline results__btn--${type}" data-goto = ${type ==='prev'? page - 1: page + 1}>
 <span>Page ${type ==='prev'? page - 1: page + 1}</span>
<svg class="search__icon">
    <use href="img/icons.svg#icon-triangle-${type ==='prev'?'left': 'right'}"></use>
</svg>
</button>
`;

//To render the pagination button 
//numresults will be the total number of results that is received.
const renderButton = (page, numresults, resultPerPage) => {
    const pages = Math.ceil(numresults / resultPerPage);
    let button;
    // First page should have only the nextpage button 
    if (page === 1 && pages < 1) {
        button = createButton(page, 'next');
    } else if (page < pages) { //and the middle ones will have both and  prev and next
        button = `${ createButton(page,'prev')}
                    ${ createButton(page,'next')}`;
    }
    //last page should only go previouspage
    else if (page === pages && pages > 1) {
        button = createButton(page, 'prev');
    }
    //Insert the resultpages to the UI
    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

//To print the rceived data to the UI
//Start and end variables are for pagination and are to limit the result contents to a limit.
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    //render results of current pages and pagination

    const start = (page - 1) * resPerPage; //eg: if page =1 ,start: 0 end: 10
    const end = page * resPerPage;
    //debugger;
    recipes.slice(start, end).forEach(renderRecipe);
    //console.log(recipes);
    renderButton(page, recipes.length, resPerPage);
};