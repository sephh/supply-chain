const BASE_ERROR = 'Error: VM Exception while processing transaction: revert ';
const BASE_ERROR_LENGTH = BASE_ERROR.length;

function errorHandler(error) {
	if (!error || !error.message) {
		new Noty({
			theme: 'nest',
			type: 'error',
			timeout: 3500,
			layout: 'bottomRight',
			text: 'Unknown Error.'
		}).show();

		return;
	}

	const errorMessage = error.message;
	const start = errorMessage.indexOf(BASE_ERROR) + BASE_ERROR_LENGTH;
	const end = errorMessage.length;
	const msgToShow = errorMessage.substr(start, end);

	if (msgToShow.length) {
		new Noty({
			theme: 'nest',
			type: 'error',
			timeout: 3500,
			layout: 'bottomRight',
			text: msgToShow
		}).show();

		return;
	}

	new Noty({
		theme: 'nest',
		type: 'error',
		timeout: 3500,
		layout: 'bottomRight',
		text: 'Unknown Error.'
	}).show();
}

App = {
	web3Provider: null,
	contracts: {},
	emptyAddress: '0x0000000000000000000000000000000000000000',
	sku: 0,
	upc: 0,
	metamaskAccountID: '0x0000000000000000000000000000000000000000',
	ownerID: '0x0000000000000000000000000000000000000000',
	originFisherID: '0x0000000000000000000000000000000000000000',
	originFishName: null,
	originFishInformation: null,
	originFishLatitude: null,
	originFishLongitude: null,
	productNotes: null,
	productPrice: 0,
	regulatorID: '0x0000000000000000000000000000000000000000',
	processorID: '0x0000000000000000000000000000000000000000',
	distributorID: '0x0000000000000000000000000000000000000000',
	consumerID: '0x0000000000000000000000000000000000000000',

	init: async function () {
		App.readForm();
		/// Setup access to blockchain
		return await App.initWeb3();
	},

	readForm: function () {
		App.sku = $('#sku').val();
		App.upc = $('#upc').val();
		App.ownerID = $('#ownerID').val();
		App.originFisherID = $('#originFisherID').val();
		App.originFishName = $('#originFishName').val();
		App.originFishInformation = $('#originFishInformation').val();
		App.originFishLatitude = $('#originFishLatitude').val();
		App.originFishLongitude = $('#originFishLongitude').val();
		App.productNotes = $('#productNotes').val();
		App.productPrice = $('#productPrice').val();
		App.regulatorID = $('#regulatorID').val();
		App.processorID = $('#processorID').val();
		App.distributorID = $('#distributorID').val();
		App.consumerID = $('#consumerID').val();

		console.log(
			App.sku,
			App.upc,
			App.ownerID,
			App.originFisherID,
			App.originFishName,
			App.originFishInformation,
			App.originFishLatitude,
			App.originFishLongitude,
			App.productNotes,
			App.productPrice,
			App.regulatorID,
			App.processorID,
			App.distributorID,
			App.consumerID
		);
	},

	initWeb3: async function () {
		/// Find or Inject Web3 Provider
		/// Modern dapp browsers...
		if (window.ethereum) {
			App.web3Provider = window.ethereum;
			try {
				// Request account access
				await window.ethereum.enable();
			} catch (error) {
				// User denied account access...
				console.error('User denied account access')
			}
		}
		// Legacy dapp browsers...
		else if (window.web3) {
			App.web3Provider = window.web3.currentProvider;
		}
		// If no injected web3 instance is detected, fall back to Ganache
		else {
			App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
		}

		App.getMetaskAccountID();

		return App.initSupplyChain();
	},

	getMetaskAccountID: function () {
		web3 = new Web3(App.web3Provider);

		// Retrieving accounts
		web3.eth.getAccounts(function (err, res) {
			if (err) {
				console.log('Error:', err);
				return;
			}
			console.log('getMetaskID:', res);
			App.metamaskAccountID = res[0];
		})
	},

	initSupplyChain: function () {
		/// Source the truffle compiled smart contracts
		var jsonSupplyChain = '../../build/contracts/SupplyChain.json';

		/// JSONfy the smart contracts
		$.getJSON(jsonSupplyChain, function (data) {
			console.log('data', data);
			var SupplyChainArtifact = data;
			App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
			App.contracts.SupplyChain.setProvider(App.web3Provider);

			App.fetchItemBufferOne();
			App.fetchItemBufferTwo();
			App.fetchEvents();

		});

		return App.bindEvents();
	},

	bindEvents: function () {
		$(document).on('click', App.handleButtonClick);
	},

	handleButtonClick: async function (event) {
		event.preventDefault();

		App.getMetaskAccountID();

		var processId = parseInt($(event.target).data('id'));
		console.log('processId', processId);

		switch (processId) {
			case 1:
				return await App.catchFish(event);
				break;
			case 2:
				return await App.approve(event);
				break;
			case 3:
				return await App.landFish(event);
				break;
			case 4:
				return await App.processFish(event);
				break;
			case 5:
				return await App.packFish(event);
				break;
			case 6:
				return await App.sellFish(event);
				break;
			case 7:
				return await App.buyItem(event);
				break;
			case 9:
				return await App.fetchItemBufferOne(event);
				break;
			case 10:
				return await App.fetchItemBufferTwo(event);
				break;
			case 11:
				return await App.addFisher(event);
				break;
		}
	},

	catchFish: function (event) {
		event.preventDefault();
		var processId = parseInt($(event.target).data('id'));
		App.readForm();

		App.contracts.SupplyChain.deployed().then(function (instance) {
			return instance.catchFish(
				App.upc,
				App.metamaskAccountID,
				App.originFishName,
				App.originFishInformation,
				App.originFishLatitude,
				App.originFishLongitude,
				App.productNotes
				, { from: App.metamaskAccountID });
		}).then(function (result) {
			$('#ftc-item').text(result);
			console.log('catchFish', result);
		}).catch(errorHandler);
	},

	approve: function (event) {
		event.preventDefault();
		var processId = parseInt($(event.target).data('id'));

		App.contracts.SupplyChain.deployed().then(function (instance) {
			return instance.approve(App.upc, { from: App.metamaskAccountID });
		}).then(function (result) {
			$('#ftc-item').text(result);
			console.log('approve', result);
		}).catch(errorHandler);
	},

	landFish: function (event) {
		event.preventDefault();
		var processId = parseInt($(event.target).data('id'));

		App.contracts.SupplyChain.deployed().then(function (instance) {
			return instance.landFish(App.upc, { from: App.metamaskAccountID });
		}).then(function (result) {
			$('#ftc-item').text(result);
			console.log('landFish', result);
		}).catch(errorHandler);
	},

	processFish: function (event) {
		event.preventDefault();
		var processId = parseInt($(event.target).data('id'));

		App.contracts.SupplyChain.deployed().then(function (instance) {
			return instance.processFish(App.upc, { from: App.metamaskAccountID });
		}).then(function (result) {
			$('#ftc-item').text(result);
			console.log('processFish', result);
		}).catch(errorHandler);
	},

	packFish: function (event) {
		event.preventDefault();
		var processId = parseInt($(event.target).data('id'));

		App.contracts.SupplyChain.deployed().then(function (instance) {
			return instance.packFish(App.upc, { from: App.metamaskAccountID });
		}).then(function (result) {
			$('#ftc-item').text(result);
			console.log('packFish', result);
		}).catch(errorHandler);
	},

	sellFish: function (event) {
		event.preventDefault();
		var processId = parseInt($(event.target).data('id'));

		App.contracts.SupplyChain.deployed().then(function (instance) {
			const productPrice = web3.toWei(1, 'ether');
			console.log('productPrice', productPrice);
			return instance.sellFish(App.upc, App.productPrice, { from: App.metamaskAccountID });
		}).then(function (result) {
			$('#ftc-item').text(result);
			console.log('sellFish', result);
		}).catch(errorHandler);
	},

	buyItem: function (event) {
		event.preventDefault();
		var processId = parseInt($(event.target).data('id'));

		App.contracts.SupplyChain.deployed().then(function (instance) {
			const walletValue = web3.toWei(3, 'ether');
			return instance.buyItem(App.upc, { from: App.metamaskAccountID, value: walletValue });
		}).then(function (result) {
			$('#ftc-item').text(result);
			console.log('buyItem', result);
		}).catch(errorHandler);
	},

	fetchItemBufferOne: function () {
		///   event.preventDefault();
		///    var processId = parseInt($(event.target).data('id'));
		App.upc = $('#upc').val();
		console.log('upc', App.upc);

		App.contracts.SupplyChain.deployed().then(function (instance) {
			return instance.fetchItemBufferOne(App.upc);
		}).then(function (result) {
			$('#ftc-item').text(result);
			console.log('fetchItemBufferOne', result);
		}).catch(errorHandler);
	},

	fetchItemBufferTwo: function () {
		///    event.preventDefault();
		///    var processId = parseInt($(event.target).data('id'));

		App.contracts.SupplyChain.deployed().then(function (instance) {
			return instance.fetchItemBufferTwo.call(App.upc);
		}).then(function (result) {
			$('#ftc-item').text(result);
			console.log('fetchItemBufferTwo', result);
		}).catch(errorHandler);
	},

	addFisher: function (event) {
		event.preventDefault();
		const fisherInputValue = $('#originFisherID').val();
		console.log('fisher ID: ', fisherInputValue);

		App.contracts.SupplyChain.deployed().then(function (instance) {
			const walletValue = web3.toWei(3, 'ether');
			return instance.addFisher(fisherInputValue, { from: App.metamaskAccountID });
		}).then(function (result) {
			$('#ftc-item').text(result);
			console.log('buyItem', result);
		}).catch(errorHandler);
	},

	fetchEvents: function () {
		if (typeof App.contracts.SupplyChain.currentProvider.sendAsync !== 'function') {
			App.contracts.SupplyChain.currentProvider.sendAsync = function () {
				return App.contracts.SupplyChain.currentProvider.send.apply(
					App.contracts.SupplyChain.currentProvider,
					arguments
				);
			};
		}

		App.contracts.SupplyChain.deployed().then(function (instance) {
			var events = instance.allEvents(function (err, log) {
				if (!err)
					$('#ftc-events').append('<li>' + log.event + ' - ' + log.transactionHash + '</li>');
			});
		}).catch(function (err) {
			console.log(err.message);
		});

	}
};

$(function () {
	$(window).load(function () {
		App.init();
	});
});
