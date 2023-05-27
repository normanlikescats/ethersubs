import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { TransactionContext } from '../Context/EthersContext';
import { storage } from "../firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import placeholder from "../Images/placeholder.png";
import { v4 } from 'uuid';
import axios from 'axios';
import { GiCancel } from 'react-icons/gi'
import { toast } from 'react-toastify';
import Footer from './Footer'

export default function PostForm(){
  const creator_id = useParams().creatorId
  const navigate = useNavigate();
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [creator, setCreator] = useState('')
  const [postImage, setPostImage] = useState('')
  const [imageUrl, setImageUrl] = useState(null);
  const { dbUser, accessToken } = useContext(TransactionContext)

  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/creators/${creator_id}`).then((response)=>{
      setCreator(response.data[0])
      if(response.data[0].user_id !== dbUser.id){
        alert("Please connect your wallet")
        navigate(`/creator/${creator_id}`)
      } 
    })
  },[creator_id, dbUser.id, navigate])

  // Store uploaded file
  function handleFile(e){
    if(e.target.files[0]){
      setPostImage(e.target.files[0])
      console.log(e.target.files[0])
    }
  }

  // Upload file to Firebase
  function uploadPostImage(e){
    e.preventDefault();
    const imageRef = ref(storage, `images/${postImage.name}${v4()}`)
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

  // Remove uploaded image
  function deleteImage(e){
    e.preventDefault();
    setPostImage('');
    setImageUrl(null);
  }

  function handlePostSubmit(e){
    e.preventDefault();

    try{
      axios.post(`${process.env.REACT_APP_BACKEND_URL}/posts/create`,{
        creator_id: creator_id,
        title: title,
        content: content,
        image: imageUrl
      },{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }).then((response)=>{
        console.log(response)
        navigate(`/posts/${response.data.id}`)
      })
    } catch(err){
      console.log(err)
    }
  }
  
  function handleCancel(){
    navigate(`/creator/${creator_id}`)
  }

  return(
    <div className="px-16 md:px-24 lg:px-32 mb-20">
      {
        creator ?
          <div className="rounded-2xl bg-panel-blue/40 shadow-xl">
            <div className="flex flex-row justify-end"> 
              <button className="mx-5 mt-5 hover:text-hover-pink transition ease-in-out duration-300" onClick={handleCancel}><GiCancel className="h-6 w-6 "/></button>
            </div>
            <div className="flex flex-col justify-center items-start text-left px-6 md:px-12 lg:px-24 pt-6 pb-12">
              <h1 className="font-lilita text-3xl 2xl:text-5xl xl:text-4xl pb-3">Create Post</h1>
              <label className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl my-3">Post Image</label>
              <img 
                src={imageUrl !== null ? imageUrl : placeholder}
                alt="Post Cover"
                className="rounded-lg w-full h-72 object-cover"
                />
              <div className="flex flex-col md:flex-row items-center justify-between w-full my-3">
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
              <label className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl my-3">Post Title</label>
              <input type="text" value={title} onChange={(e)=>{setTitle(e.target.value)}} className="px-2 py-0.25 w-full h-8 font-raleway text-black rounded-md focus:outline-none"/>
              <label className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl my-3">Post Content</label>
              <textarea value={content} onChange={(e)=>{setContent(e.target.value)}} className="px-2 py-1.5 w-full h-96 font-raleway text-black rounded-md focus:outline-none"/>
              <button onClick={handlePostSubmit} className="self-end my-3 py-2 px-8 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">Post</button>
            </div>
          </div>
        : <p className="font-lilita text-7xl 2xl:text-9xl xl:text-8xl">Access Denied</p>
      }
      <Footer/>
    </div>
  )
}