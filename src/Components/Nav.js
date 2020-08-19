import React from 'react';
import {Switch, Route, Link} from 'react-router-dom';
import UserContext from '../Context/UserContext';
import SignIn_Modal from './Sign_in_modal';
import SignUp_Modal from './Sign_up_modal';
import './Comp-CSS/Nav.css';
import Logout from './LogOut_Handler';



function Nav() {

  const {userData, setUserData} = React.useContext(UserContext);
const Logout = ()=>{
        setUserData({
          token: undefined,
          user: undefined,
        });
        localStorage.setItem("auth-token", "");
        return(
          <>
          </>
        )
}
    const signInModalRef = React.useRef();
    const signUpModalRef = React.useRef();
    const openLoginModal = ()=>{
     signInModalRef.current.openModal()
    };
    const openSignupModal = ()=>{
        signUpModalRef.current.openModal()
    };
    const openMenu = () =>{
    };
    
    return(
        <>
        <SignIn_Modal ref={signInModalRef}/>
        <SignUp_Modal ref={signUpModalRef}/>
<div className="parentApp">
  <div className="nav"><Link to='/'>
  <img src='/logo.png' className="logo spamMe" onClick/>
  </Link><Link to='/'>
  <span className="shopName">La Fresco</span>
  </Link>
  
    <div className="malang">
    <div className="search">
      <a href="#"><img src="https://img.icons8.com/pastel-glyph/64/000000/search--v2.png" className="searchImg" /></a>
      <input className="input" placeholder={'Search for Products'}></input>

    <div className="info">
        <img src="https://image.flaticon.com/icons/svg/1216/1216895.svg" className="location"/>
        <a href="www.iiti.ac.in" className="loc">IIT INDORE,MP(452020)</a>
        <img src="https://image.flaticon.com/icons/svg/597/597177.svg" className="phone"/>
        <span className="pho">07324 306 717</span>
      </div>
    </div>


    <div className="others">
    {userData.userInfo ? 
            <p style={{"margin-bottom":"-40px","padding":"0px",}}>
            <a onClick={Logout} className="logout">LogOut</a>: <small>{userData.userInfo.username}</small>
          </p>
            :
            <div>
              <a onClick={openLoginModal} className="login">SignIn</a>
      <span className="vl"></span>
      <a onClick={openSignupModal} className="sign">SignUp</a>
            </div>
    }
      <div className="cart">
      <img src="https://image.flaticon.com/icons/svg/126/126083.svg" className="cartLogo"/>
      <Link to='/basket'><div className="cartText">My Cart</div></Link>
      </div>

      <div style={{"textAlign":"center","margin":"0px",}}>
        <Link to="/adminwebsite">Admin Section</Link>
      </div>
    </div>
    </div>

</div>
<div>
  <div className="row menuRow" >
    <div className="col-lg-3 navg">
    <Link to='/'><button className="btn">All Products</button></Link>
    </div>
    <div className="col-lg-3 navg">
    <div className="dropDown">
      <a href = "/#Categories">
    <button className="btn">Categories</button>
    </a>
    </div>
    </div>
    <div className="col-lg-3 navg" >
    <Link to='/help'><button className="btn" >Help</button></Link>
    </div>
    <div className="col-lg-3 navg">
    <Link to='/contact-us'><button className="btn">Contact Us</button></Link>
    </div>
  </div>
</div>

</div>
        </>
    );
}

export default Nav;