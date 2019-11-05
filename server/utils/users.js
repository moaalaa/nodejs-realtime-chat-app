class Users  {
    /**
     * 
     */
    constructor() {
        this.usersList = [];
    }

    /**
     * Create new User and add it to users list
     * @param {number} id 
     * @param {string} name 
     * @param {string} room
     * 
     * @returns Object 
     */
    createUser(id, name, room) {
        const user = {id, name, room}
        this.usersList.push(user);

        return user;
    }

    /**
     * Remove specific user by id
     * @param {number} id
     * 
     * @returns {(Object|undefined)} returns object if user removed or undefined if user not found 
     */
    removeUser(id) {
        const user = this.getUser(id);
        
        if (user) {
            this.usersList = this.usersList.filter(user => user.id !== id);
        }
        
        return user;
    }

    /**
     * Get specific user by id
     * @param {number} id 
     * 
     * @returns object if user found or undefined if user not found 
     */
    getUser(id) {
        return this.usersList.filter(user => user.id === id)[0];
    }

    /**
     * Get all users in specific room
     * @param {string} room 
     * 
     * @returns Array
     */
    getUsersList(room) {
        const users = this.usersList.filter(user => user.room === room);

        return users.map(user => user.name);
    }
}

module.exports = {Users}