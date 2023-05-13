import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { TransactionContext } from "../Context/EthersContext";
import { GiCancel } from 'react-icons/gi'
import { storage } from "../firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { v4 } from 'uuid';

export default function ProfileForm(){
  const { user, setUser } = useContext(TransactionContext)
  const [name, setName] = useState(user.display_name)
  const [creator, setCreator] = useState(user.creator)
  const [photoUrl, setPhotoUrl] = useState(user.photo_url)
  const [postImage, setPostImage] = useState('')
  const [imageUrl, setImageUrl] = useState(null)
  const navigate = useNavigate();

  // Upload file to Firebase
  function uploadPostImage(e){
    e.preventDefault();
    const imageRef = ref(storage, `pfp/${postImage.name}${v4()}`)
    try{
      uploadBytes(imageRef, postImage).then((response)=>{
        getDownloadURL(imageRef).then((response)=>{
          setImageUrl(response)
          alert("uploaded")
        })
      })
    } catch (err){
      console.log(err)
    }
  }

  // Store uploaded file
  function handleFile(e){
    if(e.target.files[0]){
      setPostImage(e.target.files[0])
      console.log(e.target.files[0])
    }
  }
  
  // Remove uploaded image
  function deleteImage(e){
    e.preventDefault();
    setPostImage('');
    setImageUrl(null);
  }

  // Handle Submit
  function handleSubmit(){
    if (imageUrl !== null){
      try{
        axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/`,{
          wallet: user.wallet,
          display_name: name,
          creator: creator,
          photo_url: imageUrl
        }).then((response)=>{
          console.log(response.data)
          setUser(response.data[1])
          navigate(`/profile/${user.id}`)
        })
      } catch(err){
        console.log(err)
      }
    } else{
      try{
        axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/`,{
          wallet: user.wallet,
          display_name: name,
          creator: creator
        }).then((response)=>{
          setUser(response.data[1][0])
          navigate(`/profile/${user.id}`)
        })
      }catch(err){
        console.log(err)
      }
    }
  }

  function handleCancel(){
    navigate(`/profile/${user.id}`)
  }

  console.log(user)
  return(
    <div className="rounded-2xl bg-panel-blue/40 shadow-xl mx-32 mb-32">
      <div className="flex flex-col items-center text-left px-24 py-12">
        <h1 className="font-lilita text-3xl 2xl:text-5xl xl:text-4xl">Edit Profile</h1>
        <p>{imageUrl === null}</p>
        <button onClick={handleCancel}><GiCancel/></button>
        <img
        className="rounded-lg w-72 h-72 object-cover"
        src={imageUrl === null ? photoUrl : imageUrl}
        alt={user.display_name ? user.display_name : "User Profile"}
        />
        <div className="flex flex-row items-center justify-between w-full my-3">
          <input
            type="file"
            accept="image/*"
            onChange = {handleFile}
            className="font-raleway file:m-2 file:p-2 file:font-raleway file:text-white file:font-white file:border-0 file:bg-button-purple file:rounded-lg hover:file:bg-hover-pink file:transition file:ease-in-out file:duration-500"
           />
          {
            imageUrl === null ? 
            <button className="m-2 p-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500" onClick = {uploadPostImage} disabled={!postImage}>Upload image</button>:
            <button className="m-2 p-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500" onClick = {deleteImage}>Delete image</button>
          }
        </div>
        <div className="flex flex-col justify-start w-full">
          <h2>Wallet: {user? `${user.wallet.slice(0, 5)}... ${user.wallet.slice(-4)}` : null}</h2>
          <input type="text" value={name} placeholder="Enter a display name" onChange={(e)=>{setName(e.target.value)}} className="text-black px-2 py-1"/>
          <div className="flex flex-row content-center">
            <input className="mr-3" type="checkbox" onChange={()=>{setCreator(!creator)}} value={creator} checked={creator ? 'checked': ''}/>
            <label>Creator</label>
          </div>
          <p>User since {new Date(user.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).split(",")[1]}</p>
        </div>
        <button onClick={handleSubmit} className="p-2 my-2 w-1/5 self-end bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">Confirm Changes</button>
      </div>
    </div>
  )
}