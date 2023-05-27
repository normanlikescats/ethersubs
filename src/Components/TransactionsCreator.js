import React, { useState, useEffect, useContext } from "react";
import { TransactionContext } from '../Context/EthersContext';
import { useNavigate } from "react-router";
import axios from "axios";
import Footer from './Footer'
import LoadingTxns from "./LoadingTxns";

export default function TransactionsCreator(){
  const navigate = useNavigate();
  const { dbUser, accessToken, isLoading, setLoading } = useContext(TransactionContext);
  const [creatorIdArr, setCreatorIdArr] = useState('')
  const [creatorTransactions, setcreatorTransactions] = useState('')
  console.log(dbUser)

  // Grab creator if any
  useEffect(()=>{
    if(dbUser && dbUser.creator){
      setLoading(true)
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
  },[dbUser, setLoading])

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
        setLoading(false)
        setcreatorTransactions(response.data)
      })
    }
  },[creatorIdArr, accessToken, setLoading])

  function toggleUserMode(){
    navigate(`/history/user`)
  }

  function handleProfile(id){
    navigate(`/profile/${id}`)
  }

  function handleCreator(id){
    navigate(`/creator/${id}`)
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
    <div className="flex flex-col items-center">
      <div className="flex flex-col px-3 md:px-12 lg:px-24 pt-12 pb-12 rounded-2xl bg-panel-blue/40 shadow-xl "> 
        <div className="flex grow flex-row justify-between content-center">
          <h1 className="font-lilita text-3xl 2xl:text-5xl xl:text-4xl">Transaction History</h1>
          <button onClick={toggleUserMode} className="p-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">User View</button>
        </div>
        {isLoading?
          <LoadingTxns/>:
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
              {creatorTransactionItems ? creatorTransactionItems : null}
            </tbody>
          </table>
        }
      </div>
      <Footer/>
    </div>
  )
}