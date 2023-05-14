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

  const sendEth = async(recipient, amount, user_id, creator_id) =>{
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
      // add to txn history
      await addTransaction(user_id, creator_id, amount, "ETH", transaction.hash)
      // add to threshold
      await addThreshold(user_id, creator_id, amount, "ETH")
      alert(`Transaction Completed! View Transaction at https://sepolia.etherscan.io/tx/${transaction.hash}`)
    } catch(err){
      alert(`${err.message}`)
    }
  }

  const sendErc20 = async(recipient, token, amount, user_id, creator_id) =>{
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
      // add to txn history
      await addTransaction(user_id, creator_id, amount, token, result.transactionHash)
      // add to threshold
      await addThreshold(user_id, creator_id, amount, token)
      alert(`Transaction Completed! View Transaction at https://sepolia.etherscan.io/tx/${result.transactionHash}`)
    } catch(err){
      alert(`${err.message}`)
    }
  }

  const addTransaction = async(user_id, creator_id, amount, asset, trasaction_hash)=>{
    try{
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/transactions/create`,{
          user_id: user_id,
          creator_id: creator_id,
          amount: amount,
          asset: asset,
          transaction_hash:trasaction_hash
        }).then((response)=>{
          console.log(response.data)
        })
      } catch(err){
        console.log(err)
      }
  }

  const addThreshold = async (user_id, creator_id, amount, asset)=>{
    let currentETHPrice;
    let formattedAmount = amount
    if(asset !== "ETH"){
      console.log("noteth")
      axios.get(`https://api.coinbase.com/v2/prices/ETH-USD/spot`).then((response)=>{
        currentETHPrice = +response.data.data.amount
        formattedAmount = +amount
        formattedAmount = formattedAmount/currentETHPrice
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/thresholds/getOrCreate`,{
          user_id: user_id,
          creator_id: creator_id,
          amount: formattedAmount
        }).then((response)=>{
          console.log(response)
          if(response.data.total_contribution !== formattedAmount){
            const newTotal = response.data.total_contribution + formattedAmount
            console.log(newTotal)
            axios.put(`${process.env.REACT_APP_BACKEND_URL}/thresholds/edit/${user_id}/${creator_id}`,{
              newTotalAmount: newTotal
            }).then((response)=>{
              console.log(response)
            })
          }
        })    
      })
    } else{
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/thresholds/getOrCreate`,{
          user_id: user_id,
          creator_id: creator_id,
          amount: amount
        }).then((response)=>{
          console.log(response)
          if(response.data.total_contribution !== formattedAmount){
            const newTotal = response.data.total_contribution + amount
            console.log(newTotal)
            axios.put(`${process.env.REACT_APP_BACKEND_URL}/thresholds/edit/${user_id}/${creator_id}`,{
              newTotalAmount: newTotal
            }).then((response)=>{
              console.log(response)
            })
          }
        })    
      }
    
  }

  return(
    <TransactionContext.Provider value={{connectWallet, currentAccount, sendErc20, sendEth, user, setUser}}>
      {children}
    </TransactionContext.Provider>
  )
}