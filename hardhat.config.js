require('@nomiclabs/hardhat-waffle')
require('dotenv').config()


module.exports = {
  solidity: '0.8.0',
  networks: {
    goerli: {
      url: `https://goerli.infura.io/v3/${process.env.API_KEY}`,
      accounts: [
        `${process.env.PRIVATE_KEY}`,
      ],
    },
  },
}

