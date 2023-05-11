import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router";
import { TransactionContext } from '../Context/EthersContext';
import { storage } from "../firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import placeholder from "../Images/placeholder.png";
import { v4 } from 'uuid';
import axios from 'axios';

export default function PostForm(){
  const creator_id = useParams().creatorId
  const navigate = useNavigate();
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [creator, setCreator] = useState('')
  const [postImage, setPostImage] = useState('')
  const [imageUrl, setImageUrl] = useState(null);
  const { user } = useContext(TransactionContext)

  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/creators/${creator_id}`).then((response)=>{
      setCreator(response.data[0])
      checkConnected(response.data[0]);
    })
  },[])

  // Check if the user is the creator
  function checkConnected(creator){
    if(creator.user_id !== user.id){
      alert("Please connect your wallet")
      navigate(`/creator/${creator_id}`)
    } 
  }

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
          alert("uploaded")
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
      }).then((response)=>{
        console.log(response)
        navigate(`/posts/${response.data.id}`)
      })
    } catch(err){
      console.log(err)
    }
  }

  return(
    <div className="mb-32 px-24">
      {
        creator ?
          <form className="flex flex-col justify-center items-start text-left px-24 py-12 rounded-2xl bg-panel-blue/40 shadow-xl">
            <h1 className="font-lilita text-3xl 2xl:text-5xl xl:text-4xl pb-3">Create Post</h1>
            <label className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl my-3">Post Image</label>
            <img 
              src={imageUrl !== null ? imageUrl : placeholder}
              alt="Post Cover"
              className="rounded-lg w-full"
              />
            <div className="flex flex-row items-center justify-between w-full my-3">
              <input
              type="file"
              accept="image/*"
              onChange = {handleFile}
              className="font-raleway file:m-2 file:p-2 file:font-raleway file:text-white file:font-white file:border-0 file:bg-button-purple file:rounded-lg hover:file:bg-hover-pink file:transition file:ease-in-out file:duration-500"
              />
              {
                imageUrl !== null ? 
                <button className="m-2 p-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500" onClick = {deleteImage}>Delete image</button>: 
                <button className="m-2 p-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500" onClick = {uploadPostImage} disabled={!postImage}>Upload image</button>
              }
            </div>
            <label className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl my-3">Post Title</label>
            <input type="text" value={title} onChange={(e)=>{setTitle(e.target.value)}} className="px-2 py-0.25 w-full h-8 font-raleway text-black rounded-md focus:outline-none"/>
            <label className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl my-3">Post Content</label>
            <textarea value={content} onChange={(e)=>{setContent(e.target.value)}} className="px-2 py-1.5 w-full h-96 font-raleway text-black rounded-md focus:outline-none"/>
            <button onClick={handlePostSubmit} className="self-end my-3 py-2 px-8 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">Post</button>
          </form>
        : <p className="font-lilita text-7xl 2xl:text-9xl xl:text-8xl">Access Denied</p>
      }
    </div>
  )
}