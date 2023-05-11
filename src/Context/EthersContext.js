import React, {useContext, useEffect, useState} from "react";
import {
  usdcAddress,
  usdcABI,
  usdcDecimals,
  daiAddress,
  daiABI,
  daiDecimals,
  usdtAddress,
  usdtABI,
  usdtDecimals
} from "../constants.js"
import axios from "axios";
const ethers = require("ethers")


export const TransactionContext = React.createContext()

const { ethereum } = window;

const wallet = new ethers.providers.Web3Provider(ethereum);
const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_ALCHEMY_ENDPOINT);
const signer = wallet.getSigner();

export const TransactionProvider = ({children}) =>{
  const [ currentAccount, setCurrentAccount ] = useState('');
  const [ user, setUser ] = useState('');
  const [ isLoading, setIsLoading ] = useState(false);
  
  useEffect(()=>{
    IsConnected();
  },[])
  
  const IsConnected = async () => {
    try{
      if(!ethereum) return alert("Please install Metamask")

      const accounts =  await ethereum.request({method: 'eth_accounts'});
    
      if(accounts.length){
        setCurrentAccount(accounts[0]);
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/users`,{
          wallet: accounts[0]
        }).then((response)=>{
          console.log(`pull user data: ${response.data}`)
          setUser(response.data)
        })
      }      
    } catch(error){
      console.log(error)
      throw new Error("No Ethereum Object")
    }
  }

  const connectWallet = async () =>{
    try{
      if (!ethereum)return alert("Please install Metamask")
      const accounts =  await ethereum.request({method: 'eth_requestAccounts'});
      const wallet = accounts[0]
      setCurrentAccount(wallet);
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/users`,{
        wallet: accounts[0]
      }).then((response)=>{
        console.log(`pull user data: ${response.data}`)
        setUser(response.data)
      })
    } catch(error){
      console.log(error)
      throw new Error("No Ethereum Object")
    }
  }

  const sendEth = async(recipient, amount) =>{
    const gas_price = await provider.getGasPrice();
    const tx = {
      from: currentAccount,
      to: recipient,
      value: ethers.utils.parseEther(String(amount)),
      nonce: provider.getTransactionCount(currentAccount,"latest"),
      gasLimit: ethers.utils.hexlify(0x100000),
      gasPrice: gas_price,
    }
    try{
      const transaction = await signer.sendTransaction(tx)
      const receipt = await provider.waitForTransaction(transaction.hash)
      console.log(receipt)
      alert(`Transaction Completed! View Transaction at https://sepolia.etherscan.io/tx/${transaction.hash}`)
    } catch(err){
      alert(`${err.message}`)
    }
  }

  const sendErc20 = async(recipient, token, amount) =>{
    let contractAddress;
    let abi;
    let decimals;
    if(token === "DAI"){
      contractAddress = daiAddress;
      abi = daiABI;
      decimals = daiDecimals;      
    } else if (token === "USDT"){
      contractAddress = usdtAddress;
      abi = usdtABI;
      decimals = usdtDecimals; 
    } else if (token === "USDC"){
      contractAddress = usdcAddress;
      abi = usdcABI;  
      decimals = usdcDecimals; 
    }
    const parsedAmount = ethers.utils.parseUnits(amount, decimals)
    const contract = new ethers.Contract(contractAddress, abi, signer);
    try{
      const tx = await contract.transfer(recipient, parsedAmount)
      const hash = tx.hash
      console.log(hash)
      const result = await provider.waitForTransaction(hash)
      alert(`Transaction Completed! View Transaction at https://sepolia.etherscan.io/tx/${result.transactionHash}`)
    } catch(err){
      alert(`${err.message}`)
    }
  }


  console.log(`Account: ${currentAccount}`)
  return(
    <TransactionContext.Provider value={{connectWallet, currentAccount, sendErc20, sendEth, user}}>
      {children}
    </TransactionContext.Provider>
  )
}