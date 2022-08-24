import './App.css';
import React, { useState, useEffect } from 'react';

function App() {

  const [signerAddress, setSignerAddress] = useState("")
  const [logedIn, isLogedIn] = useState(false)


  const connectWallet = async () => {
    try {
      if (typeof window.ethereum !== 'undefined') {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const Address = await signer.getAddress()
        setSignerAddress(Address)
        console.log(signerAddress)
      }
      isLogedIn(true)
    } catch (error) {
      console.log("Connect Wallet: ", error)
    }
  }

  useEffect(() => {
    const Asset = async () => {
      const tokenSymbol = "DANK"    // Token Symbol
      const tokenDecimals = 5 
      try {
        const wasAdded = window.ethereum.request({
          method: 'wallet_watchAsset',
          params: {
            type: 'ERC20', 
            options: {
              address: deployAddress, 
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


  return (
    <div className="App">
      <div className="connect-wallet">
        <button onClick={connectWallet}>Connect Wallet</button>
      </div>
      <div className="faucet">
        <button>Faucet</button>
        <input type="text" name="" id="" />
      </div>
    </div>
  );
}

export default App;
