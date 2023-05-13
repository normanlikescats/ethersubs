import React, { useState, useEffect, useContext } from "react";
import Searchbar from "./Searchbar";
import { useNavigate } from "react-router";
import axios from 'axios';
import { TransactionContext } from '../Context/EthersContext';

export default function Home(){
  const navigate = useNavigate();
  const [creatorsList, setCreatorsList] = useState('');
  const [follows, setFollows] = useState([])
  const { user } = useContext(TransactionContext);

  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/creators/all`).then((response)=>{
      console.log(response)
      setCreatorsList(response.data)
    })
  },[])

  // Pull follow data
  useEffect(()=>{
    if(user){
      console.log("get follows")
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/follows/user/${user.id}`).then((response)=>{
        console.log(response.data)
        setFollows(response.data)
      })
    }
  },[user])

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
        <div onClick={()=>handleClick(creator.id)} className="w-1/3">
          <img src={creator.image} alt={creator.name} className="w-11/12 aspect-square"/>
          <h3 className="font-lilita text-left">{creator.name}</h3>
          <p className="font-raleway text-left">{creator.bio}</p>
        </div>
      )
    })
  }

  let followItems;
  if(follows){
    followItems = follows.map((follow)=>{
      return(
        <div onClick={()=>handleClick(follow.creator.id)} className="w-1/3">
          <img src={follow.creator.image} alt={follow.creator.name} className="w-11/12 aspect-square"/>
          <h3 className="font-lilita text-left">{follow.creator.name}</h3>
          <p className="font-raleway text-left">{follow.creator.bio}</p>
        </div>
      )
    })
  }
  
  return(
    <div className="flex flex-col justify-center items-center w-full">
      <Searchbar handleSubmit={handleSubmit} creators={creatorsList}/>
      <h2 className="pt-12 font-lilita text-xl 2xl:text-3xl xl:text-2xl">Top Creators</h2>
      <div className="flex flex-row flex-wrap py-2 w-8/12">
        {creatorItems}
      </div>
      {
        followItems.length === 0 ?
        null :
        <div>
            <h2 className="pt-12 font-lilita text-xl 2xl:text-3xl xl:text-2xl">Your Creators</h2>
            <div className="flex flex-row flex-wrap py-2 w-8/12">
              {followItems}
            </div>
          </div> 
      }
    </div>
  )
}