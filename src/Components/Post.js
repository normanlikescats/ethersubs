import axios from "axios"
import { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { TransactionContext } from '../Context/EthersContext';
import Comment from "./Comment";
import { BiEdit } from 'react-icons/bi'
import { RiDeleteBinLine, RiErrorWarningLine } from 'react-icons/ri';
import Footer from './Footer'
import { toast } from 'react-toastify';
import Popup from 'reactjs-popup';

export default function Post(){
  const post_id = useParams().postId;
  const navigate = useNavigate();
  const [post, setPost] = useState('')
  const [comments, setComments] = useState('')
  const [newComment, setNewComment] = useState(null)
  const [threshold, setThreshold] = useState('')
  const [creator, setCreator] = useState(false)
  const { dbUser, accessToken } = useContext(TransactionContext)
  const [commentCounter, setCommentCounter] = useState(0)

  // Pull Threshold data
  useEffect(()=>{
    if(!dbUser){
      navigate("/home")
    } else if(post){
      if(dbUser.id === post.creator.user_id){
        setCreator(true)
      } else {
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
  },[dbUser,accessToken, post, navigate, threshold])

  // Pull post data
  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/posts/post/${post_id}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }).then((response)=>{
      setPost(response.data[0])
    })
  },[accessToken, post_id])

  // Pull comment data
  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/comments/post/${post_id}`,{
      headers: {
          Authorization: `Bearer ${accessToken}`,
        }
    }).then((response)=>{
      setComments(response.data)
    })
  },[accessToken, post_id])

  function handleNewComment(){
    if(inputValidation()){
      try{
        axios.post(`${process.env.REACT_APP_BACKEND_URL}/comments/create`,{
          user_id: dbUser.id,
          post_id: post.id,
          comment: newComment
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        }).then((response)=>{
          let createdComment = response.data
          createdComment.user = {
            display_name: dbUser.display_name,
            photo_url: dbUser.photo_url
          }
          let newComments = [...comments]
          newComments.unshift(createdComment)
          setNewComment('')
          setCommentCounter(commentCounter + 1)
          setComments(newComments)
          toast.success("Comment posted!",{
            position: "top-center",
            autoClose: 5000
          })
        })
      } catch(err){
        console.log(err)
        toast.error("Comment failed to post!",{
          position: "top-center",
          autoClose: 5000
        })
      }
    } else{
      console.log("error")
    }
  }

  function submitEditedComment(comment, id){
    try{
      axios.put(`${process.env.REACT_APP_BACKEND_URL}/comments/edit/${id}`,{
        comment: comment
      },{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }).then((response)=>{
        toast.success("Comment updated!",{
          autoClose: 5000,
          position: "top-center"
        })
        let newComments = [...comments]
        const index = newComments.findIndex(object => {
          return object.id === id;
        });
        let editedComment = newComments[index]
        editedComment['comment'] = response.data[1][0].comment
        newComments.splice(index, 1, editedComment)
        setComments(newComments)
      })
    } catch(err){
      console.log(err)
    }
  }

  function deleteComment(id){
    try{
      axios.delete(`${process.env.REACT_APP_BACKEND_URL}/comments/delete/${id}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }).then((response)=>{
        toast.success("Comment deleted!",{
          autoClose: 5000,
          position: "top-center"
        })
        let newComments = [...comments]
        const index = newComments.findIndex(object => {
          return object.id === id;
        });
        newComments.splice(index, 1)
        setComments(newComments)
      })
    } catch(err){
      console.log(err)
    }
  }


  function handlePostDelete(){
    try{
      axios.delete(`${process.env.REACT_APP_BACKEND_URL}/posts/delete/${post.id}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }).then(()=>{
        toast.success("Post deleted!",{
          autoClose: 5000,
          position: "top-center"
        })
        navigate(`/creator/${post.creator.id}`)
      })
    }catch (err){
      console.log(err)
    }
  }

  function handlePostEdit(){
    navigate(`/posts/${post.id}/edit`)
  }

  function handleCreatorProfileClick(){
    navigate(`/creator/${post.creator.id}`)
  }

  function inputValidation(){
    if (newComment.trim().length === 0){
      toast.error("Comment cannot be empty!",{
        position: "top-center",
        autoClose: 5000
      })
    } else{
      return true
    }
  }

  let commentItems;
  if(comments){
    commentItems = comments.map((comment, id)=>{
      let editDate = new Date(comment.updated_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).split(",")[1]
      let formattedDate = new Date(comment.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).split(",")[1]
      return(
        <Comment
          key={id}
          id = {comment.id}
          user = {dbUser}
          commentUserId = {comment.user_id}
          name = {comment.user.display_name}
          photo_url= {comment.user.photo_url}
          comment = {comment.comment}
          editDate = {editDate}
          formattedDate = {formattedDate}
          submitEditedComment = {submitEditedComment}
          deleteComment={deleteComment}
        /> 
      )
    })
  }

  let postDate = new Date(post.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
  let postEditDate = new Date(post.updated_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' })
  let editButtons = (
    <div className="flex flex-row flex-nowrap justify-end">
      <button onClick={handlePostEdit}><BiEdit className="h-6 w-6 mr-2 mt-5 hover:text-hover-pink transition ease-in-out duration-300"/></button>
      <Popup
        trigger={<button><RiDeleteBinLine className="h-6 w-6 mr-5 mt-5 hover:text-hover-pink transition ease-in-out duration-300"/></button>}
        modal
      >
      {close => (
        <div className="flex flex-col justify-center items-center rounded-lg bg-[#4165b3] text-white -m-3 px-3 pb-3">
          <RiErrorWarningLine className="h-8 w-8 mb-2 mt-8"/>
          <p>Are you sure you want to delete this post?</p>
          <div className="flex flex-row justify-center items-center mt-2">
          <button className="p-2 m-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500" onClick={handlePostDelete}>Confirm</button>
          <button
            className="p-2 m-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500"
            onClick={() => {
              close();
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      )}
    </Popup>
  </div>
  )

  return(
    <div className="flex flex-col items-center">
      <div className="rounded-2xl bg-panel-blue/40 shadow-xl mx-4 md:mx-20 lg:mx-32 mb-20 w-11/12 md:w-10/12 lg:w-8/12">
        {creator ? 
          editButtons:
          null 
        }
        {post ?
        <div className="flex flex-col items-center text-left px-4 md:px-12 lg:px-20 pt-6 pb-12 ">
          <div className="font-raleway w-full">
            <h1 className="font-lilita text-3xl 2xl:text-5xl xl:text-4xl pb-3">{post.title}</h1>
            <div className="flex flex-row items-center justify-between my-2">
              <div className="flex flex-row justify-start items-center">
                <img className="h-10 w-10 rounded-full mr-2" src={post.creator.image} alt={post.creator.name}/>
                <p className="font-raleway text-sm md:text-base lg:text-lg font-bold hover:underline" onClick={handleCreatorProfileClick}>{post.creator.name}</p>
              </div>
              <>
                {postDate !== postEditDate ? 
                <div className="flex flex-row text-sm md:text-base lg:text-lg font-raleway"><p className="italic mr-2">(Edited)</p><p>{postDate}</p></div>:
                <p>{postDate}</p>}
              </>
            </div>
            {
              post.image ? 
              <img className="rounded-lg w-full" src={post.image} alt={post.title}/>:
              null
            }
            <p className="my-6">{post.content}</p>
          </div>
          <div className="w-full">
            <h2 className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl mb-2">Drop a Comment!</h2>
            <div className="flex flex-col">
              <input type="text" value={newComment} onChange={(e)=>{setNewComment(e.target.value)}} className="text-black font-raleway rounded-md px-1 focus:outline-none w-full"/>
              {newComment !== null && commentCounter < 0 ? <span>{newComment.trim().length !== 0 ? <p className="invisible">placeholder error</p> : <p className="text-red-400 font-medium bold">Comment cannot be blank</p>}</span> : <p className="invisible">placeholder error</p>}
              <button onClick={handleNewComment} className="p-2 my-2 w-20 md:w-50 self-end bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">Post</button>
            </div>
            <h2 className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl mb-2">Comments</h2>
            {comments.length === 0 ? <p>No comments yet!</p> : commentItems}
          </div>
        </div>       
       : null}
      </div>
      <Footer/>
    </div>
  )
}