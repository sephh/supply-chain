// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
var RegulatorRole = artifacts.require('RegulatorRole');

contract('RegulatorRole', function (accounts) {
	// Declare few constants and assign a few sample accounts generated by ganache-cli
	const ownerID = accounts[0];
	const newRegulator = accounts[1];
	let regulatorRole;

	beforeEach(async () => {
		regulatorRole = await RegulatorRole.deployed();
	});

	// 1st Test
	it('Testing smart contract was created correctly', async () => {
		// Declare and Initialize a variable for event
		let regulatorAddedEmited = false;

		// Watch the emitted event RegulatorAdded()
		regulatorRole.RegulatorAdded((err, res) => {
			regulatorAddedEmited = true
		});

		expect(await regulatorRole.isRegulator.call(ownerID)).to.be.equal(true, 'The owner is not regulator');
		expect(regulatorAddedEmited).to.be.equal(true, 'RegulatorAdded was not emitted');
	});

	it('Testing smart contract addRegulator function', async () => {
		// Declare and Initialize a variable for event
		let regulatorAddedEmited = false;

		// Watch the emitted event RegulatorAdded()
		regulatorRole.RegulatorAdded((err, res) => {
			regulatorAddedEmited = true
		});

		await regulatorRole.addRegulator(newRegulator);

		expect(await regulatorRole.isRegulator.call(newRegulator)).to.be.equal(true, 'The newRegulator is not regulator');
		expect(regulatorAddedEmited).to.be.equal(true, 'RegulatorAdded was not emitted');
	});

	it('Testing smart contract renounceRegulator function', async () => {
		// Declare and Initialize a variable for event
		let regulatorRemovedEmited = false;

		// Watch the emitted event RegulatorRemoved()
		regulatorRole.RegulatorRemoved((err, res) => {
			regulatorRemovedEmited = true
		});

		await regulatorRole.renounceRegulator();

		expect(await regulatorRole.isRegulator.call(ownerID)).to.be.equal(false, 'The removed regulator still regulator');
		expect(regulatorRemovedEmited).to.be.equal(true, 'RegulatorRemoved was not emitted');
	});

});

