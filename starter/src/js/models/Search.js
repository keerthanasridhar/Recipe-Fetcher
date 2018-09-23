// //export default 'I am an exported string.';

// export default 23;
import Axios from 'axios';
export default class Search {
    constructor(query) {
        this.query = query;
    }
    //Method to search

    async getResults() {
        const proxy = "https://cors-anywhere.herokuapp.com"
        const key = '687f5a8af4ec189da7bfd38e24f10ee9';
        try {
            const res = await Axios(`${proxy}/http://food2fork.com/api/search?key=${key}&q=${this.query}`);
            console.log(res);
            this.result = res.data.recipes; // to get all the recepis in the object
            debugger;
            //console.log(this.result);
        } catch (error) {
            alert(error);
        }

    }
}