import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TbSearch } from 'react-icons/tb'

export default function Searchbar(props){
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [results, setResults] = useState('');

  function handleSubmit(e){
    e.preventDefault();
    if(results){
      props.handleSubmit(results);
    } else{
      document.getElementById("search-field").focus()
    }
  }

  function handleChange(e){
    setInput(e.target.value)
    if(e.target.value === ''){
      setResults('')
    } else{
      const newFilter = props.creators.filter((value)=>{
        return value.name.toLowerCase().includes(e.target.value.toLowerCase())
      })
      setResults(newFilter);
    }
  }

  function handleKeyPress(e){
    handleSubmit(e)
  }

  function handleClick(id){
    if(id){
      navigate(`/creator/${id}`)
    }
  }

  let searchResults;
  if(results){
    searchResults = results.map((result)=>{
      return(
        <div onClick={()=>handleClick(result.id)} className="p-0.5 flex flex-row items-center text-black odd:bg-slate-200 even:bg-slate-100 hover:bg-slate-400 first:rounded-t-md last:rounded-b-md">
          <img src={result.image} alt={result.name} className="w-12 mr-2 aspect-square"/>
          <p>{result.name}</p>
        </div>
      )
    })
  }

  return(
    <div className="w-10/12 lg:w-1/2">
      <form className="flex flex-col">
        <h2 className="font-lilita text-xl 2xl:text-3xl xl:text-2xl">Find a Creator!</h2>
        <div className="flex flex-row items-center">
          <input type="text" id="search-field" value={input} onChange={handleChange} className="px-2 py-0.25 w-full h-8 font-raleway text-black rounded-md focus:outline-none"/>
          <TbSearch type="submit" onClick={handleSubmit} onKeyDown={handleKeyPress} className="h-9 w-9 ml-2 hover:border-solid hover:cursor-pointer transition ease-in-out duration-500"/>
        </div>
      </form>
      <div className="w-11/12">
        {input ? searchResults : null}
      </div>
    </div>
  )
}