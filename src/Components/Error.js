import bubbles from "../Images/bubbles.gif"

export default function Error(){
  return(
    <div>
      <h1 className="font-lilita text-7xl 2xl:text-9xl xl:text-8xl">404 NOT FOUND</h1>
      <img src={bubbles} className="z-0 opacity-0 lg:opacity-30 fixed top-0 right-0 h-screen" alt=""/>
      <img src={bubbles} className="z-0 opacity-30 fixed top-0 left-1/4 lg:left-0 h-screen" alt=""/>
    </div>
  )
}