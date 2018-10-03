// //export default 'I am an exported string.';

// export default 23;
import axios from 'axios';

import {
    key,
    proxy
} from '../config';
export default class Search {
    constructor(query) {
        this.query = query;
    }

    //Method to search
    async getResults() {
        try {
            //debugger;
            const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
            this.result = res.data.recipes; // to get all the recepis in the object
            //debugger;
            //console.log(this.result);
        } catch (error) {
            alert(error);
        }

    }
}