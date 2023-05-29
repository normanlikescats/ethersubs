import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import placeholder from "../Images/placeholder.png";

export default function PostList(props){
  const [posts, setPosts] = useState('')
  const navigate = useNavigate();
  
  useEffect(()=>{
    axios.get(`${process.env.REACT_APP_BACKEND_URL}/posts/all/${props.creator_id}`,{
      headers: {
        Authorization: `Bearer ${props.accessToken}`,
        }
      }).then((response)=>{
      setPosts(response.data)
    })
  }, [props.creator_id, props.accessToken])

  function handlePostClick(id){
    navigate(`/posts/${id}`)
  }

  let postItems;
  if(posts){
    postItems = posts.map((post, id)=>{
      let truncatedContent = post.content.slice(0,120)
      return(
        <div key={id} onClick={()=>{handlePostClick(post.id)}} className="flex flex-row p-1 my-2 border-transparent border-2 hover:border-solid hover:border-2 hover:border-white rounded-lg transition ease-in-out duration-300">
            <img
            className="w-16 h-16 object-cover rounded-md mr-2"
            src={post.image ? post.image : placeholder}
            alt={post.title}
            />
          <div>
            <h6 className="font-lilita">{post.title}</h6>
            <div className="font-raleway"> 
              {truncatedContent}... <span className="font-raleway hover:underline hover:text-hover-pink" onClick={()=>{handlePostClick(post.id)}}> Continue reading →</span>
            </div>
          </div>
        </div>
      )
    })
  }

  return(
    <div>
      {postItems}
    </div>
  )
}
