const HDWallet = require('truffle-hdwallet-provider');

module.exports = {
	networks: {
		development: {
			host: '127.0.0.1',
			port: 8545,
			network_id: '*' // Match any network id
		},
		rinkeby: {
			provider: () => new HDWallet(
				'maximum index system liberty refuse loop before guess shaft blue old unable',
				'https://rinkeby.infura.io/v3/cc0b58e328ac49e99430297d5a3d3a70',
			),
			network_id: 4,       // rinkeby's id
			gas: 4500000,        // rinkeby has a lower block limit than mainnet
			gasPrice: 10000000000,
		},
	},
	compilers: {
		solc: {
			version: '>=0.5.1' // ex:  "0.4.20". (Default: Truffle's installed solc)
		}
	}
};
