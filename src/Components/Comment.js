import { useState } from 'react';
import { BiEdit } from 'react-icons/bi';
import { FiCheckSquare } from 'react-icons/fi';
import { RiDeleteBinLine, RiErrorWarningLine } from 'react-icons/ri';
import { GiCancel } from 'react-icons/gi'
import { useNavigate } from "react-router-dom"
import { toast } from 'react-toastify';
import Popup from 'reactjs-popup';

export default function Comment(props){
  const [comment, setComment] = useState(null)
  const [editCommentMode, setEditCommentMode] = useState(false)
  const navigate = useNavigate();

  function toggleEditMode(){
    setComment(props.comment)
    setEditCommentMode(!editCommentMode)
  }
  
  function handleCommentDelete(){
    props.deleteComment(props.id)
    setComment(null)
  }

  function submitEdit(){
    if(inputValidation()){
      props.submitEditedComment(comment, props.id)
      setEditCommentMode(!editCommentMode)
    }
  }

  
  function handleUserProfileClick(){
    navigate(`/profile/${props.commentUserId}`)
  }

  function inputValidation(){
    if (comment.trim().length === 0){
      toast.error("Comment cannot be empty",{
        position: "top-center",
        autoClose: 5000
      })
    } else{
      return true
    }
  }

  return(
    <>
      <div className="flex flex-row items-center justify-between my-2">
        <div className="flex flex-row justify-start items-center">
          <img className="rounded-full w-10 h-10 mr-2" src={props.photo_url} alt={props.name}/>
          <p onClick={handleUserProfileClick} className="font-raleway text-lg font-bold hover:underline">{ props.name ? props.name : `Anon ${props.commentUserId}` }</p>
          <p className='mx-2'>|</p>
          {props.formattedDate !== props.editDate ? <div className="flex flex-row font-raleway"><p >{props.editDate}</p><p className="italic mr-2">(Edited)</p></div> : <p className="font-raleway">{props.formattedDate}</p>}
         </div>
         {!editCommentMode ?
          <>
            <div className="flex flex-row flex-nowrap justify-end">
              {props.user.id === props.commentUserId
              ?
                <div>
                  <button onClick={toggleEditMode}><BiEdit className="h-5 w-5 mx-1.5 hover:text-hover-pink transition ease-in-out duration-300"/></button>
                  <Popup
                    trigger={<button><RiDeleteBinLine className="h-5 w-5 mx-1.5 hover:text-hover-pink transition ease-in-out duration-300"/></button>}
                    modal
                  >
                  {close => (
                    <div className="flex flex-col justify-center items-center rounded-lg bg-[#4165b3] text-white -m-3 px-3 pb-3">
                      <RiErrorWarningLine className="h-8 w-8 mb-2 mt-8"/>
                      <p>Are you sure you want to delete this comment?</p>
                      <div className="flex flex-row justify-center items-center mt-2">
                      <button className="p-2 m-2 bg-button-purple rounded-lg hover:bg-hover-pink transition ease-in-out duration-500" onClick={handleCommentDelete}>Confirm</button>
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

