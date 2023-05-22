import React from "react";
import bubbles from "../Images/bubbles.gif"


export default function Landing(){
  return(
    <div className="flex flex-col grow justify-center">
      <h1 className="z-10 font-lilita text-7xl 2xl:text-9xl xl:text-8xl">
        EtherSubs
      </h1>
      <p className="z-10 pt-4 pb-9 px-8 font-raleway text-2xl 2xl:text-4xl xl:text-3xl">
        Support your favourite creators, regardless of where they are.
      </p>
      <p className="z-10 px-8 font-raleway text-xl xl:text-2xl">
        Powered by Ethereum.
      </p>
      <img src={bubbles} className="z-0 opacity-0 lg:opacity-30 fixed top-0 right-0 h-screen" alt=""/>
      <img src={bubbles} className="z-0 opacity-30 fixed top-0 left-1/4 lg:left-0 h-screen" alt=""/>
    </div>
  )
}