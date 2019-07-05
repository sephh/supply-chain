// migrating the appropriate contracts
var FisherRole = artifacts.require("./FisherRole.sol");
var RegulatorRole = artifacts.require("./RegulatorRole.sol");
var ProcessorRole = artifacts.require("./ProcessorRole.sol");
var DistributorRole = artifacts.require("./DistributorRole.sol");
var ConsumerRole = artifacts.require("./ConsumerRole.sol");
var SupplyChain = artifacts.require("./SupplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(FisherRole);
  deployer.deploy(RegulatorRole);
  deployer.deploy(ProcessorRole);
  deployer.deploy(DistributorRole);
  deployer.deploy(ConsumerRole);
  deployer.deploy(SupplyChain);
};
