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
const ethers = require("ethers")


export const TransactionContext = React.createContext()

const { ethereum } = window;

const wallet = new ethers.providers.Web3Provider(ethereum);
const provider = new ethers.providers.JsonRpcProvider(process.env.ALCHEMY_ENDPOINT);
const signer = wallet.getSigner();

export const TransactionProvider = ({children}) =>{
  const[currentAccount, setCurrentAccount] = useState('');
  const[formData, setFormData] = useState({
    address:'',
    amount: ''
  })
  const[isLoading, setIsLoading] = useState(false);
  
  useEffect(()=>{
    IsConnected();
  },[])

  const handleChange = (e, name) =>{
    setFormData((prev)=>({...prev, 
      [name]: e.target.value
    }))
    console.log(formData)
  }
  
  const IsConnected = async () => {
    try{
      if(!ethereum) return alert("Please install Metamask")

      const accounts =  await ethereum.request({method: 'eth_accounts'});
    
      if(accounts.length){
        setCurrentAccount(accounts[0]);
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
      setCurrentAccount(accounts[0]);
    } catch(error){
      console.log(error)
      throw new Error("No Ethereum Object")
    }
  }

  const sendEth = async() =>{

  }

  const sendErc20 = async() =>{
    const { address, amount } = formData;
    let contractAddress = usdtAddress;
    let abi = usdtABI;
    let hash;
    console.log(usdtDecimals)
    const parsedAmount = ethers.utils.parseUnits(amount, usdtDecimals)
    /*if(token === "DAI"){
      contractAddress = daiAddress;
      abi = daiABI;      
    } else if (token === "USDT"){
      contractAddress = usdtAddress;
      abi = usdtABI;  
    } else if (token === "USDC"){
      contractAddress = usdcAddress;
      abi = usdcABI;  
    }*/
    console.log(parsedAmount)
    const contract = new ethers.Contract(contractAddress, abi, signer);
    const tx = contract.transfer(address, parsedAmount).then((response)=>{
      hash = response.hash
      checkStatus(hash)
    })
  }

  const checkStatus = async(hash)=>{
    console.log(hash)
    let result = await wallet.waitForTransaction(hash)
    alert(`Transaction Completed! View Transaction at https://sepolia.etherscan.io/tx/${result.transactionHash}`)
  }


  console.log(`Account: ${currentAccount}`)
  return(
    <TransactionContext.Provider value={{connectWallet, currentAccount, formData, setFormData, handleChange, sendErc20, isLoading}}>
      {children}
    </TransactionContext.Provider>
  )
}