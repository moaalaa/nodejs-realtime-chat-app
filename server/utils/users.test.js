const expect = require('expect.js');

const {Users} = require('./users');

describe('Users Tests', () => {
    let users;

    // Seeding Test Cases by using 'beforeEach' that will run before each test case 
    beforeEach(() => {
        users = new Users();
        users.usersList = [
            {id: 1, name:'alaa', room:'work-room'},
            {id: 2, name:'hamza', room:'work-room'},
            {id: 3, name:'nader', room:'family-room'},
        ];
        
    })

    it('should create new user', () => {
        const user = {id: '123456789', name:'alaa', room:'test-room'};
        const createdUser = users.createUser(user.id, user.name, user.room);

        expect(users.usersList.length).to.be.greaterThan(0);
        
        // the recently created users + seeded users
        expect(users.usersList.length).to.equal(4);
        
        // use 'eql' for objects and arrays
        const lastUser = users.usersList.pop();
        expect(lastUser).to.eql(user);
        expect(lastUser).to.eql(createdUser);
    });
    
    it('should not remove user by providing a wrong or invalid id', () => {
        const user = users.removeUser(123456789);
        
        expect(user).to.be(undefined);
        expect(users.usersList.length).to.equal(3);
    });

    it('should remove user by providing it\'s id', () => {
        const user = users.removeUser(1);

        expect(user.id).to.equal(1);
        expect(users.usersList.length).to.equal(2);
    });

    it('should not get user by providing a wrong or invalid id', () => {
        expect(users.getUser(100)).to.be(undefined);
    });

    it('should get user by providing it\'s id', () => {
        const user = users.getUser(1);

        expect(user).to.not.be(undefined);
        expect(user.id).to.equal(1);
        expect(users.usersList[0].id).to.equal(user.id);
        expect(users.usersList[0].name).to.equal(user.name);
    });

    it('should not return any users names if provided a wrong or invalid room name', () => {
        const invalidUsersList = users.getUsersList('invalid-room');

        expect(invalidUsersList.length).to.be(0);
    });

    it('should return all users names by room name', () => {
        const workUsersList = users.getUsersList('work-room');

        expect(workUsersList.length).to.equal(2);
        expect(workUsersList).to.eql(['alaa', 'hamza']);

        const familyUsersList = users.getUsersList('family-room');

        expect(familyUsersList.length).to.equal(1);
        expect(familyUsersList).to.eql(['nader']);
    });
});