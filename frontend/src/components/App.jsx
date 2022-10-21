import '../style/App.css';
import React, { useState, useEffect } from 'react';
import DAPPTOKEN from '../utils/DappToken.json';
import STAKING from '../utils/Staking.json';
import { ethers } from 'ethers';
import Model from "./Model";
import Button from '@mui/material/Button';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import SavingsIcon from '@mui/icons-material/Savings';

function App() {

  const [signerAddress, setSignerAddress] = useState("")
  const [logedIn, isLogedIn] = useState(false)
  const [hours, setHours] = useState(0)
  const [positionId, setPositionId] = useState(0)
  const [data, setData] = useState([])
  const [isDisabled, setIsDisabled] = useState(false)
  const [fetchDisabled, setFetchDisabled] = useState(false)


  const [oneTokenAmount, setOneTokenAmount] = useState(0)
  const [threeTokenAmount, setThreeTokenAmount] = useState(0)
  const [sixTokenAmount, setSixTokenAmount] = useState(0)

  const [oneMonth, setOneMonth] = useState()



  const dappTokenDeployAddress = "0x6a8F35Dc508a95799c3C8c10b0d1E3A436c9D0Cc"
  const stakingDeployAddress = "0x23fE2Ded28C919f8e8b8DEF60794c5f62b035f40"

  const stakeAbi = STAKING.abi
  const dappAbi = DAPPTOKEN.abi

  const stakeProvider = new ethers.providers.Web3Provider(window.ethereum)
  const dankTokenProvider = new ethers.providers.Web3Provider(window.ethereum)

  const stakeSigner = stakeProvider.getSigner()
  const dappTokenSigner = dankTokenProvider.getSigner()

  const contract = new ethers.Contract(stakingDeployAddress, stakeAbi, stakeSigner)


  const iconStyle = {
    fontSize: "90", 
  }


  const connectWallet = async () => {
    setIsDisabled(true)
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const Address = await stakeSigner.getAddress()
        setSignerAddress(Address)
      }
      isLogedIn(true)
      setIsDisabled(false)
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


  const tokenFaucet = async () => {
    setIsDisabled(true)
    const tokenContract = new ethers.Contract(dappTokenDeployAddress, dappAbi, dappTokenSigner)
    try {
      const Faucet = await tokenContract.faucet(signerAddress, 100)
      Faucet.wait()
      setIsDisabled(false)
    } catch (error) {
      console.log("Token Faucet Error: ", error)
    }
  }

  
  const oneMonthStake = async () => {
    setIsDisabled(true)
    try {
      const stakeToekn = await contract.stakeTokens(30, { value: oneTokenAmount })
      setIsDisabled(false)
    } catch (error) {
      console.log("oneMonthStake Error: ", error)
    }
  }

  const threeMonthStake = async () => {
    setIsDisabled(true)
    try {
      const stakeToekn = await contract.stakeTokens(90, { value: threeTokenAmount })
      setIsDisabled(false)
    } catch (error) {
      console.log("threeMonthStake Error: ", error)
    }
  }

  const sixMonthStake = async () => {
    setIsDisabled(true)
    try {
      const stakeToekn = await contract.stakeTokens(180, { value: sixTokenAmount })
      setIsDisabled(false)
    } catch (error) {
      console.log("sixMonthStake Error: ", error)
    }
  }


  /**------------------------------------------------------------------------------------------ */

  const setId = async (address) => {
    try {
      const address = await stakeSigner.getAddress()
      let positionId = await contract.getPositionIdsForAddress(address)
      positionId.map(eachPosition => console.log(Number(eachPosition)))
    } catch (error) {
      console.log("setId Error: ", error)
    }
  }


  

  const getAllPositions = async () => {
    setFetchDisabled(true)

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
          createTime: Number(pos.createTime),
          unlockTime: Number(pos.unlockTime),
          open: pos.open
        }
        
        setData(prev => [...prev, Pos])
      })
    } catch (error) {
      console.log("GetAllPosition Error: ", error)
    }
  }

  /**------------------------------------------------------------------------------------------- */


  const withdraw = async (positionId) => {
    try {
      await contract.closePosition(positionId)
    } catch (error) {
      console.log("UnStake Error: ", error)
    }
  }

  

  return (
    <div className="App">
      <div className="connect">
        {logedIn ?
           <Button onClick={tokenFaucet} variant="contained" disabled={isDisabled}>
            Faucet
          </Button>
           : 
          <Button onClick={connectWallet} variant="contained" disabled={isDisabled}>
            Connect Wallet
          </Button>}
      </div>
      <div className="staking--card">

        <div className="time">
          <span className='icon--status'>
            <MonetizationOnIcon className='icon--card' style={iconStyle} />
            <span className='icon--about'>1 month 7% APY</span>
            <div className="stake-money-input">
              <input type="number" className='input' placeholder='Enter Amount' onChange={(e) => setOneTokenAmount(e.target.value)} />
              <Button variant="contained" disabled={isDisabled} size="small" onClick={oneMonthStake}>Stake Coins</Button>
            </div>
          </span>
          <span className='icon--status'>
            <SavingsIcon className='icon--card' style={iconStyle} />
            <span className='icon--about'>3 month's 10% APY</span>
            <div className="stake-money-input">
              <input type="number" className='input' placeholder='Enter Amount' onChange={(e) => setThreeTokenAmount(e.target.value)} />
              <Button variant="contained" disabled={isDisabled} size="small" onClick={threeMonthStake}>Stake Coins</Button>
            </div>
          </span>
          <span className='icon--status'>
            <AccountBalanceIcon className='icon--card' style={iconStyle} />
            <span className='icon--about'>6 month's 12% APY</span>
            <div className="stake-money-input">
              <input type="number" className='input' placeholder='Enter Amount' onChange={(e) => setSixTokenAmount(e.target.value)} />
              <Button variant="contained" disabled={isDisabled} size="small" onClick={sixMonthStake}>Stake Coins</Button>
            </div>
          </span>
        </div>
        
      </div>

        <Button variant="contained" disabled={fetchDisabled} onClick={getAllPositions}>🪙Fetch🚀</Button>

      <div className="satcked-content">
        <div className="about-token">
          <span className='about'>Token Id</span>
          <span className='about'>Token Staked</span>
          <span className='about'>Percent Interest</span>
          <span className='about'>Days Remaining</span>
          <span className='about'>Withdraw</span>
        </div>
        <div className="stakign--about">
        {data.map(item => {
          return (
            <Model
              key = {item.positionId}
              tokenStaked = {item.tokenStaked}
              percentInterest = {item.percentInterest}
              positionId = {item.positionId}
              tokenInterest = {item.tokenInterest}
              startDate={item.createTime}
              endDate={item.unlockTime}
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
