const expect = require('expect.js');

const {isRealString} = require('./validation');

describe('Validating Strings Tests', () => {
    it('should return false if invalid or empty or whitespace strings provided', () => {
        expect(isRealString("")).to.be(false);
        expect(isRealString("              ")).to.be(false);
        expect(isRealString(123456789)).to.be(false);
    });
    
    it('should return true if valid strings provided', () => {
        expect(isRealString("valid String")).to.be(true);
    });
})