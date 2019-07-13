pragma solidity >=0.5.1;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'FisherRole' to manage this role - add, remove, check
contract FisherRole {
	using Roles for Roles.Role;

	// Define 2 events, one for Adding, and other for Removing
	event FisherAdded(address indexed account);
	event FisherRemoved(address indexed account);

	// Define a struct 'fishers' by inheriting from 'Roles' library, struct Role
	Roles.Role private fishers;

	// In the constructor make the address that deploys this contract the 1st fisher
	constructor() public {
		_addFisher(msg.sender);
	}

	// Define a modifier that checks to see if msg.sender has the appropriate role
	modifier onlyFisher() {
		require(isFisher(msg.sender));
		_;
	}

	// Define a function 'isFisher' to check this role
	function isFisher(address account) public view returns (bool) {
		return fishers.has(account);
	}

	// Define a function 'addFisher' that adds this role
	function addFisher(address account) public onlyFisher {
		_addFisher(account);
	}

	// Define a function 'renounceFisher' to renounce this role
	function renounceFisher() public {
		_removeFisher(msg.sender);
	}

	// Define an internal function '_addFisher' to add this role, called by 'addFisher'
	function _addFisher(address account) internal {
		fishers.add(account);
		emit FisherAdded(account);
	}

	// Define an internal function '_removeFisher' to remove this role, called by 'removeFisher'
	function _removeFisher(address account) internal {
		fishers.remove(account);
		emit FisherRemoved(account);
	}
}
