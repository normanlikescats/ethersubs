import React, { useState, useEffect, useContext } from "react";
import { TransactionContext } from '../Context/EthersContext';
import { useNavigate } from "react-router";
import axios from "axios";
import LoadingTxns from "./LoadingTxns";

export default function TransactionsCreator(){
  const navigate = useNavigate();
  const { dbUser, accessToken, isLoading, setLoading } = useContext(TransactionContext);
  const [creatorIdArr, setCreatorIdArr] = useState('')
  const [creatorTransactions, setcreatorTransactions] = useState('')

  // Grab creator if any
  useEffect(()=>{
    if(dbUser && dbUser.creator){
      setLoading(true)
      try{
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/creators/user/${dbUser.id}`).then((response)=>{
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
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/transactions/creator/${creatorIdArr.join("-")}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }).then((response)=>{
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
    creatorTransactionItems = creatorTransactions.map((transaction, id)=>{
      return(
        <tr key={id}>
          <td className="border border-3 border-white/30 py-2 px-1 hover:text-hover-pink whitespace-nowrap" onClick={()=>{handleProfile(transaction.user_id)}}>{ transaction.user.display_name ? transaction.user.display_name : transaction.user.wallet }</td>
          <td className="border border-3 border-white/30 py-2 px-1 hover:text-hover-pink whitespace-nowrap" onClick={()=>{handleCreator(transaction.creator_id)}}>{ transaction.creator.name }</td>
          <td className="border border-3 border-white/30 py-2 px-1 whitespace-nowrap">{ transaction.asset }</td>
          <td className="border border-3 border-white/30 py-2 px-1 whitespace-nowrap">{ transaction.amount }</td>
          <td className="border border-3 border-white/30 py-2 px-1 whitespace-nowrap">{ new Date(transaction.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', weekday: 'long' }).split(",")[1] }</td>
          <td className="border border-3 border-white/30 py-2 px-1 whitespace-nowrap"><a className="hover:text-hover-pink" href={`https://sepolia.etherscan.io/tx/${transaction.transaction_hash}`} target="blank">{`${transaction.transaction_hash.slice(0, 5)}...${transaction.transaction_hash.slice(-4)}`}</a></td>
        </tr>
      )
    })
  }

  return(
    <div className="absolute top-32 items-center bg-panel-blue/40 px-3 md:px-12 lg:px-20 pt-12 pb-12 mb-12 shadow-xl rounded-2xl w-10/12">
      <div className="flex flex-row justify-between content-center">
        <h1 className="font-lilita text-3xl 2xl:text-5xl xl:text-4xl text-left">Transaction History</h1>
        <button onClick={toggleUserMode} className="p-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">User View</button>
      </div>
      <div className="overflow-auto rounded-lg">
        {isLoading?
        <LoadingTxns/>:
        <div className="overflow-auto rounded-lg shadow">
          <table className="w-full border table-auto border-white/20 my-3">
            <thead>
              <tr>
                <th className="bg-black/20 border border-3 border-white/30 py-2 px-8">Sender</th>
                <th className="bg-black/20 border border-3 border-white/30 py-2 px-8">Recipient</th>
                <th className="bg-black/20 border border-3 border-white/30 py-2 px-5">Asset</th>
                <th className="bg-black/20 border border-3 border-white/30 py-2 px-5">Amount</th>
                <th className="bg-black/20 border border-3 border-white/30 py-2 px-8">Date</th>
                <th className="bg-black/20 border border-3 border-white/30 py-2 px-5">Transaction Hash</th>
              </tr>
            </thead>
            <tbody>
              {creatorTransactionItems ? creatorTransactionItems : null}
            </tbody>
          </table>
        </div>
        }
      </div>
    </div>  
  )
}