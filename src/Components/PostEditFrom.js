import React, { useState } from "react";
import { useNavigate } from "react-router";
import { storage } from "../firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import placeholder from "../Images/placeholder.png";
import { v4 } from 'uuid';
import axios from 'axios';
import { GiCancel } from "react-icons/gi";

export default function PostEditForm(props){
  const navigate = useNavigate();
  const [title, setTitle] = useState(props.post.title)
  const [content, setContent] = useState(props.post.content)
  const [creator, setCreator] = useState(props.post.creator)
  const [postImage, setPostImage] = useState('')
  const [imageUrl, setImageUrl] = useState(props.post.image);


  // Store uploaded file
  function handleFile(e){
    if(e.target.files[0]){
      setPostImage(e.target.files[0])
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


  function handleConfirm(e){
    e.preventDefault();
    props.confirmPostEdit(title, content, imageUrl);
  }

  function handleCancel(){
    props.handleCancel();
  }

  return(
    <div className="min-h-screen pt-28 flex flex-col items-center justify-center text-white text-center bg-black/70 absolute top-0">
      <div className="px-24">
        <form className="flex flex-col justify-center items-start text-left px-24 py-12 rounded-2xl bg-panel-blue shadow-xl">
          <div className="flex flex-row justify-between items-center w-full">
            <h1 className="font-lilita text-3xl 2xl:text-5xl xl:text-4xl pb-3">Edit Post</h1>
            <button onClick={handleCancel}><GiCancel className="self-center h-8 w-8 mx-1.5 hover:text-hover-pink transition ease-in-out duration-300"/></button>
          </div>
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
          <button onClick={handleConfirm} className="self-end my-3 py-2 px-8 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">Save Changes</button>
        </form>
      </div>
    </div>
  )
}