import { Link } from "react-router-dom";
import logo from "../ethersubslogo.png"
import "./Navbar.css"

export default function Navbar() {
  return (
    <div className="navbar">
        <Link to="/">
            <img src={logo} alt="EtherSubs"  style={{width: "50px", margin: "10px"}}/>
        </Link>
        <Link to="/about" className="raleway">About</Link>
        <Link to="www.google.com" className="raleway">Protocol</Link>
        <Link><button className="raleway">Enter App</button></Link>
    </div>
  );
}
