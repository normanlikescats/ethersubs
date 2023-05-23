import React, { useState, useContext } from "react";
import { useNavigate } from "react-router";
import axios from "axios";
import { TransactionContext } from "../Context/EthersContext";
import { GiCancel } from 'react-icons/gi'
import { storage } from "../firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { v4 } from 'uuid';
import { toast } from 'react-toastify';

export default function ProfileForm(){
  const { dbUser, setDbUser, accessToken } = useContext(TransactionContext)
  const [name, setName] = useState(dbUser.display_name)
  const [creator, setCreator] = useState(dbUser.creator)
  const [photoUrl, setPhotoUrl] = useState(dbUser.photo_url)
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
          toast.success("Image uploaded!",{
            position: "top-center",
            autoClose: 5000
          });
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
    setPhotoUrl(dbUser.photo_url)
    toast.success("Image deleted!",{
      position: "top-center",
      autoClose: 5000
    });
  }

  // Handle Submit
  function handleSubmit(){
    if (imageUrl !== null){
      try{
        const loadingToast = toast.loading(`Updating profile...`, {
          position: "top-center",
          autoClose: 5000
        });
        axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/`,{
          wallet: dbUser.wallet,
          display_name: name,
          creator: creator,
          photo_url: imageUrl
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }).then((response)=>{
          toast.dismiss(loadingToast)
          toast.success("Profile updated!",{
            position: "top-center",
            autoClose: 5000
          });
          console.log(response.data[1][0])
          setDbUser(response.data[1][0])
          navigate(`/profile/${dbUser.id}`)
        })
      } catch(err){
        console.log(err)
      }
    } else{
      try{
        const loadingToast = toast.loading(`Updating profile...`, {
          position: "top-center",
          autoClose: 5000
        });
        axios.put(`${process.env.REACT_APP_BACKEND_URL}/users/`,{
          wallet: dbUser.wallet,
          display_name: name,
          creator: creator
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }).then((response)=>{
          console.log(response.data[1][0])
          setDbUser(response.data[1][0])
          toast.dismiss(loadingToast)
          toast.success("Profile updated!",{
            position: "top-center",
            autoClose: 5000
          });
          navigate(`/profile/${dbUser.id}`)
        })
      }catch(err){
        console.log(err)
      }
    }
  }

  function handleCancel(){
    navigate(`/profile/${dbUser.id}`)
  }

  console.log(dbUser)
  return(
    <div className="rounded-2xl bg-panel-blue/40 shadow-xl mx-32 mb-32 w-10/12 md:w-8/12 lg:w-6/12">
      <div className="flex flex-row justify-end"> 
        <button className="mr-5 mt-5 hover:text-hover-pink transition ease-in-out duration-300" onClick={handleCancel}><GiCancel className="h-6 w-6"/></button>
      </div>
      <div className="flex flex-col items-center text-left px-24 py-12">
        <h1 className="font-lilita text-3xl 2xl:text-5xl xl:text-4xl">Edit Profile</h1>
        <img
        className="rounded-lg w-72 h-72 object-cover"
        src={imageUrl === null ? photoUrl : imageUrl}
        alt={dbUser.display_name ? dbUser.display_name : "User Profile"}
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
            <button className="ml-2 my-2 px-6 py-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500" onClick = {uploadPostImage} disabled={!postImage}>Upload</button>:
            <button className="ml-2 my-2 px-6 py-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500" onClick = {deleteImage}>Delete</button>
          }
        </div>
        <div className="flex flex-col justify-start w-full">
          <h2>Wallet: {dbUser? `${dbUser.wallet.slice(0, 5)}...${dbUser.wallet.slice(-4)}` : null}</h2>
          <input type="text" value={name} placeholder="Enter a display name" onChange={(e)=>{setName(e.target.value)}} className="text-black px-2 py-1 mt-1 rounded-md"/>
          <div className="flex flex-row content-center my-2">
            <input className="mr-3 accent-hover-pink" type="checkbox" onChange={()=>{setCreator(!creator)}} value={creator} checked={creator ? 'checked': ''}/>
            <label>Creator</label>
          </div>
          <p>User since {new Date(dbUser.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).split(",")[1]}</p>
        </div>
        <button onClick={handleSubmit} className="p-2 my-2 w-full md:w-5/12 lg:w-1/4 self-end bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">Confirm</button>
      </div>
    </div>
  )
}