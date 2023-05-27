import React, { useState, useEffect, useContext } from "react";
import { TransactionContext } from '../Context/EthersContext';
import { useNavigate } from "react-router";
import axios from "axios";
import Footer from './Footer'
import LoadingTxns from "./LoadingTxns";

export default function Transactions(){
  const navigate = useNavigate();
  const { dbUser, accessToken, isLoading, setLoading } = useContext(TransactionContext);
  const [display, setDisplay] = useState('')
  const [userTransactions, setUserTransactions] = useState('')
  console.log(dbUser)
  
  // Grab user transactions
  useEffect(()=>{
    if(dbUser){
      setLoading(true)
      setDisplay(<LoadingTxns/>)
      try{
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/transactions/user/${dbUser.id}`,{
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }).then((response)=>{
          console.log(response.data)
          setLoading(false)
          setUserTransactions(response.data)
        })
      } catch (err){
        console.log(err)
      }
    } else(
      setDisplay(<p className="my-12">Connect your wallet to view your transactions!</p>)
    )
  },[dbUser, accessToken, setLoading])

  function toggleUserMode(){
    navigate(`/history/creator`)
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

  return(
    <div className="flex flex-col items-center">
      <div className="flex flex-col px-3 md:px-12 lg:px-24 pt-12 pb-12 mb-20 rounded-2xl bg-panel-blue/40 shadow-xl"> 
        <div className="flex grow flex-row justify-between content-center">
          <h1 className="font-lilita text-3xl 2xl:text-5xl xl:text-4xl">Transaction History</h1>
          {dbUser.creator ? <button onClick={toggleUserMode} className="p-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">Creator View</button> : null}
        </div>
        {isLoading || !dbUser ?
          display:
          <table className="table-fixed border border-white my-3">
            <thead>
              <tr>
                <th className="bg-black/20 border border-white py-2 px-8">Sender</th>
                <th className="bg-black/20 border border-white py-2 px-8">Recipient</th>
                <th className="bg-black/20 border border-white py-2 px-5">Asset</th>
                <th className="bg-black/20 border border-white py-2 px-5">Amount</th>
                <th className="bg-black/20 border border-white py-2 px-8">Date</th>
                <th className="bg-black/20 border border-white py-2 px-5">Transaction Hash</th>
              </tr>
            </thead>
            <tbody>
              {userTransactionItems ? userTransactionItems : null}
            </tbody>
          </table>
        } 
      </div>
      <Footer/>
    </div>
  )
}