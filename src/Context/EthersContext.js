import React, {useEffect, useState} from "react";
import { useAuth0 } from '@auth0/auth0-react'
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
  const { user, loginWithRedirect, getAccessTokenSilently, isAuthenticated, logout } = useAuth0();
  const [ currentAccount, setCurrentAccount ] = useState('');
  const [ dbUser, setDbUser ] = useState('');
  const [ accessToken, setAccessToken ] = useState('')
  
  /*useEffect(()=>{
    IsConnected();
  },[])*/

  useEffect(()=>{
    if(isAuthenticated){
      console.log("hi user!")
      let token = getAccessTokenSilently({
        audience: "http://ethersubs/api",
        scope: "openid profile email phone",
      }).then((response)=>{
        console.log(response)
        console.log(token)
        setAccessToken(response)
        console.log(user)
        console.log(response)
        const accounts = ethereum.request({method: 'eth_requestAccounts'}).then(()=>{
          const wallet = accounts[0]
          try{
            console.log("get user")
            axios.post(`${process.env.REACT_APP_BACKEND_URL}/users`,{
              wallet: wallet
            },
            {
              headers: {
                Authorization: `Bearer ${response}`,
              }
            }).then((response)=>{
              console.log(`pull user data: ${response.data}`)
              setDbUser(response.data)
            })
          }catch(err){
            console.log(err)
          }
        })
      });  
    }
  },[isAuthenticated, getAccessTokenSilently, user])
  
  /*const IsConnected = async () => {
    try{
      if(!ethereum) return alert("Please install Metamask")

      const accounts =  await ethereum.request({method: 'eth_accounts'});
    
      if(accounts.length){
        setCurrentAccount(accounts[0]);
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/users`,{
          wallet: accounts[0]
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }).then((response)=>{
          console.log(`pull user data: ${response.data}`)
          setDbUser(response.data)
        })
      }      
    } catch(error){
      console.log(error)
      throw new Error("No Ethereum Object")
    }
  }*/

  const connectWallet = async () =>{
    try{
      if (!ethereum)return alert("Please install Metamask")
      const accounts =  await ethereum.request({method: 'eth_requestAccounts'});
      const wallet = accounts[0]
      setCurrentAccount(wallet);
      await loginWithRedirect({
            redirectUri: `https://ethersubs.netlify.app/app`,
        });
    } catch(error){
      console.log(error)
      throw new Error("No Ethereum Object")
    }
  }

  /*const getUser= async (response)=> {
    console.log(user)
    console.log(response)
    const accounts =  await ethereum.request({method: 'eth_requestAccounts'});
    const wallet = accounts[0]
    try{
      console.log("get user")
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/users`,{
        wallet: wallet
      },
      {
        headers: {
          Authorization: `Bearer ${response}`,
        }
      }).then((response)=>{
        console.log(`pull user data: ${response.data}`)
        setDbUser(response.data)
      })
    }catch(err){
      console.log(err)
    }
  }*/

  const sendEth = async(recipient, amount, user_id, creator_id) =>{
    //const gas_price = await provider.getGasPrice();
    const formattedAddress = await ethers.utils.isAddress(recipient)
    console.log(formattedAddress)
    const tx = {
      to: recipient,
      value: ethers.utils.parseEther(String(amount)),
      /*nonce: provider.getTransactionCount(currentAccount,"latest"),
      gasLimit: ethers.utils.hexlify(0x100000),
      gasPrice: gas_price,*/
    }
    console.log(tx)
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
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
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
        },{
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }).then((response)=>{
          console.log(response)
          if(response.data.created === false){
            const newTotal = response.data.threshold.total_contribution + formattedAmount
            console.log(newTotal)
            axios.put(`${process.env.REACT_APP_BACKEND_URL}/thresholds/edit/${user_id}/${creator_id}`,{
              newTotalAmount: newTotal
            },{
              headers: {
                Authorization: `Bearer ${accessToken}`,
              }
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
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }).then((response)=>{
          console.log(response)
          if(response.data.created === false){
            const newTotal = response.data.threshold.total_contribution + amount
            console.log(newTotal)
            axios.put(`${process.env.REACT_APP_BACKEND_URL}/thresholds/edit/${user_id}/${creator_id}`,{
              newTotalAmount: newTotal
            },
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              }
            }).then((response)=>{
              console.log(response)
            })
          }
        })    
      }
    
  }

  console.log(dbUser)
  console.log(accessToken)
  return(
    <TransactionContext.Provider value={{connectWallet, currentAccount, sendErc20, sendEth, dbUser, setDbUser, accessToken, logout}}>
      {children}
    </TransactionContext.Provider>
  )
}