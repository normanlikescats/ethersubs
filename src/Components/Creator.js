import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import {
  SiSubstack,
  SiDiscord,
  SiYoutube,
  SiTwitter,
} from "react-icons/si"
import {
  SlGlobe,
  SlUserFollow
} from "react-icons/sl";
import { FaEthereum } from "react-icons/fa"
import axios from "axios";

export default function Creator(){
  const creator_id = useParams().id;
  const [creator, setCreator] = useState('')

  // CODE IN USER FOLLOW/FOLLOWED/UNFOLLOW BUTTONS AND STATE

  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/creators/${creator_id}`).then((response)=>{
      console.log(response.data)
      setCreator(response.data[0])
    })
  },[])
  console.log(creator)

  function handleFollow(){
    //write follow/unfollow function here
    console.log("follow")
  }

  function handlePayment(tier){
    // write payment function here
    console.log(tier)
  }
  
  return(
    <div className="flex flex-col justify-center items-center">
      <h1 className="font-lilita text-3xl 2xl:text-5xl xl:text-4xl pb-3">{creator.name}</h1>
      <img src={creator.image} alt={creator.name} className="w-72 aspect-square rounded-lg"/>
      <div className="flex flex-col text-left p-5">
        <div className="flex flex-row items-center justify-between pt-3">
          <h3 className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl">Who Am I?</h3>
          <button onClick={handleFollow} className="flex flex-row items-center p-2 m-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">
            <SlUserFollow className="h-3 w-3 lg:h-5 lg:w-5"/> Follow
          </button>
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
            <div className="flex flex-row">
              <button onClick={()=>{handlePayment(1)}} className="flex flex-row items-center p-2 m-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">
                <FaEthereum/> <p className="font-lilita">{creator.tier_1}</p>
              </button>
              <button onClick={()=>{handlePayment(2)}} className="flex flex-row items-center p-2 m-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">
                <FaEthereum/> <p className="font-lilita">{creator.tier_2}</p>
              </button>
              <button onClick={()=>{handlePayment(3)}} className="flex flex-row items-center p-2 m-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">
                <FaEthereum/> <p className="font-lilita">{creator.tier_3}</p>
              </button>
            </div>
          </div>
        </div>
        <h3 className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl">Posts</h3>
        <p className="font-raleway">Posts here</p>
      </div>
    </div>    
  )
}

