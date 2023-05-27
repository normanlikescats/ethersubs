import React, { useState, useContext, useEffect } from "react";
import { TransactionContext } from '../Context/EthersContext';
import { useNavigate, useParams } from "react-router-dom"; 
import { storage } from "../firebase"
import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
import placeholder from "../Images/placeholder.png";
import { v4 } from 'uuid';
import { GiCancel } from "react-icons/gi";
import axios from 'axios'
import { toast } from 'react-toastify';
import Footer from './Footer'

export default function PostEditForm(props){
  const post_id = useParams().postId;
  const [creator, setCreator] = useState(false)
  const [post, setPost] = useState('')
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [postImage, setPostImage] = useState('')
  const [imageUrl, setImageUrl] = useState('');
  const [threshold, setThreshold] = useState('')
  const { dbUser, accessToken } = useContext(TransactionContext)
  const navigate = useNavigate();


  // Pull Threshold data
  useEffect(()=>{
    if(!dbUser){
      navigate(`/app`)
    } else if(post){
      console.log(post)
      if(dbUser.id === post.creator.user_id){
        setCreator(true)
        console.log(creator)
      } else {
        console.log("get threshold")
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/thresholds/${dbUser.id}/${post.creator.id}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }).then((response)=>{
          if(response.data.length === 0){
            navigate(`/creator/${post.creator.id}`)
          } else if(response.data[0].status === false){
            navigate(`/creator/${post.creator.id}`)
          } else if(response.data[0].status){
            console.log(threshold)
            setThreshold(true)
          }
        })
      }
    }
  },[dbUser,accessToken, post, creator, navigate, threshold])

  // Pull post data
  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/posts/post/${post_id}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }).then((response)=>{
      console.log(response.data[0])
      setPost(response.data[0])
      setTitle(response.data[0].title)
      setImageUrl(response.data[0].image)
      setContent(response.data[0].content)
    })
  },[accessToken, post_id])

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
          console.log(response)
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


  function handleConfirm(e){
    e.preventDefault();
    try{
        const loadingToast = toast.loading(`Updating your post...`, {
          position: "top-center",
          autoClose: 5000
        });
      axios.put(`${process.env.REACT_APP_BACKEND_URL}/posts/edit/${post.id}`,{
        title: title,
        content: content,
        image: imageUrl
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }).then((response)=>{
        toast.dismiss(loadingToast)
        toast.success("Post updated!",{
          position: "top-center",
          autoClose: 5000
        })
        console.log(response.data[1][0])
        navigate(`/posts/${post.id}`);
      })
    } catch(err){
      console.log(err)
    }
  }

  function handleCancel(){
    navigate(`/posts/${post.id}`);
  }

  return(
    <div className="flex flex-col items-center justify-center">
        <form className="mx-1 md:mx-16 lg:mx-28 mb-28 w-10/12 md:w-8/12 rounded-2xl bg-panel-blue/40 shadow-xl">
          <div className="flex flex-row flex-nowrap justify-end">
            <button onClick={handleCancel}><GiCancel className="self-center h-6 w-6 mr-5 mt-5 hover:text-hover-pink transition ease-in-out duration-300"/></button>
          </div>
          <div className="flex flex-col justify-center items-start text-left px-6 md:px-12 lg:px-24 pt-6 pb-12">
            <div className="flex flex-row justify-start items-center w-full">
              <h1 className="font-lilita text-3xl 2xl:text-5xl xl:text-4xl pb-1">Edit Post</h1>
            </div>
            <label className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl my-1.5">Post Image</label>
            <img 
              src={imageUrl !== null ? imageUrl : placeholder}
              alt="Post Cover"
              className="rounded-lg w-full"
            />
            <div className="flex flex-row items-center justify-between w-full my-1.5">
              <input
                type="file"
                accept="image/*"
                onChange = {handleFile}
                className="font-raleway file:m-2 file:p-2 file:font-raleway file:text-white file:font-white file:border-0 file:bg-button-purple file:rounded-lg hover:file:bg-hover-pink file:transition file:ease-in-out file:duration-500"
              />
              {
                imageUrl !== null ? 
                <button className="m-2 p-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500" onClick = {deleteImage}>Delete</button>: 
                <button className="m-2 p-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500" onClick = {uploadPostImage} disabled={!postImage}>Upload</button>
              }
            </div>
            <label className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl my-1.5">Post Title</label>
            <input type="text" value={title} onChange={(e)=>{setTitle(e.target.value)}} className="px-2 py-0.25 w-full h-8 font-raleway text-black rounded-md focus:outline-none"/>
            <label className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl my-1.5">Post Content</label>
            <textarea value={content} onChange={(e)=>{setContent(e.target.value)}} className="px-2 py-1.5 w-full h-40 font-raleway text-black rounded-md focus:outline-none"/>
            <button onClick={handleConfirm} className="self-end my-3 py-2 px-3 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">Save Changes</button>
          </div>
        </form>
        <Footer/>
    </div>
  )
}