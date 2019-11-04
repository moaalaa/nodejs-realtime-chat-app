const expect = require('expect.js');

const {generateMessage, generateLocationMessage} = require('./message');

describe('Generate New Message', () => {
    it('should generate new message with user name and message text', () => {
        let from        = 'Alaa';
        let text        = 'Test New Message';
        const message   = generateMessage(from, text);

        expect(message.createdAt).to.be.a('number');
        expect(message).to.have.key('from');
        expect(message).to.have.key('text');
        
        // to.equal alias to.be and both using '===' equality
        // to.eql loose equality but work with objects
        expect(message.from).to.equal(from);
        expect(message.text).to.be(text);
    });
    
    it('should generate new location message with user name and map link', () => {
        let from        = 'Alaa';
        let latitude    = 10;
        let longitude   = 30;
        const message   = generateLocationMessage(from, latitude, longitude);

        expect(message.createdAt).to.be.a('number');
        expect(message).to.have.key('from');
        expect(message).to.have.key('url');
        expect(message.from).to.equal(from);
        expect(message.url).to.equal(`https://www.google.com/maps?q=${latitude},${longitude}`);
    });

})