// require("@nomicfoundation/hardhat-toolbox");

// /** @type import('hardhat/config').HardhatUserConfig */
// module.exports = {
//   solidity: "0.8.9",
//   paths: {
//     artifacts: './frontend/src/artifacts',
//   },
//   networks: {
//     hardhat: {
//       chainId: 1337
//     },
//     goreli: {
//       url: `https://goerli.infura.io/v3/7105afe98f57424fac2cdc5abb6a4394`,
//       accounts: ["0x5857a5c5ad167cd3e8ce6a5dec89f27a846b638c58942b8bcece6cd552a2c6d7"]

//     }
//   },
// };


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

//5857a5c5ad167cd3e8ce6a5dec89f27a846b638c58942b8bcece6cd552a2c6d7