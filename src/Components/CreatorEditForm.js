import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import axios from "axios";
import { TransactionContext } from "../Context/EthersContext";
import { GiCancel } from 'react-icons/gi'
import { storage } from "../firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import { v4 } from 'uuid';
import {
  SiSubstack,
  SiDiscord,
  SiYoutube,
  SiTwitter,
} from "react-icons/si"
import {
  SlGlobe
} from "react-icons/sl";
import { FaEthereum } from "react-icons/fa";
import { toast } from 'react-toastify';
import Footer from './Footer'

export default function CreatorForm(){
  const creator_id = useParams().id
  const { dbUser, accessToken } = useContext(TransactionContext)
  const [creator, setCreator] = useState('')
  const [name, setName] = useState(null)
  const [bio, setBio] = useState(null)
  const [twitter, setTwitter] = useState(null)
  const [substack, setSubstack] = useState(null)
  const [discord, setDiscord] = useState(null)
  const [youtube, setYoutube] = useState(null)
  const [website, setWebsite] = useState(null)
  const [tier_1, setTier1] = useState(null)
  const [tier_2, setTier2] = useState(null)
  const [tier_3, setTier3] = useState(null)
  const [threshold, setThreshold] = useState(null)
  const [currImage, setCurrImage] = useState('')         
  const [postImage, setPostImage] = useState('')
  const [imageUrl, setImageUrl] = useState(null)
  const navigate = useNavigate();

  useEffect(()=>{
    if(!dbUser){
      navigate("/home")
    }
  })

  // Pull Creator Data
  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/creators/${creator_id}`).then((response)=>{
      setCreator(response.data[0])
    })
  },[creator_id])

  // Set Data
  useEffect(()=>{
    if(creator){
      setName(creator.name)
      setBio(creator.bio)
      setCurrImage(creator.image)
      setTwitter(creator.twitter)
      setDiscord(creator.discord)
      setWebsite(creator.website)
      setYoutube(creator.youtube)
      setSubstack(creator.substack)
      setTier1(creator.tier_1)
      setTier2(creator.tier_2)
      setTier3(creator.tier_3)
      setThreshold(creator.threshold)
    }
  },[creator])

  // Upload file to Firebase
  function uploadPostImage(e){
    e.preventDefault();
    const imageRef = ref(storage, `creator/${postImage.name}${v4()}`)
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
    toast.success("Image deleted!",{
      position: "top-center",
      autoClose: 5000
    });
  }

  // Handle Submit
  function handleSubmit(){
    if (inputValidation()){
      if(imageUrl === null){
        const loadingToast = toast.loading(`Updating your page...`, {
          position: "top-center",
          autoClose: 5000
        });
        try{
          axios.put(`${process.env.REACT_APP_BACKEND_URL}/creators/edit/${creator_id}`,{
            bio: bio,
            name: name,
            twitter: twitter,
            substack: substack,
            discord: discord,
            youtube: youtube,
            website: website,
            tier_1: tier_1,
            tier_2: tier_2,
            tier_3: tier_3,
            threshold: threshold
          },{
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }).then((response)=>{
            toast.dismiss(loadingToast)
            toast.success("Page updated!",{
              position: "top-center",
              autoClose: 5000
            })
            navigate(`/creator/${response.data[1][0].id}`)
          })
        } catch(err){
          console.log(err)
          toast.dismiss(loadingToast)
          toast.error("Update Error!",{
            position: "top-center",
            autoClose: 5000
          })
        }
      } else{
        const loadingToast = toast.loading(`Updating your page...`, {
            position: "top-center",
            autoClose: 5000
        });
        try{

          axios.put(`${process.env.REACT_APP_BACKEND_URL}/creators/edit/${creator_id}`,{
            bio: bio,
            name: name,
            image: imageUrl,
            twitter: twitter,
            substack: substack,
            discord: discord,
            youtube: youtube,
            website: website,
            tier_1: tier_1,
            tier_2: tier_2,
            tier_3: tier_3,
            threshold: threshold
          },{
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }).then((response)=>{
            toast.dismiss(loadingToast)
            toast.success("Page updated!",{
              position: "top-center",
              autoClose: 5000
            })
            navigate(`/creator/${response.data[1][0].id}`)
          })
        } catch(err){
          console.log(err)
          toast.dismiss(loadingToast)
          toast.error("Update Error!",{
            position: "top-center",
            autoClose: 5000
          })
        }
      }
    }
  }

  function inputValidation(){
    console.log(typeof parseFloat(tier_1))
    if(!tier_1 || !tier_2 || !tier_3 || !threshold){
      toast.error("Please enter a value for payments!",{
        position: "top-center",
        autoClose: 5000
      })
    } else if(isNaN(parseFloat(tier_1)) || isNaN(parseFloat(tier_2))  || isNaN(parseFloat(tier_3))  || isNaN(parseFloat(threshold))){
      toast.error("Please insert a number for payments!",{
        position: "top-center",
        autoClose: 5000
      })
    } else if(name.trim().length === 0){
      toast.error("Please select a creator name!",{
        position: "top-center",
        autoClose: 5000
      })
    } else if (bio.trim().length === 0){
      toast.error("Please enter a creator bio!",{
        position: "top-center",
        autoClose: 5000
      })
    } else if((website && !website.includes(".")) || (substack && !substack.includes(".")) || (discord && !discord.includes(".")) || (twitter && !twitter.includes(".")) || (youtube && !youtube.includes("."))){
      toast.error("Please enter valid URLs!",{
        position: "top-center",
        autoClose: 5000
      })      
    } else{
      return true
    }
  }

  function handleCancel(){
    navigate(`/creator/${creator_id}`)
  }

  return(
    <div className="flex flex-col items-center">
      <div className="rounded-2xl bg-panel-blue/40 shadow-xl mx-8 md:mx-20 lg:mx-32 mb-20 w-10/12">
      <div className="flex flex-row justify-end"> 
        <button className="mx-5 mt-5 hover:text-hover-pink transition ease-in-out duration-300" onClick={handleCancel}><GiCancel className="h-6 w-6 "/></button>
      </div>
      <div className="flex flex-col items-center text-left px-6 md:px-12 lg:px-24 pt-6 pb-12">
        <h1 className="font-lilita text-3xl 2xl:text-5xl xl:text-4xl mb-5">Edit Creator Page</h1>
        <img
        className="rounded-lg w-72 h-72 object-cover"
        src={imageUrl === null ? currImage : imageUrl}
        alt={name ?  name : dbUser.display_name}
        />
        <div className="flex flex-col md:flex-row items-center justify-between w-full md:w-9/12 lg:w-6/12 my-3">
          <input
            type="file"
            accept="image/*"
            onChange = {handleFile}
            className="font-raleway self-start file:m-2 file:p-2 file:font-raleway file:text-white file:font-white file:border-0 file:bg-button-purple file:rounded-lg hover:file:bg-hover-pink file:transition file:ease-in-out file:duration-500"
           />
          {
            imageUrl === null ? 
            <button className="mx-2 my-0 md:m-2 p-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500 self-end" onClick = {uploadPostImage} disabled={!postImage}>Upload</button>:
            <button className="mx-2 my-0 md:m-2 p-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500 self-end" onClick = {deleteImage}>Delete</button>
          }
        </div>
        <div className="flex flex-col justify-start w-full">
          <h2>Wallet: {dbUser? `${dbUser.wallet.slice(0, 5)}...${dbUser.wallet.slice(-4)}` : null}</h2>
          <input type="text" value={name} placeholder="Enter a Creator Name" onChange={(e)=>{setName(e.target.value)}} required className="text-black px-2 py-1 my-1 mr-3 rounded-md focus:outline-none"/>
          {name !== null ? <span>{name.trim().length !== 0 ? <p className="invisible">placeholder error</p> : <p className="text-red-400 font-medium bold">Creator name cannot be blank</p>}</span> : <p className="invisible">placeholder error</p>}
          <input type="text" value={bio} placeholder="Write something interesting about yourself..." onChange={(e)=>{setBio(e.target.value)}} required className="text-black px-2 py-1 my-1 mr-3 rounded-md focus:outline-none"/>
          {bio !== null ? <span>{bio.trim().length !== 0 ? <p className="invisible">placeholder error</p> : <p className="text-red-400 font-medium bold">Creator bio cannot be blank</p>}</span> : <p className="invisible">placeholder error</p>}
         <div className="flex flex-row flex-wrap mb-3 w-full">
            <div className="w-full md:w-1/2">
              <h2 className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl my-3">Social Links</h2>
              <div className="flex flex-col items-start"> 
                <div className="flex flex-row items-center w-full">
                  <SlGlobe className="mr-2"/>
                  <input type="text" value={website} placeholder="Website" onChange={(e)=>{setWebsite(e.target.value)}} className="text-black px-2 py-1 my-1 mr-5 w-full rounded-md focus:outline-none"/>
                </div>
                {website ? <p className="ml-6 text-red-400 font-medium bold">{website.includes(".") ? <p className="invisible">placeholder error</p> : "Invalid Website URL"}</p> : <p className="invisible">placeholder error</p>}
              </div>
              <div className="flex flex-col items-start">
                <div className="flex flex-row items-center w-full">
                  <SiTwitter className="w-4 h-4 mr-2"/>
                  <input type="text" value={twitter} placeholder="Twitter" onChange={(e)=>{setTwitter(e.target.value)}} className="text-black px-2 py-1 my-1 mr-5 w-full rounded-md focus:outline-none"/>
                </div>
                {twitter ? <p className="ml-6 text-red-400 font-medium bold">{twitter.includes("twitter.com/") ? <p className="invisible">placeholder error</p> : "Invalid Twitter URL"}</p> : <p className="invisible">placeholder error</p>}
              </div>
              <div className="flex flex-col items-start">
                <div className="flex flex-row items-center w-full">
                  <SiDiscord className="mr-2"/>
                  <input type="text" value={discord} placeholder="Discord" onChange={(e)=>{setDiscord(e.target.value)}} className="text-black px-2 py-1 my-1 mr-5 w-full rounded-md focus:outline-none"/>
                </div>
                {discord ? <p className="ml-6 text-red-400 font-medium bold">{discord.includes("discord.com/") ? <p className="invisible">placeholder error</p> : "Invalid Discord URL"}</p> : <p className="invisible">placeholder error</p>}
              </div>
              <div className="flex flex-col items-start">
                <div className="flex flex-row items-center w-full">
                  <SiYoutube className="mr-2"/>
                  <input type="text" value={youtube} placeholder="YouTube" onChange={(e)=>{setYoutube(e.target.value)}} className="text-black px-2 py-1 my-1 mr-5 w-full rounded-md focus:outline-none"/>
                </div>
                {youtube ? <p className="ml-6 text-red-400 font-medium bold">{youtube.includes("youtube.com/") ? <p className="invisible">placeholder error</p> : "Invalid YouTube URL"}</p> : <p className="invisible">placeholder error</p>}
              </div>
              <div className="flex flex-col items-start">
                <div className="flex flex-row items-center w-full">
                  <SiSubstack className="mr-2"/>
                  <input type="text" value={substack} placeholder="Substack" onChange={(e)=>{setSubstack(e.target.value)}} className="text-black px-2 py-1 my-1 mr-5 w-full rounded-md focus:outline-none"/>
                </div>
                {substack ? <p className="ml-6 text-red-400 font-medium bold">{substack.includes("substack.com/") ? <p className="invisible">placeholder error</p> : "Invalid Substack URL"}</p> : <p className="invisible">placeholder error</p>}
              </div>
            </div>
            <div className="w-full md:w-1/2">
              <h2 className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl my-3">Payment Tiers</h2>
              <div className="flex flex-col items-start">
                <div className="flex flex-row items-center w-full">
                  <FaEthereum className="mr-2"/>
                  <input value={tier_1} placeholder="Tier 1" type="text" required onChange={(e)=>{setTier1(e.target.value)}} className="text-black px-2 py-1 my-1 mr-5 w-full rounded-md focus:outline-none"/>
                </div>
                {tier_1 ? <p className="ml-6 text-red-400 font-medium bold">{isNaN(parseFloat(tier_1)) || parseFloat(tier_1) === 0 ? "Invalid number" : <p className="invisible">placeholder error</p>}</p> : <p className="invisible">placeholder error</p>}
              </div>
              <div className="flex flex-col items-start">
                <div className="flex flex-row items-center w-full">
                  <FaEthereum className="mr-2"/>
                  <input value={tier_2} placeholder="Tier 2" type="text" required onChange={(e)=>{setTier2(e.target.value)}} className="text-black px-2 py-1 my-1 mr-5 w-full rounded-md focus:outline-none"/>
                </div>
                {tier_2 ? <p className="ml-6 text-red-400 font-medium bold">{isNaN(parseFloat(tier_2)) || parseFloat(tier_2) === 0 ? "Invalid number" : <p className="invisible">placeholder error</p>}</p> : <p className="invisible">placeholder error</p>}
              </div>
              <div className="flex flex-col items-start">
                <div className="flex flex-row items-center w-full">
                  <FaEthereum className="mr-2"/>
                  <input value={tier_3} placeholder="Tier 3" type="text" required onChange={(e)=>{setTier3(e.target.value)}} className="text-black px-2 py-1 my-1 mr-5 w-full rounded-md focus:outline-none"/>
                </div>
                {tier_3 ? <p className="ml-6 text-red-400 font-medium bold">{isNaN(parseFloat(tier_3)) || parseFloat(tier_3) === 0  ? "Invalid number" : <p className="invisible">placeholder error</p>}</p> : <p className="invisible">placeholder error</p>}
              </div>
              <p className="invisible">placeholder error</p>
              <h2 className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl py-1">Premium Content Tier</h2>
              <div className="flex flex-col w-full">
                <div className="flex flex-row items-center w-full">
                  <FaEthereum className="mr-2"/>
                  <input type="text" value={threshold} placeholder="Min. Contribution" onChange={(e)=>{setThreshold(e.target.value)}} className="text-black px-2 py-1 my-1 mr-3 w-full rounded-md focus:outline-none"/>
                </div>
                {threshold ? <p className="ml-6 text-red-400 font-medium bold">{isNaN(parseFloat(threshold)) ? "Invalid number" : <p className="invisible">placeholder error</p>}</p> : <p className="invisible">placeholder error</p>}
              </div>
            </div>
            <button onClick={handleSubmit} className="p-2 mt-6 mr-3 w-full bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">Save</button>
          </div>
        </div>
      </div>
    </div>
    <Footer/>
  </div>
  )
}

  
