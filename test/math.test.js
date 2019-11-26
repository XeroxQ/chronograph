const assert = require('assert');
const { Utils } = require('../lib/utils.js');


console.log(Utils.beautifyName('bert'));
console.log(Utils.beautifyName('bert123'));
console.log(Utils.beautifyName('badkamer boven 1'));

/*
describe('Math', () => {
	it('math evaluate should handle basic math', function() {
		assert.equal(Utils.evalTime('   2 *    5'), 10, 'multiply should work properly');
		assert.equal(Utils.evalTime('   15 /   3'), 5, 'divide should work properly');
		assert.equal(Utils.evalTime('   15 %  10'), 5, 'modulo should work properly');
		assert.equal(Utils.evalTime('   1.5 + 10'), 11.5, 'add should work properly');
		assert.equal(Utils.evalTime('  9999 -  9998'), 1, 'subtract should work properly');
	});

	it('math evaluate should handle random functionality', function() {
		for (var i = 1; i <= 500; i++) {
			let random = Utils.evalTime(' RaNdOm( 10,     40) ');
			assert.ok(random >= 10, 'random number should be higher than or equal to 10');
			assert.ok(random < 40, 'random number should be lower than 40');
		}
		for (var i = 1; i <= 500; i++) {
			let random = Utils.evalTime('PICK(10,40,99)');
			assert.ok(random == 10 || random == 40 || random == 99, 'random number should be 10, 40 or 99');
		}
	});

	it('math evaluate should handle other functions', function() {
		assert.equal(Utils.evalTime('min(1, 10)'), 1, 'minimum should be 1');
		assert.equal(Utils.evalTime('max(1.9, 10.4)'), 10.4, 'maximum should be 10.4');
		assert.equal(Utils.evalTime('floor(1.9)'), 1, 'floor should be 1');
		assert.equal(Utils.evalTime('abs(-10)'), 10, 'abs should be 10');
	});
});
*/