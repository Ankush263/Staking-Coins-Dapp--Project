import './App.css';
import React, { useState, useEffect } from 'react';
import DAPPTOKEN from './artifacts/contracts/DappToken.sol/DappToken.json';
import STAKING from './artifacts/contracts/Staking.sol/Staking.json';
import { ethers } from 'ethers';

function App() {

  const [signerAddress, setSignerAddress] = useState("")
  const [logedIn, isLogedIn] = useState(false)
  const [hours, setHours] = useState(0)
  const [tokenAmount, setTokenAmount] = useState(0)

  const dappTokenDeployAddress = "0x0165878A594ca255338adfa4d48449f69242Eb8F"
  const stakingDeployAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"

  const stakeAbi = STAKING.abi
  const dappAbi = DAPPTOKEN.abi

  const stakeProvider = new ethers.providers.Web3Provider(window.ethereum)
  const dankTokenProvider = new ethers.providers.Web3Provider(window.ethereum)

  const stakeSigner = stakeProvider.getSigner()
  const dappTokenSigner = dankTokenProvider.getSigner()


  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const Address = await stakeSigner.getAddress()
        setSignerAddress(Address)
      }
      isLogedIn(true)
    } catch (error) {
      console.log("Connect Wallet: ", error)
    }
  }

  // useEffect(() => {
  //   const Asset = async () => {
  //     const tokenSymbol = "DANK"    // Token Symbol
  //     const tokenDecimals = 5 
  //     try {
  //       const wasAdded = window.ethereum.request({
  //         method: 'wallet_watchAsset',
  //         params: {
  //           type: 'ERC20', 
  //           options: {
  //             address: dappTokenDeployAddress, 
  //             symbol: tokenSymbol, 
  //             decimals: tokenDecimals,
  //           },
  //         },
  //       });  
  //       if (wasAdded) {
  //         console.log('Thanks for your interest!');
  //       } else {
  //         console.log('Your loss!');
  //       }
  //     } catch (error) {
  //       console.log(error)
  //     }
  //   }
  //   Asset()
  // }, [logedIn])

  const tokenFaucet = async () => {
    const contract = await new ethers.Contract(dappTokenDeployAddress, dappAbi, dappTokenSigner)
    try {
      const Faucet = await contract.faucet(signerAddress, 100)
      Faucet.wait()
    } catch (error) {
      console.log("Token Faucet Error: ", error)
    }
  }

  const stake = async () => {
    const contract = await new ethers.Contract(stakingDeployAddress, stakeAbi, stakeSigner)
    try {
      const stakeToekn = await contract.stakeTokens(hours, { value: tokenAmount })
    } catch (error) {
      console.log("Stake Error: ", error)
    }
  }

  const unStake = async () => {
    const contract = await new ethers.Contract(stakingDeployAddress, stakeAbi, stakeSigner)
    
    try {
      console.log(tokenAmount)
      console.log(hours)
    } catch (error) {
      console.log("UnStake Error: ", error)
    }
  }


  return (
    <div className="App">
      <div className="connect-wallet">
        <button onClick={connectWallet}>Connect Wallet</button>
      </div>
      <div className="faucet">
        <button onClick={tokenFaucet}>Faucet</button>
        <input type="text" onChange={(e) => {setSignerAddress(e.target.value)}} value={signerAddress} />
      </div>
      <div className="stakings">
        <input type="number" placeholder='Hours' onChange={(e) => {setHours(e.target.value)}} value={hours} />
        <input type="number" placeholder='Token Amount' onChange={(e) => {setTokenAmount(e.target.value)}} value={tokenAmount} />
        <button onClick={stake}>Stake Token</button>
        <button onClick={unStake}>Unstake Token</button>
      </div>
    </div>
  );
}

export default App;
