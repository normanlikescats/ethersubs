import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { TransactionContext } from '../Context/EthersContext';
import usdcIcon from "../Images/usdc.png";
import usdtIcon from "../Images/USDT.png";
import ethIcon from "../Images/eth.png";
import daiIcon from "../Images/dai.png";
import { GiCancel } from 'react-icons/gi'
import { BiEdit } from 'react-icons/bi'
import {
  SiSubstack,
  SiDiscord,
  SiYoutube,
  SiTwitter,
} from "react-icons/si"
import {
  SlGlobe,
  SlUserFollow,
  SlUserFollowing
} from "react-icons/sl";
import { FaEthereum } from "react-icons/fa";
import { AiOutlineDown } from "react-icons/ai"
import axios from "axios";
import PostList from "./PostList";
import { RiDeleteBinLine, RiErrorWarningLine } from 'react-icons/ri';
import { toast } from 'react-toastify';
import Footer from './Footer'
import Popup from 'reactjs-popup';

export default function Creator(){
  const navigate = useNavigate();
  const creator_id = useParams().id;
  const [creator, setCreator] = useState('');
  const [selectedOption, setSelectedOption] = useState({value: "ETH", img: ethIcon});
  const [customAmount, setCustomAmount] = useState('');
  const [follows, setFollows] = useState([])
  const [threshold, setThreshold] = useState(false)
  const { sendErc20, sendEth, dbUser, accessToken, getWalletBalance, walletBalance, ethBalance, isLoading, setLoading } = useContext(TransactionContext)

  // Pull Creator Data
  useEffect(()=>{
    setLoading(true)
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/creators/${creator_id}`).then((response)=>{
      setCreator(response.data[0])
      setLoading(false)
    })
  },[creator_id, setLoading])

  // Pull Threshold data
  useEffect(()=>{
    if(dbUser && creator){
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/thresholds/${dbUser.id}/${creator_id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }).then((response)=>{
        console.log(response.data)
        if(response.data[0].status){
          setThreshold(true)
        }
      })
    }
  },[dbUser, creator, accessToken, creator_id])

  // Pull follow data
  useEffect(()=>{
    if(dbUser && creator_id){
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/follows/one/${creator_id}/${dbUser.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }).then((response)=>{
        setFollows(response.data)
      })
    }
  },[dbUser, creator_id, accessToken])

  // Pull Wallet ETH Balance
  useEffect(()=>{
    if(dbUser){
      getWalletBalance("ETH")
    }
  })

  function handleFollow(){
    if(!dbUser){
      toast.error(`Please connect your wallet first!`, {
        autoClose: 5000,
        position: "top-center",
      });
    } else{
      try{
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/follows/create`, {
          user_id: dbUser.id,
          creator_id: creator.id
        },{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }).then((response)=>{
          setFollows(response.data)
        })
      } catch(err){
        console.log(err)
      }
    }
  }

  function handleUnfollow(){
    try{
      axios.delete(`${process.env.REACT_APP_BACKEND_URL}/follows/delete/${dbUser.id}/${creator_id}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    }).then((response)=>{
      console.log(response)
      setFollows([])
      })
    } catch(err){
      console.log(err)
    }
  }

  function handleETHPayment(tier){
    let amount;
    if(tier === 1){
      amount = creator.tier_1
    } else if(tier === 2){
      amount = creator.tier_2
    } else if(tier === 3){
      amount = creator.tier_3
    }
    const creatorIdNum = +creator_id
    sendEth(creator.user.wallet, amount, dbUser.id, creatorIdNum, creator.threshold);
  }

  function handleCustomPayment(){
    console.log(selectedOption.value)
    console.log(customAmount)
    const creatorIdNum = +creator_id
    if(selectedOption.value === "ETH"){
      console.log("ETH")
      sendEth(creator.user.wallet, customAmount, dbUser.id, creatorIdNum)
    } else {
      sendErc20(creator.user.wallet, selectedOption.value, customAmount, dbUser.id, creatorIdNum, creator.threshold);
    }
  }

  function handleNewPost(){
    navigate(`/post/create/${creator.id}`)
  }

  function handleEdit(){
    navigate(`/creator/edit/${creator.id}`)
  }

  function handleDelete(){
    try{
      axios.delete(`${process.env.REACT_APP_BACKEND_URL}/creators/delete/${creator_id}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }).then(()=>{
        toast.success("Page deleted!",{
          autoClose: 5000,
          position: "top-center"
        })
        navigate(`/profile/${dbUser.id}`)
      })
    } catch(err){
      console.log(err)
    }
  }

  return(
    <div className="flex flex-col items-center px-2">
      <div className="rounded-2xl bg-panel-blue/40 shadow-xl mx-4 md:mx-20 lg:mx-32 mb-20 w-11/12 md:w-10/12 lg:w-8/12">
      { String(dbUser.id) === String(creator.user_id) ?
        <div className="flex flex-row justify-end">
          <button className="mr-2 mt-5 hover:text-hover-pink transition ease-in-out duration-300" onClick={handleEdit}><BiEdit className="h-6 w-6"/></button>
          <Popup
            trigger={<button><RiDeleteBinLine className="h-6 w-6 mr-5 mt-5 hover:text-hover-pink transition ease-in-out duration-300"/></button>}
            modal
          >
          {close => (
            <div className="flex flex-col justify-center items-center rounded-lg bg-[#4165b3] text-white -m-3 px-3 pb-3">
              <RiErrorWarningLine className="h-8 w-8 mb-2 mt-8"/>
              <p>Are you sure you want to delete this creator page?</p>
              <div className="flex flex-row justify-center items-center mt-2">
              <button className="p-2 m-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500" onClick={handleDelete}>Confirm</button>
              <button
                className="p-2 m-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500"
                onClick={() => {
                  close();
                }}
              >
                Cancel
              </button>
            </div>
          </div>
          )}
        </Popup>
        </div> :
        null
      }
      <div className="flex flex-col justify-center items-center px-1">
        <h1 className="font-lilita text-3xl 2xl:text-5xl xl:text-4xl mt-3 pt-5 pb-3">{creator.name}</h1>
        {isLoading ? 
        <div className="w-72 px-1 aspect-square rounded-lg bg-gray-600 animate-pulse"></div>: 
        <img src={creator.image} alt={creator.name} className="w-72 px-1 aspect-square object-cover rounded-lg"/>
        }
        
        <div className="flex flex-col text-left p-8">
          <div className="flex flex-row items-center justify-between pt-3">
            <h3 className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl">Who Am I?</h3>            
              {
                follows.length === 0 ? 
                <button onClick={handleFollow} className="flex flex-row items-center p-2 m-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">
                  <SlUserFollow className="h-4 w-4 mr-1 lg:h-5 lg:w-5"/> Follow
                </button> :
                <button onClick={handleUnfollow} className="hover:content-none flex flex-row items-center p-2 m-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">
                  <SlUserFollowing className="h-4 w-4 mr-1 lg:h-5 lg:w-5"/><p className="before:content-['Followed'] hover:before:content-['Unfollow?']"></p>
                </button>         
              }
          </div>
          <p className="font-raleway pb-3">{creator.bio}</p>
          <div className="flex md:flex-row flex-col justify-between">
            <div className="w-full md:w-1/2 my-2 md:mr-1 p-2 bg-panel-blue/40 rounded-lg shadow-xl">
              <h3 className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl">Social Links</h3>
              <p className="font-raleway">Find me on these other platforms too!</p>
              <div className="flex flex-row flex-wrap items-center">
                {
                  creator.website ?
                  <a href={creator.website} target="blank" className="mr-2 my-2 p-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">
                    <SlGlobe className="h-6 w-6 lg:h-8 lg:w-8"/>
                  </a> :
                  null
                }
                {
                  creator.twitter ?
                  <a href={creator.twitter} target="blank" className="m-2 p-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">
                    <SiTwitter className="h-6 w-6 lg:h-8 lg:w-8"/>
                  </a> :
                  null
                }
                {
                  creator.youtube ?
                  <a href={creator.youtube} target="blank" className="m-2 p-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">
                    <SiYoutube className="h-6 w-6 lg:h-8 lg:w-8"/>
                  </a> :
                  null
                }
                {
                  creator.discord ?
                  <a href={creator.discord} target="blank" className="m-2 p-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">
                    <SiDiscord className="h-6 w-6 lg:h-8 lg:w-8"/>
                  </a> :
                  null
                }
                {
                  creator.substack ?
                  <a href={creator.substack} target="blank" className="m-2 p-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">
                    <SiSubstack className="h-6 w-6 lg:h-8 lg:w-8"/>
                  </a> :
                  null
                }
              </div>
            </div>
            <div className="w-full md:w-1/2 my-2 md:ml-1 py-2 pl-2 pr-4 bg-panel-blue/40 rounded-lg shadow-xl">
              <h3 className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl text-left">Support Me!</h3>
              <p className="font-raleway">Contribute ⟠ {isLoading ? "..." : creator.threshold} or more to gain access to exclusive content!</p>
              <div className="flex flex-row items-center">
                {ethBalance < creator.tier_1 ?
                  <button onClick={()=>{handleETHPayment(1)}} disabled className="flex flex-row items-center p-2 my-2 mr-2 rounded-lg disabled:bg-purple-300/80">
                    <FaEthereum className="text-purple-100/80"/> <p className="font-lilita text-purple-100/80">{isLoading ? "..." : creator.tier_1.toFixed(2)}</p>
                  </button> :
                  <button onClick={()=>{handleETHPayment(1)}} className="flex flex-row items-center p-2 my-2 mr-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">
                    <FaEthereum/> <p className="font-lilita">{isLoading ? "..." : creator.tier_1}</p>
                  </button>
                }
                {ethBalance < creator.tier_2 ?
                  <button onClick={()=>{handleETHPayment(2)}} disabled className="flex flex-row items-center p-2 m-2 rounded-lg disabled:bg-purple-300/80">
                    <FaEthereum className="text-purple-100/80"/> <p className="font-lilita text-purple-100/80">{isLoading ? "..." :creator.tier_2.toFixed(2)}</p>
                  </button> :
                  <button onClick={()=>{handleETHPayment(2)}} className="flex flex-row items-center p-2 m-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">
                    <FaEthereum/> <p className="font-lilita">{isLoading ? "..." : creator.tier_2}</p>
                  </button>
                }
                {ethBalance < creator.tier_3 ?
                  <button onClick={()=>{handleETHPayment(3)}} disabled className="flex flex-row items-center p-2 m-2 rounded-lg disabled:bg-purple-300/80">
                    <FaEthereum className="text-purple-100/80"/> <p className="font-lilita text-purple-100/80">{isLoading ? "..." : creator.tier_3.toFixed(2)}</p>
                  </button> :
                  <button onClick={()=>{handleETHPayment(3)}} className="flex flex-row items-center p-2 m-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">
                    <FaEthereum/> <p className="font-lilita">{isLoading ? "..." : creator.tier_3}</p>
                  </button>
                }
              </div>
              <div className="flex flex-col py-2">
                {(walletBalance < customAmount && selectedOption.value !== "ETH") || (ethBalance < customAmount && selectedOption.value === "ETH") ?
                <div className="p-2 bg-white rounded-md flex flex-row justify-between border-2 border-red-400 box-border">
                  <div className="flex flex-row justify-start">
                    <div className="flex flex-row items-center">
                      <img className="w-7 h-7 mr-2 lg:mr-1" src={selectedOption.img} alt={selectedOption.value}/>
                      <p className="text-gray-800 font-raleway font-xl">{selectedOption.value}</p>
                    </div>
                    <Popup
                      trigger={<button><AiOutlineDown className="h-5 w-6 ml-3 md:ml-2 text-gray-500 hover:text-gray-800 transition ease-in-out duration-300"/></button>}
                      modal
                      >
                      {close => (
                        <div className="flex flex-col justify-center items-center rounded-lg bg-[#4165b3] text-white -my-3 -mx-5 px-5 pb-3">
                          <div className="flex flex-row justify-between w-full py-2">
                            <h2 className="font-lilita text-3xl pt-3">Select token</h2>
                            <button><GiCancel className="h-6 w-6 hover:text-hover-pink transition ease-in-out duration-300" onClick={()=>{close();}}/></button>
                          </div>
                          <div onClick={()=>{setSelectedOption({value: "ETH", img: ethIcon}); setCustomAmount(''); getWalletBalance("ETH"); close();}} className="flex flex-row justify-start items-center w-full my-1 py-2.5 px-3 rounded-md bg-bg-blue/30 hover:bg-bg-blue">
                            <img className="w-7 h-7 mr-3 rounded-full ring-2 ring-white" src={ethIcon} alt="ETH"/>
                            <p className="text-xl">ETH</p>
                          </div>
                          <div onClick={()=>{setSelectedOption({value: "USDC", img: usdcIcon}); setCustomAmount(''); getWalletBalance("USDC"); close();}} className="flex flex-row justify-start items-center w-full my-1 py-2.5 px-3 rounded-md bg-bg-blue/30 hover:bg-bg-blue">
                            <img className="w-7 h-7 mr-3 rounded-full ring-2 ring-white" src={usdcIcon} alt="USDC"/>
                            <p className="text-xl">USDC</p>
                          </div>
                          <div onClick={()=>{setSelectedOption({value: "USDT", img: usdtIcon}); setCustomAmount(''); getWalletBalance("USDT"); close();}} className="flex flex-row justify-start items-center w-full my-1 py-2.5 px-3 rounded-md bg-bg-blue/30 hover:bg-bg-blue">
                            <img className="w-7 h-7 mr-3 rounded-full ring-2 ring-white" src={usdtIcon} alt="USDT"/>
                            <p className="text-xl">USDT</p>
                          </div>
                          <div onClick={()=>{setSelectedOption({value: "DAI", img: daiIcon}); setCustomAmount(''); getWalletBalance("DAI"); close();}} className="flex flex-row justify-start items-center w-full my-1 py-2.5 px-3 rounded-md bg-bg-blue/30 hover:bg-bg-blue">
                            <img className="w-7 h-7 mr-3 rounded-full ring-2 ring-white" src={daiIcon} alt="DAI"/>
                            <p className="text-xl">DAI</p>
                          </div>
                      </div>
                      )}
                    </Popup>
                  </div>
                  <input type="text" value={customAmount} onChange={(e)=>{setCustomAmount(e.target.value)}} className="text-red-400 w-1/2 font-bold font-raleway text-right pr-2 focus:outline-none"/>
                </div> :
                <div className="p-2 bg-white rounded-md flex flex-row border-2 border-transparent">
                  <div className="flex flex-row justify-start">
                    <div className="flex flex-row items-center">
                      <img className="w-7 h-7 mr-2 lg:mr-1" src={selectedOption.img} alt={selectedOption.value}/>
                      <p className="text-gray-800 font-raleway font-xl">{selectedOption.value}</p>
                    </div>
                    <Popup
                      trigger={<button><AiOutlineDown className="h-5 w-6 ml-3 md:ml-2 text-gray-500 hover:text-gray-800 transition ease-in-out duration-300"/></button>}
                      modal
                      >
                      {close => (
                        <div className="flex flex-col justify-center items-center rounded-lg bg-[#4165b3] text-white -my-3 -mx-5 px-5 pb-3">
                          <div className="flex flex-row justify-between w-full py-2">
                            <h2 className="font-lilita text-3xl pt-3">Select token</h2>
                            <button><GiCancel className="h-6 w-6 hover:text-hover-pink transition ease-in-out duration-300" onClick={()=>{close();}}/></button>
                          </div>
                          <div onClick={()=>{setSelectedOption({value: "ETH", img: ethIcon}); setCustomAmount(''); getWalletBalance("ETH"); close();}} className="flex flex-row justify-start items-center w-full my-1 py-2.5 px-3 rounded-md bg-bg-blue/30 hover:bg-bg-blue">
                            <img className="w-7 h-7 mr-3 rounded-full ring-2 ring-white" src={ethIcon} alt="ETH"/>
                            <p className="text-xl">ETH</p>
                          </div>
                          <div onClick={()=>{setSelectedOption({value: "USDC", img: usdcIcon}); setCustomAmount(''); getWalletBalance("USDC"); close();}} className="flex flex-row justify-start items-center w-full my-1 py-2.5 px-3 rounded-md bg-bg-blue/30 hover:bg-bg-blue">
                            <img className="w-7 h-7 mr-3 rounded-full ring-2 ring-white" src={usdcIcon} alt="USDC"/>
                            <p className="text-xl">USDC</p>
                          </div>
                          <div onClick={()=>{setSelectedOption({value: "USDT", img: usdtIcon}); setCustomAmount(''); getWalletBalance("USDT"); close();}} className="flex flex-row justify-start items-center w-full my-1 py-2.5 px-3 rounded-md bg-bg-blue/30 hover:bg-bg-blue">
                            <img className="w-7 h-7 mr-3 rounded-full ring-2 ring-white" src={usdtIcon} alt="USDT"/>
                            <p className="text-xl">USDT</p>
                          </div>
                          <div onClick={()=>{setSelectedOption({value: "DAI", img: daiIcon}); setCustomAmount(''); getWalletBalance("DAI"); close();}} className="flex flex-row justify-start items-center w-full my-1 py-2.5 px-3 rounded-md bg-bg-blue/30 hover:bg-bg-blue">
                            <img className="w-7 h-7 mr-3 rounded-full ring-2 ring-white" src={daiIcon} alt="DAI"/>
                            <p className="text-xl">DAI</p>
                          </div>
                      </div>
                      )}
                    </Popup>
                  </div>
                  <input type="text" value={customAmount} onChange={(e)=>{setCustomAmount(e.target.value)}} className="text-gray-800 w-1/2 font-raleway text-right pr-2 focus:outline-none"/>
                </div>
                }
                <p className="font-raleway">Balance: {(selectedOption.value && selectedOption.value !== "ETH") ? <span>{walletBalance ? walletBalance : "- "} {selectedOption.value}</span> : <span>{ethBalance ? ethBalance : "- "} ETH</span>}  {(walletBalance < customAmount && selectedOption.value !== "ETH") || (ethBalance < customAmount && selectedOption.value === "ETH") ? <span className="text-red-400 font-bold"> - Insufficient Balance</span> : null}</p>
                <div className="flex flex-row justify-end w-full">
                  {(walletBalance < customAmount && selectedOption.value !== "ETH") || (ethBalance < customAmount && selectedOption.value === "ETH") || !dbUser ? 
                    <button onClick={handleCustomPayment} disabled className="font-raleway p-2 disabled:bg-purple-300/80 rounded-lg"><p className="font-raleway text-purple-100/80">Confirm</p></button>:
                    <button onClick={handleCustomPayment} className="font-ralewa p-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">Confirm</button>
                  }
                </div>
              </div>
            </div>
          </div>
          <h3 className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl my-2">Posts</h3>
          {creator.user_id === dbUser.id ?
          <button onClick={handleNewPost} className="font-raleway my-2 p-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">
            Create New Post
          </button>:
          null}
          { threshold || dbUser.id === creator.user_id ?
            <div>
              <PostList creator_id = {creator_id} accessToken={accessToken}/>
            </div>
            : 
            <p>This section is for Premium Followers</p>}
        </div>
      </div>
    </div>    
    <Footer/>
    </div>
  )
}

