import './App.css';
import React, { useState, useEffect } from 'react';
import DAPPTOKEN from './artifacts/contracts/DappToken.sol/DappToken.json';
import STAKING from './artifacts/contracts/Staking.sol/Staking.json';
import { ethers } from 'ethers';
import Model from "./Model";

function App() {

  const [signerAddress, setSignerAddress] = useState("")
  const [logedIn, isLogedIn] = useState(false)
  const [hours, setHours] = useState(0)
  const [tokenAmount, setTokenAmount] = useState(0)
  const [positionId, setPositionId] = useState(0)
  const [data, setData] = useState([])

  const dappTokenDeployAddress = "0x36779Ff417ebB16C309E75C663f91A2eA0227f83"
  const stakingDeployAddress = "0xFC0ABBa48e78eC8eDc63C0037523aa478309C155"

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

  useEffect(() => {
    const Asset = async () => {
      const tokenSymbol = "STK"    // Token Symbol
      const tokenDecimals = 0.1
      try {
        const wasAdded = window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20', 
            options: {
              address: dappTokenDeployAddress, 
              symbol: tokenSymbol, 
              decimals: tokenDecimals,
            },
          },
        });  
        if (wasAdded) {
          console.log('Thanks for your interest!');
        } else {
          console.log('Your loss!');
        }
      } catch (error) {
        console.log(error)
      }
    }
    Asset()
  }, [logedIn])

  const getBalance = async () => {
    const contract = await new ethers.Contract(dappTokenDeployAddress, dappAbi, dappTokenSigner)

    try {
      const balance = await contract.balanceOf(await dappTokenSigner.getAddress())
      // console.log(Number(balance))
      const bal = (Number(balance)).toString()
      console.log(bal)
      console.log(ethers.utils.formatUnits( balance ))
      // console.log(ethers.utils.formatUnits( balance, "wei" ))
      // console.log(Number(ethers.utils.parseUnits( bal, 0 )))
    } catch (error) {
      console.log("Token Balance Error: ", error)
    }
  }

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
      const stakeToekn = await contract.stakeTokens(hours, { value: tokenAmount * 10**14 })
    } catch (error) {
      console.log("Stake Error: ", error)
    }
  }


  /**------------------------------------------------------------------------------------------ */

  const setId = async (address) => {
    const contract = await new ethers.Contract(stakingDeployAddress, stakeAbi, stakeSigner)
    try {
      const address = await stakeSigner.getAddress()
      let positionId = await contract.getPositionIdsForAddress(address)
      positionId.map(eachPosition => console.log(Number(eachPosition)))
    } catch (error) {
      console.log("setId Error: ", error)
    }
  }


  const getAllPositions = async () => {
    const contract = await new ethers.Contract(stakingDeployAddress, stakeAbi, stakeSigner)

    try {
      const address = await stakeSigner.getAddress()
      let positionId = await contract.getPositionIdsForAddress(address)
      positionId.map(async eachPosition => {
        const pos = await contract.positions(eachPosition)

        let Pos = {
          percentInterest: Number(pos.percentInterest),
          positionId: Number(pos.positionId),
          tokenStaked: Number(pos.tokenStaked),
          tokenInterest: Number(pos.tokenInterest),
          open: pos.open
        }
        
        setData(prev => [...prev, Pos])
      })
      console.log(data)
    } catch (error) {
      console.log("GetAllPosition Error: ", error)
    }
  }

  /**------------------------------------------------------------------------------------------- */


  const withdraw = async (positionId) => {
    
    const contract = await new ethers.Contract(stakingDeployAddress, stakeAbi, stakeSigner)
    
    try {
      console.log("tokenAmount: ", tokenAmount)
      console.log("hours: ", hours)
      console.log(positionId)
      // const address = await stakeSigner.getAddress()
      await contract.closePosition(positionId)
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
        {/* <button onClick={unStake}>Unstake Token</button> */}
        <button onClick={getBalance}>Token Balance</button>
        <button onClick={getAllPositions}>getData</button>
        <div className="IDS">{positionId}</div>
        <div className="IDS">
        {data.map(item => {
          return (
            <Model
              key = {item.positionId}
              percentInterest = {item.percentInterest}
              positionId = {item.positionId}
              tokenInterest = {item.tokenInterest}
              tokenStaked = {item.tokenStaked}
              open = {item.open}
              withdraw = {() => withdraw(item.positionId)}
            />
          )
        })}
        </div>
      </div>
    </div>
  );
}

export default App;
