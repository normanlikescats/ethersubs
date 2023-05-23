import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { TransactionContext } from "../Context/EthersContext";
import { BsPatchCheckFill } from 'react-icons/bs';
import { BiEdit } from 'react-icons/bi'

export default function Profile(){
  const user_id = useParams().id;
  const { dbUser, isLoading, setLoading } = useContext(TransactionContext)
  const [name, setName] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [wallet, setWallet] = useState('')
  const [creator, setCreator] = useState(false)
  const [createdDate, setCreatedDate] = useState('')
  const [creatorData, setCreatorData] = useState('')
  const navigate = useNavigate();

  // Pull user data
  useEffect(()=>{
      setLoading(true)
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${user_id}`).then((response)=>{
        console.log(response.data[0])
        setName(response.data[0].display_name)
        setPhotoUrl(response.data[0].photo_url)
        setWallet(response.data[0].wallet)
        setCreator(response.data[0].creator)
        setCreatedDate(response.data[0].created_at)
        setLoading(false)
      })
  },[dbUser, user_id, setLoading])

  // Pull Creator data if any
  useEffect(()=>{
    if(dbUser && dbUser.creator){
      try{
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/creators/user/${user_id}`).then((response)=>{
          console.log(response.data)
          setCreatorData(response.data)
        })
      } catch (err){
        console.log(err)
      }
    }
  },[dbUser, user_id])

  function handleCreatorClick(id){
    navigate(`/creator/${id}`)
  }

  function handleEdit(){
    navigate("/edit/profile")
  }

  function handleNewCreator(){
    navigate("/creator/create")
  }

  let creatorItems;
  if(creatorData){
    creatorItems = creatorData.map((creator)=>{
      return(
        <div onClick={()=>{handleCreatorClick(creator.id)}} className="flex flex-col justify-start w-full md:w-1/2 lg:w-1/3 my-2 px-3 border-transparent border-2 hover:border-solid hover:border-2 hover:border-white rounded-lg hover:bg-panel-blue/60">
          <img
          className="rounded-xl w-50 h-50 aspect-square pt-5 px-5 object-cover"
          src={creator.image}
          alt={creator.name}
          />
          <div className="text-left w-full">
            <h2 className="px-5 font-lilita text-l 2xl:text-2xl xl:text-xl py-2">{creator.name}</h2>
            <p className="px-5 pb-3">{creator.bio}</p>
          </div>
        </div>
      )
    })
  }


  return(
    <div className="rounded-2xl bg-panel-blue/40 shadow-xl mx-8 md:mx-20 lg:mx-32 mb-20 w-10/12">
    { String(dbUser.id) === String(user_id) ?
        <div className="flex flex-row justify-end">
          <button className="mr-5 mt-5 hover:text-hover-pink transition ease-in-out duration-300" onClick={handleEdit}><BiEdit className="h-6 w-6"/></button>
        </div> :
        null
      }
      <div className="flex flex-col items-center text-left px-24 pt-6 pb-12">
        <h1 className="font-lilita text-3xl 2xl:text-5xl xl:text-4xl">{name}</h1>
        { isLoading ?
          <div className="rounded-lg w-72 h-72 bg-gray-600 animate-pulse">  
          </div> :
          <img
          className="rounded-lg w-72 h-72 object-cover"
          src={photoUrl}
          alt={name}/>
        }
        <div className="flex flex-col justify-start w-72 pt-4">
          <h2>Wallet: {isLoading ? `Loading...` : `${wallet}`}</h2>
          <div className="flex flex-row content-center items-center py-1">
            {creator ?
              <div className="flex flex-row">
                <BsPatchCheckFill className="text-hover-pink h-5 w-5 mr-2"/><span>Creator</span>
              </div> :
              null
            }
          </div>
          <p>User since {new Date(createdDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).split(",")[1]}</p>
          
        </div>
      </div>
      <div className="bg-panel-blue/60 shadow-xl p-4 mx-8 mt-2 mb-20 rounded-2xl">
        {creator && creatorItems ?
          <div className="flex flex-col content-center justify-center items-center">
            <h3 className="my-3 font-lilita text-2xl 2xl:text-4xl xl:text-3xl mb-2">{String(dbUser.id) === String(user_id) ? `Your Creator Pages` : `${name}'s Creator Pages`}</h3>
            <div className="flex flex-row flex-wrap">
              {creatorItems}
            </div>
          </div>: 
          null
        }
        {creator ? 
          <button className="p-2 my-2 w-full self-end bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500" onClick={handleNewCreator}>
            Create a Creator Page
          </button>
         :
          null
        }
      </div>
    </div>
  )
}