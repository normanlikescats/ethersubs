import { useState } from 'react';
import { BiEdit } from 'react-icons/bi';
import { FiCheckSquare } from 'react-icons/fi';
import { RiDeleteBinLine } from 'react-icons/ri';
import { GiCancel } from 'react-icons/gi'
import { useNavigate } from "react-router-dom"

export default function Comment(props){
  const [comment, setComment] = useState(props.comment)
  const [editCommentMode, setEditCommentMode] = useState(false)
  const navigate = useNavigate();
  
  function toggleEditMode(){
    setEditCommentMode(!editCommentMode)
  }
  
  function handleCommentDelete(){
    props.deleteComment(props.id)
  }

  function submitEdit(){
    props.submitEditedComment(comment, props.id)
    setEditCommentMode(!editCommentMode)
  }

  
  function handleUserProfileClick(){
    navigate(`/profile/${props.user.id}`)
  }

  return(
    <>
      <div className="flex flex-row items-center justify-between my-2">
        <div className="flex flex-row justify-start items-center">
          <img className="rounded-full w-10 h-10 mr-2" src={props.photo_url} alt={props.name}/>
          <p onClick={handleUserProfileClick} className="font-raleway text-lg font-bold hover:underline">{props.name}</p>
          <p className='mx-2'>|</p>
          {props.formattedDate !== props.editDate ? <div className="flex flex-row font-raleway"><p >{props.editDate}</p><p className="italic mr-2">(Edited)</p></div> : <p className="font-raleway">{props.formattedDate}</p>}
         </div>
         {!editCommentMode ?
          <>
            <div className="flex flex-row justify-end">
              {props.user.id === props.commentUserId
              ?
                <div>
                  <button onClick={toggleEditMode}><BiEdit className="h-5 w-5 mx-1.5 hover:text-hover-pink transition ease-in-out duration-300"/></button>
                  <button onClick={handleCommentDelete}><RiDeleteBinLine className="h-5 w-5 ml-1.5 hover:text-hover-pink transition ease-in-out duration-300"/></button>
                </div>
              : null
              }
            </div>
          </>         
        : 
          <>
            <div className="flex flex-row justify-end">
              {props.user.id === props.commentUserId
              ?
                <div>
                  <button onClick={submitEdit}><FiCheckSquare className="h-5 w-5 mx-1.5 hover:text-hover-pink transition ease-in-out duration-300"/></button>
                  <button onClick={toggleEditMode}><GiCancel className="h-5 w-5 mx-1.5 hover:text-hover-pink transition ease-in-out duration-300"/></button>
                  <button onClick={handleCommentDelete}><RiDeleteBinLine className="h-5 w-5 ml-1.5 hover:text-hover-pink transition ease-in-out duration-300"/></button>
                </div>
              : null
              }
            </div>
          </>
        }
      </div>
      {!editCommentMode ?
        <p className="font-raleway mb-2">{props.comment}</p>
      : 
        <input className="text-black font-raleway rounded-md px-1.5 mb-2 focus:outline-none w-full" type="text" value={comment} onChange={(e)=>{setComment(e.target.value)}}/>
      }
    </> 
  )
}

