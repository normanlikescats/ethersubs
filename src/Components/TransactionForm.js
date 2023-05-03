import React from 'react';
import { useState, useEffect, useContext } from 'react';
import { TransactionContext } from '../Context/EthersContext';


export default function TransactionForm() {
  const {connectWallet} = useContext(TransactionContext)
    const { currentAccount, formData, setFormData, handleChange, sendErc20 } = useContext(TransactionContext)
    
    function handleSubmit(e){
      e.preventDefault();

      const { address, amount } = formData;
      if (!address || !amount ) return;
      console.log(amount)
      console.log(address)
      sendErc20();
    }

    return(
      <div>
        <button onClick={connectWallet}>{currentAccount? `${currentAccount}` : "Connect Wallet"}</button>
        <h1>Send some monehhhh</h1>
        <form onSubmit={handleSubmit}>
          <label>Address:</label>
          <input type="text" name="address" onChange={(e)=>handleChange(e, "address")}/>
          <label>Amount:</label>
          <input type="text" name="amount" onChange={(e)=>handleChange(e, "amount")}/>
          <input type="submit" value="SEND IT"/>
        </form>
      </div>
    )
  }
