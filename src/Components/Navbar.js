import { Link, useLocation } from "react-router-dom";
import { useContext } from 'react';
import { TransactionContext } from '../Context/EthersContext';
import { MdOutlineAccountBalanceWallet } from "react-icons/md"
import logo from "../Images/ethersubslogo.png"

export default function Navbar() {
  const {user, currentAccount, connectWallet} = useContext(TransactionContext)
  const pathname = useLocation().pathname.split("/")[1];
  let appNavbar;
  if(pathname === "" || pathname === "about"){
    appNavbar = false    
  } else{
    appNavbar = true
  }
  let truncAccount;
  if(currentAccount){
    truncAccount = `${currentAccount.slice(0, 5)}...${currentAccount.slice(-4)}`;
  }

  return (
    <div className="z-50 px-8 pt-3 absolute top-0 flex justify-between items-center w-full">
      {!appNavbar ?
        <>
          <Link to="/">
            <img src={logo} alt="EtherSubs"  className="h-16 hover:animate-float"/>
          </Link>
          <Link className="p-2 font-raleway text-base lg:text-l border-transparent border-2 rounded-lg box-border transition ease-in-out duration-300 hover:border-solid hover:border-2 hover:border-white" to="/about">
            About
          </Link>
          <a className="p-2 font-raleway text-base lg:text-l border-transparent border-2 rounded-lg box-border transition ease-in-out duration-300 hover:border-solid hover:border-2 hover:border-white" href="https://github.com/normanlikescats/ethersubs-frontend" target="blank">
            Protocol
          </a>
          <Link to="/app">
          <button className="font-raleway text-base lg:text-l bg-button-green p-2 rounded-lg hover:bg-button-hover transition ease-in-out duration-500">
            Enter App
          </button>
          </Link>   
        </>
      :
      <>
        <Link to="/">
          <img src={logo} alt="EtherSubs"  className="h-16 hover:animate-float"/>
        </Link>
        <Link className="p-2 font-raleway text-base lg:text-l border-transparent border-2 rounded-lg box-border transition ease-in-out duration-300 hover:border-solid hover:border-2 hover:border-white" to="/app">
            Creators
        </Link>
        <Link className="p-2 font-raleway text-base lg:text-l border-transparent border-2 rounded-lg box-border transition ease-in-out duration-300 hover:border-solid hover:border-2 hover:border-white" to="/history">
            History
        </Link>
        {
          user ? 
          <Link className="p-2 font-raleway text-base lg:text-l border-transparent border-2 rounded-lg box-border transition ease-in-out duration-300 hover:border-solid hover:border-2 hover:border-white" to={`/profile/${user.id}`}>
              Profile
          </Link> :
          null
        }
        <button onClick={connectWallet} className="flex flex-row items-center justify-between font-raleway text-base lg:text-l bg-button-green p-2 rounded-lg hover:bg-button-hover transition ease-in-out duration-500">
            <MdOutlineAccountBalanceWallet className="w-4 h-4 mr-1"/> {currentAccount ? truncAccount : "Connect Wallet"}
        </button>
      </>
      }  
    </div>
  );
}
