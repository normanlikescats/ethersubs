import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { TransactionContext } from "../Context/EthersContext";
import { BsPatchCheckFill } from 'react-icons/bs';
import { BiEdit } from 'react-icons/bi'

export default function Profile(){
  const user_id = useParams().id;
  const { user } = useContext(TransactionContext)
  const [name, setName] = useState('')
  const [photoUrl, setPhotoUrl] = useState('')
  const [wallet, setWallet] = useState('')
  const [creator, setCreator] = useState(false)
  const [createdDate, setCreatedDate] = useState('')
  const [creatorData, setCreatorData] = useState('')
  const navigate = useNavigate();

  // Pull user data
  useEffect(()=>{
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/users/${user_id}`).then((response)=>{
        console.log(response.data[0])
        setName(response.data[0].display_name)
        setPhotoUrl(response.data[0].photo_url)
        setWallet(response.data[0].wallet)
        setCreator(response.data[0].creator)
        setCreatedDate(response.data[0].created_at)
      })
  },[user])

  // Pull Creator data if any
  useEffect(()=>{
    if(user && creator){
      try{
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/creators/user/${user_id}`).then((response)=>{
          console.log(response.data)
          setCreatorData(response.data)
        })
      } catch (err){
        console.log(err)
      }
    }
  },[user_id])

  function handleCreatorClick(id){
    navigate(`/creator/${id}`)
  }

  function handleEdit(){
    navigate("/edit/profile")
  }

  let creatorItems;
  if(creatorData){
    creatorItems = creatorData.map((creator)=>{
      return(
        <div onClick={()=>{handleCreatorClick(creator.id)}} className="flex flex-col justify-center items-center content-center my-2 mx-3 border-transparent border-2 hover:border-solid hover:border-2 hover:border-white rounded-lg hover:bg-panel-blue/60">
          <img
          className="w-64 h-64 pt-5 px-5 aspect-square object-cover rounded-xl"
          src={creator.image}
          alt={creator.name}
          />
          <h2 className="font-lilita text-l 2xl:text-2xl xl:text-xl py-2">{creator.name}</h2>
          <p className="px-5 pb-3">{creator.bio}</p>
        </div>
      )
    })
  }

  console.log(user)
  console.log(creatorItems)
  return(
    <div className="rounded-2xl bg-panel-blue/40 shadow-xl mx-32 mb-32">
    { String(user.id) === String(user_id) ?
        <div className="flex flex-row justify-end">
          <button className="h-6 w-6 mx-3 mt-3 hover:text-hover-pink transition ease-in-out duration-300" onClick={handleEdit}><BiEdit/></button>
        </div> :
        null
      }
      <div className="flex flex-col items-center text-left px-24 pt-6 pb-12">
        <h1 className="font-lilita text-3xl 2xl:text-5xl xl:text-4xl">{name}</h1>
        <img
        className="rounded-lg w-72 h-72 object-cover"
        src={photoUrl}
        alt={name}/>
        <div className="flex flex-col justify-start w-full">
          <h2>Wallet: {`${wallet.slice(0, 5)}... ${wallet.slice(-4)}`}</h2>
          <div className="flex flex-row content-center">
            {creator ?
              <div className="flex flex-row">
                <BsPatchCheckFill className="text-hover-pink h-5 w-5 mr-2"/><span>Creator</span>
              </div> :
              null
            }
          </div>
          <p>User since {new Date(createdDate).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).split(",")[1]}</p>
          {creator && creatorItems ?
            <div className="flex flex-col content-center justify-center items-center">
              <h3 className="my-3 font-lilita text-2xl 2xl:text-4xl xl:text-3xl mb-2">{name}'s Creator Pages</h3>
              {creatorItems}
            </div>: 
            null
          }
          {creator ? 
            <button className="p-2 my-2 w-1/5 self-end bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">
              Create a Creator Page
            </button>
            :
            null
          }
        </div>
      </div>
    </div>
  )
}