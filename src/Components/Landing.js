import React from "react";
import bubbles from "../bubbles.gif"

export default function Landing(){
  return(
    <div>
      <h1 className="lilita-one">EtherSubs</h1>
      <h4 className="raleway">Support your favourite creators, regardless of where they are.</h4>
      <h5 className="raleway">Powered by Ethereum.</h5>
      <img src={bubbles} className="gif" alt=""/>
    </div>
  )
}