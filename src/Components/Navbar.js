import { Link, useLocation } from "react-router-dom"
import { useContext, useState, useEffect } from 'react'
import { TransactionContext } from '../Context/EthersContext'
import { MdOutlineAccountBalanceWallet } from "react-icons/md"
import { GiHamburgerMenu } from 'react-icons/gi'
import { FaArrowRight } from 'react-icons/fa'
import { CgProfile } from 'react-icons/cg'
import { BiLogInCircle } from 'react-icons/bi'
import { AiOutlineHome, AiOutlineHistory, AiOutlineInfoCircle, AiOutlineCodeSandbox } from 'react-icons/ai'
import logo from "../Images/ethersubslogo.png"


export default function Navbar() {
  const {dbUser, connectWallet, logout} = useContext(TransactionContext)
  const [sidebar, setSidebar] = useState('')
  const [navbarCSS, setNavbarCSS] = useState("z-50 fixed top-0 w-full")
  const pathname = useLocation().pathname.split("/")[1];
  
  useEffect(() => {
    window.addEventListener('scroll', function() {
      const currentScrollPos = window.pageYOffset;
      if (currentScrollPos > 0) {
        setNavbarCSS("z-50 fixed top-0 w-full bg-bg-purple/40 backdrop-blur-lg")
      } else {
        setNavbarCSS("z-50 fixed top-0 w-full")
      }
    });
  }, [])

  let appNavbar;
  if(pathname === "" || pathname === "about"){
    appNavbar = false    
  } else{
    appNavbar = true
  }
  
  let truncAccount;
  if(dbUser){
    truncAccount = `${dbUser.wallet.slice(0, 5)}...${dbUser.wallet.slice(-4)}`;
  }

  function handleSidebar(){
    setSidebar(true)
  }

  function handleSidebarClose(){
    setSidebar(false)
  }

  return (
    <div className={navbarCSS} id="navbar">
      <div className="hidden px-12 lg:px-16 py-2 justify-between items-center md:flex">
        {!appNavbar ?
          <>
            <Link to="/">
              <img src={logo} alt="EtherSubs"  className="h-16 hover:animate-float"/>
            </Link>
            <Link className="p-2 font-raleway text-base border-transparent border-2 rounded-lg box-border transition ease-in-out duration-300 hover:border-solid hover:border-2 hover:border-white" to="/about">
              About
            </Link>
            <a className="p-2 font-raleway text-base border-transparent border-2 rounded-lg box-border transition ease-in-out duration-300 hover:border-solid hover:border-2 hover:border-white" href="https://github.com/normanlikescats/ethersubs-frontend" target="blank">
              Protocol
            </a>
            <Link to="/home">
            <button className="font-raleway text-base bg-button-green p-2 rounded-lg hover:bg-button-hover transition ease-in-out duration-500">
              Enter App
            </button>
            </Link>   
          </>
        :
        <>
          <Link to="/">
            <img src={logo} alt="EtherSubs"  className="h-16 hover:animate-float"/>
          </Link>
          <Link className="p-2 font-raleway text-base border-transparent border-2 rounded-lg box-border transition ease-in-out duration-300 hover:border-solid hover:border-2 hover:border-white" to="/home">
              Creators
          </Link>
          <Link className="p-2 font-raleway text-base border-transparent border-2 rounded-lg box-border transition ease-in-out duration-300 hover:border-solid hover:border-2 hover:border-white" to="/history/user">
              History
          </Link>
          {
            dbUser ? 
            <>
              <Link className="p-2 font-raleway text-base border-transparent border-2 rounded-lg box-border transition ease-in-out duration-300 hover:border-solid hover:border-2 hover:border-white" to={`/profile/${dbUser.id}`}>
                  Profile
              </Link> 
              <button className="flex flex-row items-center justify-between font-raleway text-base bg-button-green p-2 rounded-lg hover:bg-button-hover transition ease-in-out duration-500" onClick={()=>logout({ logoutParams: { 
                  returnTo: "https://ethersubs.netlify.app/home"
                  //returnTo: "http://localhost:3000/home"
                }})}>
                <MdOutlineAccountBalanceWallet className="w-4 h-4 mr-1"/><p>{truncAccount}</p>
              </button>
            </>
            :
            <button onClick={connectWallet} className="flex flex-row items-center justify-between font-raleway text-base bg-button-green p-2 rounded-lg hover:bg-button-hover transition ease-in-out duration-500">
              <MdOutlineAccountBalanceWallet className="w-4 h-4 mr-1"/> Connect Wallet
            </button>
          }        
        </>
        }  
      </div>
      <div className="flex justify-between items-stretch md:hidden">
        <Link className="pl-8" to="/">
          <img src={logo} alt="EtherSubs"  className="h-16 my-2 hover:animate-float"/>
        </Link>
        <div>
            <GiHamburgerMenu onClick={handleSidebar} className="h-12 w-12 hover:animate-float mr-8 mt-4"/>
            <div className={`flex flex-col top-0 right-0 bg-panel-blue fixed h-full w-5/12 transition ease-in-out duration-300 shadow:md ${sidebar ? "translate-x-0 " : "translate-x-full"}`}>
              <FaArrowRight className="text-white ml-6 mt-5 mb-4 h-8 w-8 hover:cursor-pointer" onClick={handleSidebarClose}/>
              {!appNavbar ?        
                <div className="flex flex-col text-left">
                  <Link className="flex flex-row items-center m-1 py-3 px-5 font-raleway text-lg hover:bg-bg-blue/60 rounded-md" onClick={handleSidebarClose} to="/about">
                    <AiOutlineInfoCircle className="w-5 h-5 mr-2"/> About
                  </Link>
                  <a className="flex flex-row items-center m-1 py-3 px-5 font-raleway text-lg hover:bg-bg-blue/60 rounded-md" href="https://github.com/normanlikescats/ethersubs-frontend" target="blank">
                    <AiOutlineCodeSandbox className="w-5 h-5 mr-2"/> Protocol
                  </a>
                  <Link className="flex flex-row items-center m-1 py-3 px-5 font-raleway text-lg hover:bg-bg-blue/60 rounded-md" onClick={handleSidebarClose} to="/home">
                    <BiLogInCircle className="w-5 h-5 mr-2"/> Enter App
                  </Link>
                </div> : 
                <div className="flex flex-col text-left">
                  <Link className="flex flex-row items-center m-1 py-3 px-5 font-raleway text-lg hover:bg-bg-blue/60 rounded-md" onClick={handleSidebarClose} to="/home">
                    <AiOutlineHome className="w-5 h-5 mr-2"/> Creators
                  </Link>
                  <Link className="flex flex-row items-center m-1 py-3 px-5 font-raleway text-lg hover:bg-bg-blue/60 rounded-md" onClick={handleSidebarClose} to="/history/user">
                    <AiOutlineHistory className="w-5 h-5 mr-2"/> History
                  </Link>
                  {
                    dbUser ? 
                    <>
                      <Link onClick={handleSidebarClose} className="flex flex-row items-center m-1 py-3 px-5 font-raleway text-lg hover:bg-bg-blue/60 rounded-md" to={`/profile/${dbUser.id}`}>
                          <CgProfile className="w-5 h-5 mr-2"/>Profile
                      </Link> 
                      <button className="flex flex-row items-center justify-start m-1 py-3 px-5 font-raleway text-lg hover:bg-bg-blue/60 rounded-md" onClick={()=>logout({ logoutParams: { 
                          returnTo: "http://localhost:3000/home"
                          //returnTo: "https://ethersubs.netlify.app/home"
                        }})}>
                        <MdOutlineAccountBalanceWallet className="w-5 h-5 mr-2"/><p>{truncAccount}</p>
                      </button>
                    </>
                    :
                    <button onClick={connectWallet} className="flex flex-row items-center justify-start m-1 py-3 px-5 font-raleway text-lg hover:bg-bg-blue/60 rounded-md">
                      <MdOutlineAccountBalanceWallet className="w-5 h-5 mr-2"/> Connect Wallet
                    </button>
                  }                     
                </div>
                }
              </div>
        </div>
      </div>
    </div>
  );
}
