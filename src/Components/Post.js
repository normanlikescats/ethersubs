import axios from "axios"
import { useEffect, useState, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { TransactionContext } from '../Context/EthersContext';
import Comment from "./Comment";
import { BiEdit } from 'react-icons/bi'
import { RiDeleteBinLine } from 'react-icons/ri';
import PostEditForm from "./PostEditFrom";

export default function Post(){
  const post_id = useParams().postId;
  const navigate = useNavigate();
  const [post, setPost] = useState('')
  const [comments, setComments] = useState('')
  const [newComment, setNewComment] = useState('')
  const [threshold, setThreshold] = useState('')
  const [postEditMode, setPostEditMode] = useState(false)
  const { dbUser, accessToken } = useContext(TransactionContext)

  console.log(threshold)
  // Pull Threshold data
  useEffect(()=>{
    if(!dbUser){
      navigate(`/app`)
    } else if(post){
      if(dbUser.id === post.creator.user_id){
        console.log("creator")
      } else {
        console.log("get threshold")
        axios.get(`${process.env.REACT_APP_BACKEND_URL}/thresholds/${dbUser.id}/${post.creator.id}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }).then((response)=>{
          if(response.data.length === 0){
            navigate(`/creator/${post.creator.id}`)
          } else if(response.data[0].total_contribution < post.creator.threshold){
            navigate(`/creator/${post.creator.id}`)
          } else if(response.data[0].total_contribution >= post.creator.threshold){
            setThreshold(true)
          }
        })
      }
    }
  },[dbUser,accessToken, post, navigate])

  // Pull post data
  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/posts/post/${post_id}`,{
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      }).then((response)=>{
      console.log(response.data[0])
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
      console.log(response.data)
      setComments(response.data)
    })
  },[accessToken, post_id])

  function handleNewComment(){
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
        console.log(response.data)
        let createdComment = response.data
        createdComment.user = {
          display_name: dbUser.display_name,
          photo_url: dbUser.photo_url
        }
        let newComments = [...comments]
        newComments.unshift(createdComment)
        setNewComment('')
        setComments(newComments)
        console.log(newComments)
      })
    } catch(err){
      console.log(err)
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
        console.log(response.data[1][0])
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
        console.log(response)
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
        navigate(`/creator/${post.creator.id}`)
      })
    }catch (err){
      console.log(err)
    }
  }

  function confirmPostEdit(title, content, imageUrl){
    try{
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
        console.log(response.data[1][0])
        let newPost = {...post}
        newPost.content = response.data[1][0].content
        newPost.title = response.data[1][0].title;
        newPost.imageUrl = response.data[1][0].imageUrl;
        setPost(newPost)
        setPostEditMode(false)
      })
    } catch(err){
      console.log(err)
    }
  }

  function handlePostEdit(){
    setPostEditMode(true)
  }

  function handleCancel(){
    setPostEditMode(false)
  }

  function handleCreatorProfileClick(){
    navigate(`/creator/${post.creator.id}`)
  }

  let commentItems;
  if(comments){
    commentItems = comments.map((comment)=>{
      let editDate = new Date(comment.updated_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).split(",")[1]
      let formattedDate = new Date(comment.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' }).split(",")[1]
      return(
        <Comment
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
  

  return(
    <>
      {postEditMode ?
        <PostEditForm
          post={post}
          handleCancel={handleCancel}
          confirmPostEdit = {confirmPostEdit}
        /> : 
        null}
      <div className="flex flex-col items-center text-left px-24 py-12 rounded-2xl bg-panel-blue/40 shadow-xl mx-32 mb-32">
        {post ?
        <>
          <div className="font-raleway">
            <div className="flex flex-row justify-between items-center">
              <h1 className="font-lilita text-3xl 2xl:text-5xl xl:text-4xl pb-3">{post.title}</h1>
              {dbUser.id === post.creator.user_id ?
              <div className="flex flex-row flex-nowrap">
                <button onClick={handlePostEdit}><BiEdit className="h-8 w-8 mx-1.5 hover:text-hover-pink transition ease-in-out duration-300"/></button>
                <button onClick={handlePostDelete}><RiDeleteBinLine className="h-8 w-8 ml-1.5 hover:text-hover-pink transition ease-in-out duration-300"/></button>
              </div> :
              null}
            </div>
            <div className="flex flex-row items-center justify-between my-2">
              <div className="flex flex-row justify-start items-center">
                <img className="h-10 w-10 rounded-full mr-2" src={post.creator.image} alt={post.creator.name}/>
                <p className="font-raleway text-lg font-bold hover:underline" onClick={handleCreatorProfileClick}>{post.creator.name}</p>
              </div>
              <>
                {postDate !== postEditDate ? 
                <div className="flex flex-row font-raleway"><p className="italic mr-2">(Edited)</p><p>{postDate}</p></div>:
                <p>{postDate}</p>}
              </>
            </div>
            <img className="rounded-lg w-full" src={post.image} alt={post.title}/>
            <p className="my-6">{post.content}</p>
          </div>
          <div className="w-full">
            <h2 className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl mb-2">Drop a Comment!</h2>
            <div className="flex flex-col">
              <input type="text" value={newComment} onChange={(e)=>{setNewComment(e.target.value)}} className="text-black font-raleway rounded-md px-1 focus:outline-none w-full"/>
              <button onClick={handleNewComment} className="p-2 my-2 w-1/5 self-end bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500">Post Comment</button>
            </div>
            <h2 className="font-lilita text-2xl 2xl:text-4xl xl:text-3xl mb-2">Comments</h2>
            {commentItems}
          </div>
        </>       
       : null}
      </div>
    </>
  )
}