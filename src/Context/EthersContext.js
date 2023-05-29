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
import { ToastContainer, toast } from 'react-toastify';
const ethers = require("ethers")


export const TransactionContext = React.createContext()

const { ethereum } = window;

const wallet = ((window.ethereum != null) ? new ethers.providers.Web3Provider(ethereum) : ethers.providers.getDefaultProvider());
const provider = new ethers.providers.JsonRpcProvider(process.env.REACT_APP_ALCHEMY_ENDPOINT);
let signer;
if(window.ethereum != null){
  signer = wallet.getSigner();
}

export const TransactionProvider = ({children}) =>{
  const { user, loginWithRedirect, getAccessTokenSilently, isAuthenticated, logout } = useAuth0();
  const [ currentAccount, setCurrentAccount ] = useState('');
  const [ dbUser, setDbUser ] = useState('');
  const [ accessToken, setAccessToken ] = useState('')
  const [ isLoading, setLoading ] = useState(false)
  const [ walletBalance, setWalletBalance ] = useState('')
  const [ ethBalance, setEthBalance ] = useState('')
  
  /*useEffect(()=>{
    const IsConnected= async()=>{
      try{
        console.log("is connected is running")
        if(!ethereum) return alert("Please install Metamask")

        const accounts =  await ethereum.request({method: 'eth_accounts'});
      
        if(accounts.length && accessToken){
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
            toast.success(`Welcome, ${response.data.display_name ? response.data.display_name : `${response.data.wallet.slice(0,5)}...${response.data.wallet.slice(-4)}`}!`, {
                position: "top-center",
                autoClose: 5000
            });
          })
        }      
      } catch(error){
        console.log(error)
        throw new Error("No Ethereum Object")
      }
    };
    IsConnected();
  },[accessToken])*/

  useEffect(()=>{
    if(isAuthenticated){
      let token = getAccessTokenSilently({
        audience: "http://ethersubs/api",
        scope: "openid profile email phone",
      }).then((response)=>{
        console.log(response)
        console.log(token)
        setAccessToken(response)
        const getUser = async ()=>{
          const accounts = await ethereum.request({method: 'eth_requestAccounts'})
          const wallet = accounts[0]
          console.log(accounts)
          console.log(wallet)
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
              toast.success(`Welcome, ${response.data.display_name ? response.data.display_name : `${response.data.wallet.slice(0,5)}...${response.data.wallet.slice(-4)}`}!`, {
                position: "top-center",
                autoClose: 5000
              });
            })
          }catch(err){
            console.log(err)
          }
        }
        getUser();
      }) 
    }
  },[isAuthenticated, getAccessTokenSilently, user])

  const connectWallet = async () =>{
    try{
      if (!ethereum)return alert("Please install Metamask")
      const accounts =  await ethereum.request({method: 'eth_requestAccounts'});
      const wallet = accounts[0]
      setCurrentAccount(wallet);
      await loginWithRedirect({
            //redirectUri: `https://ethersubs.netlify.app/app`,
            redirectUri: `http://localhost:3000/app`,
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

  const getWalletBalance = async(token)=>{
    if(token !== "ETH"){
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
      const contract = new ethers.Contract(contractAddress, abi, signer);
      const balance = ((await contract.balanceOf(dbUser.wallet)/10**decimals).toString());
      setWalletBalance(parseFloat(balance))
    } else {
      const balance = await provider.getBalance(dbUser.wallet)
      setEthBalance(parseFloat(balance/10**18).toString().slice(0,5))
    }
  }

  const sendEth = async(recipient, amount, user_id, creator_id, threshold) =>{
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
      const loadingToast = toast.loading(`Transaction pending...`, {
        position: "top-center",
        autoClose: 5000
      });
      const receipt = await provider.waitForTransaction(transaction.hash)
      console.log(receipt)
      // add to txn history
      await addTransaction(user_id, creator_id, amount, "ETH", transaction.hash)
      // add to threshold
      await addThreshold(user_id, creator_id, amount, "ETH", threshold)
      toast.dismiss(loadingToast)
      toast.success("Transaction completed!",{
        position: "top-center",
        autoClose: 5000
      })
    } catch(err){
      toast.error(`${err.message}`, {
        position: "top-center",
        autoClose: 5000
      });
    }
  }

  const sendErc20 = async(recipient, token, amount, user_id, creator_id, threshold) =>{
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
      const loadingToast = toast.loading(`Transaction pending...`, {
        position: "top-center",
        toastId: "transaction-toast",
        autoClose: 5000
      });
      const hash = tx.hash
      console.log(hash)
      const result = await provider.waitForTransaction(hash)
      // add to txn history
      await addTransaction(user_id, creator_id, amount, token, result.transactionHash)
      // add to threshold
      await addThreshold(user_id, creator_id, amount, token, threshold)
      toast.dismiss(loadingToast)
      toast.success("Transaction completed!",{
        position: "top-center",
        autoClose: 5000
      })
    } catch(err){
      toast.error(`${err.message}`, {
        position: "top-center",
        autoClose: 5000
      });
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

  const addThreshold = async (user_id, creator_id, amount, asset, threshold)=>{
    let currentETHPrice;
    let formattedAmount = +amount
    if(asset !== "ETH"){
      axios.get(`https://api.coinbase.com/v2/prices/ETH-USD/spot`).then((response)=>{
        currentETHPrice = +response.data.data.amount
        formattedAmount = +amount
        formattedAmount = formattedAmount/currentETHPrice
        const status = formattedAmount > threshold
        console.log(status)
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/thresholds/getOrCreate`,{
          user_id: user_id,
          creator_id: creator_id,
          amount: formattedAmount,
          status: status 
        },{
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }).then((response)=>{
          console.log(response)
          if(response.data.created === false){
            console.log(typeof response.data.threshold.total_contribution)
            console.log(typeof response.data.threshold.formattedAmount)
            console.log(typeof formattedAmount/1.0)
            const newTotal = response.data.threshold.total_contribution + formattedAmount
            const updatedStatus = newTotal > threshold
            console.log(newTotal)
            axios.put(`${process.env.REACT_APP_BACKEND_URL}/thresholds/edit/${user_id}/${creator_id}`,{
              newTotalAmount: newTotal,
              status: updatedStatus
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
      const status = formattedAmount > threshold
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/thresholds/getOrCreate`,{
          user_id: user_id,
          creator_id: creator_id,
          amount: formattedAmount,
          status: status
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }).then((response)=>{
          console.log(response)
          if(response.data.created === false){
            const newTotal = response.data.threshold.total_contribution + formattedAmount
            const updatedStatus = newTotal > threshold
            console.log(newTotal)
            axios.put(`${process.env.REACT_APP_BACKEND_URL}/thresholds/edit/${user_id}/${creator_id}`,{
              newTotalAmount: newTotal,
              status: updatedStatus
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
    <TransactionContext.Provider value={{connectWallet, currentAccount, sendErc20, sendEth, dbUser, setDbUser, accessToken, logout, isLoading, setLoading, walletBalance, ethBalance, getWalletBalance}}>
      {children}
      <ToastContainer
        position="top-right"
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastStyle= {
          {
            color: '#474747',
            textAlign: "left",
            fontFamily: "raleway" 
          }
        }
        progressStyle = {{background: '#b1b1b1'}}
      />
    </TransactionContext.Provider>
  )
}