pragma solidity >=0.5.1;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'ProcessorRole' to manage this role - add, remove, check
contract ProcessorRole {

  // Define 2 events, one for Adding, and other for Removing
  event ProcessorAdded(address indexed account);

  // Define a struct 'processors' by inheriting from 'Roles' library, struct Role

  // In the constructor make the address that deploys this contract the 1st processor
  constructor() public {

  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyProcessor() {

    _;
  }

  // Define a function 'isProcessor' to check this role
  function isProcessor(address account) public view returns (bool) {

  }

  // Define a function 'addProcessor' that adds this role
  function addProcessor(address account) public onlyProcessor {

  }

  // Define a function 'renounceProcessor' to renounce this role
  function renounceProcessor() public {

  }

  // Define an internal function '_addProcessor' to add this role, called by 'addProcessor'
  function _addProcessor(address account) internal {

  }

  // Define an internal function '_removeProcessor' to remove this role, called by 'removeProcessor'
  function _removeProcessor(address account) internal {

  }
}
