import axios from 'axios';
var http = require('http');



import {
    key,
    proxy
} from '../config';

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
            // console.log(res)
            //for rate limtiting purpose we check if the recipe is present from the API then we parse the result
            //Else we
            if (res.data.recipe) {

                this.title = res.data.recipe.title;
                this.author = res.data.recipe.publisher;
                this.img = res.data.recipe.image_url;
                this.url = res.data.recipe.source_url;
                this.ingredients = res.data.recipe.ingredients;
            } else {
                window.location.replace("https://github.com/404");


            }
        } catch (error) {
            console.log(error);
            alert('Something went wrong :(');
        }
    }
    calcTime() {
        //Assuming that for every3 ingredients it would take 15min 
        const numIng = this.ingredients.length;
        const periods = numIng / 3;
        this.time = periods * 15;
    }

    servingTime() {
        this.servings = 4;

    }

    //Generalise the quanitty
    parseIngredients() {

        const unitsLong = ['tablespoons', 'tablespoon', 'ounce', 'ounces', 'teaspoon', 'teaspoons', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tpsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];
        const newIngredients = this.ingredients.map(el => {
            try {
                //console.log("Kee checking this one now  ->  " + el);
                //1) uniform units
                let ingredient = el.toLowerCase();
                unitsLong.forEach((unit, i) => {
                    ingredient = ingredient.replace(unit, unitsShort[i]);
                });

                //2) Remove parenthesis and replace it with space " "
                ingredient = ingredient.replace(/ *\([^)]*\) */g, " ");


                // 3) Parse ingredients into cout, unit and ingredient

                //converting the ingredient to an array using split operation
                const arrIng = ingredient.split(' ');
                //find the index of where the unit is located
                const unitIndex = arrIng.findIndex(el2 => unitsShort.includes(el2));

                let objIng;
                //All possibilities of the index
                if (unitIndex > -1) {
                    //there is a unit
                    //Eg: 4 1/2 cups ---> [4, 1/2]
                    // 4 cups, arrCount is [4]
                    const arrCount = arrIng.slice(0, unitIndex);
                    let count;
                    if (arrCount.length === 1) {
                        count = eval(arrIng[0].replace('-', '+'));
                    } else {
                        count = eval(arrIng.slice(0, unitIndex).join('+')); //4+1/2 = 4.5
                    }
                    //display the object with the above manipulation
                    objIng = {
                        count,
                        unit: arrIng[unitIndex],
                        ingredient: arrIng.slice(unitIndex + 1).join(' ')

                    };
                } else if (parseInt(arrIng[0], 10)) {
                    //There is no unit, but 1st element is number and returns number and return true
                    objIng = {
                        count: parseInt(arrIng[0], 10),
                        unit: '',
                        ingredient: arrIng.slice(1).join(' ')
                    }

                } else if (unitIndex === -1) {
                    //there is not unit
                    //Es6 ingredient itself will take the value and does not need assining

                    objIng = {
                        count: 1,
                        unit: '',
                        ingredient
                    };

                }
                //console.log("Process this ingedient " + el)
                return objIng;
            } catch (error) {
                //console.log("Cant process this ingedient " + error);
                //console.log("Cant process this ingedient " + el)
                //pass
            }
        });
        this.ingredients = newIngredients;

    }
    //update the srvings and ingredients
    updateServings(type) {


        //servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        //Ingredients

        this.ingredients.forEach(ing => {

            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
        //console.log(`This is newservimgs: ${newServings}`);
    }
}