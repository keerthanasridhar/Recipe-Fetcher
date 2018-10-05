export default class Likes {
    constructor() {
        this.likes = [];
    }
    //Which can save all this in the dropdown
    addLike(id, title, author, img) {
        const like = {
            id,
            title,
            author,
            img
        };
        this.likes.push(like);
        //persist the data on local storage
        this.persistData();
        return like;
    }
    deleteLikes(id) {
        const index = this.likes.findIndex(el => el.id === id);
        this.likes.splice(index, 1);

        //persist data
        this.persistData();

    }
    //display if the recipe was liked or not
    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;

    }
    getNumLikes() {
        return this.likes.length;
    }
    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    }
    readStorage() {
        //converting the string element to value
        const storage = JSON.parse(localStorage.getItem('likes'));

        //restoring likes from the localstorage
        if (storage) this.likes = storage;
    }
}