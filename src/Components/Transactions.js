import React, { useState, useEffect, useContext } from "react";
import { TransactionContext } from '../Context/EthersContext';
import { useNavigate } from "react-router";
import axios from "axios";

export default function Transactions(){
  const navigate = useNavigate();
  const { dbUser, accessToken } = useContext(TransactionContext);
  const [creatorIdArr, setCreatorIdArr] = useState('')
  const [userTransactions, setUserTransactions] = useState('')
  const [creatorTransactions, setcreatorTransactions] = useState('')
  const [userMode, setUserMode] = useState(true)
  console.log(dbUser)
  
  // Grab user transactions
  useEffect(()=>{
    if(dbUser){
      try{
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/transactions/user/${dbUser.id}`,{
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }).then((response)=>{
          console.log(response.data)
          setUserTransactions(response.data)
        })
      } catch (err){
        console.log(err)
      }
    }
  },[dbUser])

  // Grab creator if any
  useEffect(()=>{
    if(dbUser && dbUser.creator){
      try{
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/creators/user/${dbUser.id}`).then((response)=>{
          console.log(response.data)
          let creatorArr = [];
          for (let i = 0; i < response.data.length; i++){
            creatorArr.push(response.data[i].id)
          }
          setCreatorIdArr(creatorArr);
        })
      } catch (err){
        console.log(err)
      }
    }
  },[dbUser])

  // Grab Creator Transactions if any
  useEffect(()=>{
    if(creatorIdArr){
      console.log(creatorIdArr)
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/transactions/creator/${creatorIdArr.join("-")}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }).then((response)=>{
        console.log(response.data)
        setcreatorTransactions(response.data)
      })
    }
  },[creatorIdArr])

  function toggleUserMode(){
    setUserMode(()=>!userMode)
  }

  function handleProfile(id){
    navigate(`/profile/${id}`)
  }

  function handleCreator(id){
    navigate(`/creator/${id}`)
  }

  let userTransactionItems;
  if (userTransactions){
    userTransactionItems = userTransactions.map((transaction)=>{
      return(
        <tr>
          <td className="border border-white py-2 px-1 hover:text-hover-pink" onClick={()=>{handleProfile(transaction.user_id)}}>{ dbUser.display_name ? dbUser.display_name : `${dbUser.wallet.slice(0, 5)}...${dbUser.wallet.slice(-4)}`}</td>
          <td className="border border-white py-2 px-1 hover:text-hover-pink" onClick={()=>{handleCreator(transaction.creator_id)}}>{ transaction.creator.name }</td>
          <td className="border border-white py-2 px-1">{ transaction.asset }</td>
          <td className="border border-white py-2 px-1">{ transaction.amount }</td>
          <td className="border border-white py-2 px-1">{ new Date(transaction.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'long' }).split(",")[1] }</td>
          <td className="border border-white py-2 px-1"><a className="hover:text-hover-pink" href={`https://sepolia.etherscan.io/tx/${transaction.transaction_hash}`} target="blank">{`${transaction.transaction_hash.slice(0, 5)}...${transaction.transaction_hash.slice(-4)}`}</a></td>
        </tr>
      )
    })
  }

  let creatorTransactionItems;
  if (creatorTransactions){
    creatorTransactionItems = creatorTransactions.map((transaction)=>{
      return(
        <tr className="last:border-rounded-b-lg">
          <td className="border border-white py-2 px-1 hover:text-hover-pink" onClick={()=>{handleProfile(transaction.user_id)}}>{ transaction.user.display_name ? transaction.user.display_name : transaction.user.wallet }</td>
          <td className="border border-white py-2 px-1 hover:text-hover-pink" onClick={()=>{handleCreator(transaction.creator_id)}}>{ transaction.creator.name }</td>
          <td className="border border-white py-2 px-1">{ transaction.asset }</td>
          <td className="border border-white py-2 px-1">{ transaction.amount }</td>
          <td className="border border-white py-2 px-1">{ new Date(transaction.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'long' }).split(",")[1] }</td>
          <td className="border border-white py-2 px-1"><a className="hover:text-hover-pink" href={`https://sepolia.etherscan.io/tx/${transaction.transaction_hash}`} target="blank">{`${transaction.transaction_hash.slice(0, 5)}...${transaction.transaction_hash.slice(-4)}`}</a></td>
        </tr>
      )
    })
  }

  return(
    <div className="flex flex-col px-24 py-12 rounded-2xl bg-panel-blue/40 shadow-xl mx-32 mb-32"> 
      <div className="flex flex-row justify-between content-center">
        <h1 className="font-lilita text-3xl 2xl:text-5xl xl:text-4xl">Transaction History</h1>
        <button onClick={toggleUserMode} className="p-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">{userMode ? "Creator View": "User View" }</button>
      </div>
      <table className="table-fixed border border-white my-3">
        <thead>
          <tr className="rounded-lg">
            <th className="border border-white py-2 px-8">Sender</th>
            <th className="border border-white py-2 px-8">Recipient</th>
            <th className="border border-white py-2 px-5">Asset</th>
            <th className="border border-white py-2 px-5">Amount</th>
            <th className="border border-white py-2 px-8">Date</th>
            <th className="border border-white py-2 px-5">Transaction Hash</th>
          </tr>
        </thead>
        <tbody>
          {userMode ? userTransactionItems : creatorTransactionItems}
        </tbody>
      </table>
    </div>
  )
}