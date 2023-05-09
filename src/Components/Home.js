import React, { useState, useEffect } from "react";
import Searchbar from "./Searchbar";
import { useNavigate } from "react-router";
import axios from 'axios';

export default function Home(){
  const navigate = useNavigate();
  const [creatorsList, setCreatorsList] = useState('');


  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/creators/all`).then((response)=>{
      console.log(response)
      setCreatorsList(response.data)
    })
  },[])

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

  return(
    <div className="flex flex-col justify-center items-center w-full">
      <Searchbar handleSubmit={handleSubmit} creators={creatorsList}/>
      <h2 className="pt-12 font-lilita text-xl 2xl:text-3xl xl:text-2xl">Top Creators</h2>
      <div className="flex flex-row flex-wrap py-2 w-8/12">
        {creatorItems}
      </div>
    </div>
  )
}