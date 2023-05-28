import React, { useState, useEffect, useContext } from "react";
import Searchbar from "./Searchbar";
import { useNavigate } from "react-router";
import axios from 'axios';
import { TransactionContext } from '../Context/EthersContext';
import LoadingCreators from "./LoadingCreator";
import Footer from './Footer'

export default function Home(){
  const navigate = useNavigate();
  const [creatorsList, setCreatorsList] = useState('');
  const [follows, setFollows] = useState([])
  const { dbUser, accessToken, isLoading, setLoading } = useContext(TransactionContext);

  useEffect(()=>{
    setLoading(true)
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/creators/all`).then((response)=>{
      console.log(response)
      setLoading(false)
      setCreatorsList(response.data)
    })
  },[setLoading])

  // Pull follow data
  useEffect(()=>{
    if(dbUser){
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/follows/user/${dbUser.id}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }).then((response)=>{
        console.log(response.data)
        setFollows(response.data)
      })
    }
  },[dbUser, accessToken])

  function handleSubmit(results){
    navigate(`/creator/${results[0].id}`)
  }

  function handleClick(id){
    navigate(`/creator/${id}`)
  }

  let creatorItems;
  if(creatorsList){
    creatorItems = creatorsList.map((creator)=>{
      return(
        <div onClick={()=>handleClick(creator.id)} className="flex flex-col items-center w-full md:w-1/2 lg:w-1/3 px-3 py-5 border-transparent border-2 hover:border-solid hover:border-2 hover:border-white rounded-lg hover:bg-panel-blue/60">
          <img src={creator.image} alt={creator.name} className="w-11/12 aspect-square rounded-md object-cover"/>
          <h3 className="font-lilita text-l 2xl:text-2xl xl:text-xl text-left w-11/12">{creator.name}</h3>
          <p className="font-raleway text-sm text-left w-11/12">{creator.bio.slice(0,80)}...<span className="font-raleway hover:underline hover:text-hover-pink" onClick={()=>handleClick(creator.id)}> Continue reading →</span></p>
        </div>
      )
    })
  }

  let followItems;
  if(follows){
    followItems = follows.map((follow)=>{
      return(
        <div onClick={()=>handleClick(follow.creator_id)} className="flex flex-col items-center mb-2 w-full md:w-1/2 lg:w-1/3 px-3 py-5 border-transparent border-2 hover:border-solid hover:border-2 hover:border-white rounded-lg hover:bg-panel-blue/60">
          <img src={follow.creator.image} alt={follow.creator.name} className="w-11/12 aspect-square rounded-md object-cover"/>
          <h3 className="font-lilita text-l 2xl:text-2xl xl:text-xl text-left w-11/12">{follow.creator.name}</h3>
          <p className="font-raleway text-sm text-left w-11/12">{follow.creator.bio.slice(0,80)}...<span className="font-raleway hover:underline hover:text-hover-pink hover:cursor-pointer" onClick={()=>handleClick(follow.creator_id)}> Continue reading →</span></p>
        </div>
      )
    })
  }

  
  
  return(
      <div className="flex flex-col justify-center items-center w-full ">
        <Searchbar handleSubmit={handleSubmit} creators={creatorsList}/>
        <h2 className="pt-12 font-lilita text-2xl 2xl:text-4xl xl:text-3xl pb-4">Your Creators</h2>
        {
          followItems.length === 0 ?
          <h2 className="font-raleway pt-3">You're not following anyone yet!</h2> :
          <div className="flex flex-row justify-center flex-wrap py-12 px-6 md:px-12 w-11/12 rounded-2xl bg-panel-blue/40 shadow-xl mx-32">
            {followItems}
          </div> 
        }
        <h2 className="pt-12 font-lilita text-2xl 2xl:text-4xl xl:text-3xl pb-4">Top Creators</h2>
        {isLoading ? 
        <LoadingCreators/> : 
        <div className="flex flex-row justify-center flex-wrap py-12 px-6 md:px-12 w-11/12 rounded-2xl bg-panel-blue/40 shadow-xl mx-32 mb-20">
          {creatorItems}
        </div>
        }
        <Footer/>
      </div>
  )
}