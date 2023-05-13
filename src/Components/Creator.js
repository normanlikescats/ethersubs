import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { TransactionContext } from '../Context/EthersContext';
import usdcIcon from "../Images/usdc.png";
import usdtIcon from "../Images/USDT.png";
import ethIcon from "../Images/eth.png";
import daiIcon from "../Images/dai.png";
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
import axios from "axios";
import Select from "react-select";
import PostList from "./PostList";

export default function Creator(){
  const navigate = useNavigate();
  const creator_id = useParams().id;
  const [creator, setCreator] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [follows, setFollows] = useState([])
  const [threshold, setThreshold] = useState(false)
  const { sendErc20, sendEth, user } = useContext(TransactionContext)

  // CODE IN USER FOLLOW/FOLLOWED/UNFOLLOW BUTTONS AND STATE

  // Pull Creator Data
  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/creators/${creator_id}`).then((response)=>{
      setCreator(response.data[0])
    })
  },[])

  // Pull follow data
  useEffect(()=>{
    if(user){
      console.log("get follows")
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/follows/one/${creator_id}/${user.id}`).then((response)=>{
        console.log(response.data)
        setFollows(response.data)
      })
    }
  },[user])

  // Pull Threshold data
  useEffect(()=>{
    if(user && creator){
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/thresholds/${user.id}/${creator_id}`).then((response)=>{
        console.log(response.data[0].total_contribution)
        console.log(creator.threshold)
        console.log(response.data[0].total_contribution >= creator.threshold)
        if(response.data[0].total_contribution >= creator.threshold){
          setThreshold(true)
        }
      })
    }
  },[creator])
  
  // For React-Select Component
  const optionsArr = [
    { value: 'USDC', label: 'USDC', icon: usdcIcon},
    { value: 'DAI', label: 'DAI', icon: daiIcon},
    { value: 'USDT', label: 'USDT', icon: usdtIcon},
    { value: 'ETH', label: 'ETH', icon: ethIcon},
  ]

  const IconOption = (props) => {
    const {innerProps, innerRef} = props;
      return (
        <article  ref={innerRef} {...innerProps} className="odd:bg-slate-200 even:bg-slate-100 hover:cursor-pointer hover:bg-slate-400">
            <img src={props.data.icon} className="w-4 h-4" alt={props.data.label}/>
            <p className="font-raleway text-black ml-2">{props.data.label}</p>
        </article >
      )
    };


  function handleFollow(){
    if(!user){
      alert("Please connect your wallet first!")
    } else{
      try{
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/follows/create`, {
          user_id: user.id,
          creator_id: creator.id
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
      axios.delete(`${process.env.REACT_APP_BACKEND_URL}/follows/delete`,{data: {
        user_id: 1,
        creator_id: 2
      }
    }).then((response)=>{
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
    console.log(creator.user.wallet)
    console.log(amount)
    sendEth(creator.user.wallet, amount);
  }

  function handleCustomPayment(){
    console.log(selectedOption.value)
    console.log(customAmount)
    if(selectedOption.value === "ETH"){
      console.log("ETH")
      sendEth(creator.user.wallet, customAmount)
    } else {
      sendErc20(creator.user.wallet, selectedOption.value, customAmount);
    }
  }

  function handleSelect(selected){
    setSelectedOption(selected)
  }

  function handleNewPost(){
    navigate(`/post/create/${creator.id}`)
  }

  return(
    <div className="flex flex-col justify-center items-center">
      <h1 className="font-lilita text-3xl 2xl:text-5xl xl:text-4xl pb-3">{creator.name}</h1>
      <img src={creator.image} alt={creator.name} className="w-72 aspect-square rounded-lg"/>
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
        <p className="font-raleway">{creator.bio}</p>
        <div className="flex md:flex-row flex-col justify-between">
          <div className="w-full md:w-1/2 my-2 md:mr-1 p-2 bg-panel-blue/40 rounded-lg shadow-xl">
            <h3 className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl">Social Links</h3>
            <p className="font-raleway">Find me on these other platforms too!</p>
            <div className="flex flex-row">
              {
                creator.website ?
                <a href={creator.website} target="blank" className="m-2 p-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">
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
          <div className="w-full md:w-1/2 my-2 md:ml-1 p-2 bg-panel-blue/40 rounded-lg shadow-xl">
            <h3 className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl text-left">Support Me!</h3>
            <p className="font-raleway">Contribute ⟠ {creator.threshold} or more to gain access to exclusive content!</p>
            <div className="flex flex-row items-center">
              <button onClick={()=>{handleETHPayment(1)}} className="flex flex-row items-center p-2 my-2 mr-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">
                <FaEthereum/> <p className="font-lilita">{creator.tier_1}</p>
              </button>
              <button onClick={()=>{handleETHPayment(2)}} className="flex flex-row items-center p-2 m-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">
                <FaEthereum/> <p className="font-lilita">{creator.tier_2}</p>
              </button>
              <button onClick={()=>{handleETHPayment(3)}} className="flex flex-row items-center p-2 m-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">
                <FaEthereum/> <p className="font-lilita">{creator.tier_3}</p>
              </button>
            </div>
            <div className="flex flex-row">
              <Select
                options={optionsArr}
                onChange={handleSelect}
                value= {selectedOption}
                components={{Option: IconOption}}
                />
                <input type="text" value={customAmount} onChange={(e)=>{setCustomAmount(e.target.value)}} className="font-raleway text-black text-right px-5 w-1/4 rounded-r-lg"/>
                <button onClick={handleCustomPayment} className="font-raleway p-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">Confirm</button>
            </div>            
          </div>
        </div>
        <h3 className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl my-2">Posts</h3>
        {creator.user_id === user.id ?
        <button onClick={handleNewPost} className="font-raleway my-2 p-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">
          Create New Post
        </button>:
        null}
        { threshold ?
          <div>
            THIS SECTION FOR FOLLOWERS ONLI
            <PostList creator_id = {creator_id}/>
          </div>
          : 
          <p>This section is for Premium Followers</p>}
      </div>
    </div>    
  )
}

