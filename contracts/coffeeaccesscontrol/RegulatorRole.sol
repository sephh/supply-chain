pragma solidity >=0.5.1;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'RegulatorRole' to manage this role - add, remove, check
contract RegulatorRole {
	using Roles for Roles.Role;

	// Define 2 events, one for Adding, and other for Removing
	event RegulatorAdded(address indexed account);
	event RegulatorRemoved(address indexed account);

	// Define a struct 'regulators' by inheriting from 'Roles' library, struct Role
	Roles.Role private regulators;

	// In the constructor make the address that deploys this contract the 1st regulator
	constructor() public {
		_addRegulator(msg.sender);
	}

	// Define a modifier that checks to see if msg.sender has the appropriate role
	modifier onlyRegulator() {
		require(isRegulator(msg.sender));
		_;
	}

	// Define a function 'isRegulator' to check this role
	function isRegulator(address account) public view returns (bool) {
		return regulators.has(account);
	}

	// Define a function 'addRegulator' that adds this role
	function addRegulator(address account) public onlyRegulator {
		_addRegulator(account);
	}

	// Define a function 'renounceRegulator' to renounce this role
	function renounceRegulator() public {
		_removeRegulator(msg.sender);
	}

	// Define an internal function '_addRegulator' to add this role, called by 'addRegulator'
	function _addRegulator(address account) internal {
		regulators.add(account);
		emit RegulatorAdded(account);
	}

	// Define an internal function '_removeRegulator' to remove this role, called by 'removeRegulator'
	function _removeRegulator(address account) internal {
		regulators.remove(account);
		emit RegulatorRemoved(account);
	}
}
