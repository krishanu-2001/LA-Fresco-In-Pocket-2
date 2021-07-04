import React, { useEffect } from "react";
import { Switch, Route, Link } from "react-router-dom";
import SignIn_Modal from "./Sign_in_modal";
import SignUp_Modal from "./Sign_up_modal";
import useWindowDimensions from "../Utilities/WindowDimension";
import "./Comp-CSS/Nav.css";
import Cookies from "js-cookie";
import { useHistory } from "react-router-dom";
import { scrollCat } from "./Item_body";
import Axios from "axios";

var navTransi = true;
const scrollToRef = (ref) => window.scrollTo(0, ref.current.offsetTop);

function Nav() {
  const history = useHistory();
  const signInModalRef = React.useRef();
  const signUpModalRef = React.useRef();
  const openLoginModal = () => {
    signInModalRef.current.openModal();
  };
  const openSignupModal = () => {
    signUpModalRef.current.openModal();
  };
  const [navStyle, setNavStyle] = React.useState("nav-links");
  const [navPanelStyle, setNPS] = React.useState("navPanel");
  const [shopNameClass, setSNC] = React.useState("shopName");
  const [navClass, setNavClass] = React.useState("");
  const [navSearchOP, setNSOP] = React.useState("nav-search-div");
  const [categoryDropdown, setCDD] = React.useState("dropdown-category");
  const [catClass, setCatClass] = React.useState(["Category", "cat-class"]);
  const [navItemList, setNavItemList] = React.useState([]);
  const [navSearchMeBox, setSMB] = React.useState("");
  const [searchThis, setsearchThis] = React.useState("");

  const toggleCat = () => {
    if (categoryDropdown === "dropdown-category") {
      setCDD("dropdown-category show");
      setCatClass(["Close", "cat-class show"]);
    } else {
      setCDD("dropdown-category");
      setCatClass(["Category", "cat-class"]);
    }
  };

  const toggleNav = () => {
    if (navTransi) {
      if (navStyle === "nav-links") {
        setNavStyle("nav-links open");
        setNPS("navPanel open");
        setSNC("shopName open");
        setNavClass("nav-open");
      } else {
        setNavStyle("nav-links");
        setNPS("navPanel");
        navTransi = false;
        setTimeout(() => {
          setSNC("shopName");
          setNavClass("");
          navTransi = true;
        }, 1000);
      }
    }
  };

  /* search bar */
  const { windowWidth } = useWindowDimensions();
  if (windowWidth >= 800 && navSearchOP !== "nav-search-div") {
    setNSOP("nav-search-div");
  }
  const onclickNavSearch = () => {
    if (windowWidth <= 800) {
      setNSOP("nav-search-div open");
    }
  };

  const onclickNavSearchClose = (e) => {
    searchMeClose();
    setNSOP("nav-search-div");
  };
  /* Handles change in search box */
  const onEnterSearch = (e) => {
    var key = e.target.value;
    for (var i = 0; i < key.length; i++) {
      if (
        (key[i] >= "a" && key[i] <= "z") ||
        (key[i] >= "A" && key[i] <= "Z") ||
        (key[i] >= "0" && key[i] <= "9")
      ) {
        // ok
      } else {
        key = "";
        searchMeClose();
      }
    }
    setsearchThis(key);
    if (key === "") {
      searchMeOpen([]);
    }
    const fetchData = async (query) => {
      const res = await Axios.get(
        `http://localhost:5000/search/byname/${query}`
      );
      if (res.status === 200) searchMeOpen(res.data);
      else searchMeOpen([]);
    };

    fetchData(key);
  };

  /* Handles printing of searched box */
  const searchMeOpen = (datalist) => {
    var sQuery = [];
    if (datalist.length === 0) {
      setSMB(sQuery);
    } else {
      var cct = 0;
      sQuery.push(
        <i
          className="fa fa-times"
          aria-hidden="true"
          onClick={searchMeClose}
          style={{ right: "0", padding: "2px", position: "absolute" }}
        ></i>
      );
      for (var i = 0; i < datalist.length; i++) {
        sQuery.push(
          <p style={{ fontSize: "0.8em" }}>
            <a href={"/individual/" + datalist[i]}>{datalist[i]}</a>
          </p>
        );
        cct += 1;
        if (cct > 3) {
          break;
        }
      }
      setSMB(sQuery);
    }
  };
  /* popup closes on pressing x */
  const searchMeClose = () => {
    setsearchThis("");
    setSMB([]);
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await Axios.get("http://localhost:5000/items/");
      setNavItemList(res.data);
    };

    fetchData();
  }, []);

  /* search ends */

  const gotoHome = () => {
    history.push("/");
  };

  const scrollCatNav = (catRef) => {
    toggleCat();
    if (windowWidth <= 800) toggleNav();
    scrollCat(catRef);
  };

  return (
    <>
      <SignIn_Modal ref={signInModalRef} />
      <SignUp_Modal ref={signUpModalRef} />
      <nav className={navClass} id="Top">
        <div className="hamburger" onClick={toggleNav}>
          <div className="line"></div>
          <div className="line"></div>
          <div className="line"></div>
        </div>
        <img onClick={gotoHome} src="/logo.png" alt="logo" className="logo" />
        <div onClick={gotoHome} className={shopNameClass}>
          La
          <br />
          Fresco
        </div>

        <div className="search">
          <div className="searchPanel">
            <input
              className="inputSearch"
              placeholder={"Search for Products..."}
              value={searchThis}
              onChange={onEnterSearch}
            ></input>
            <img
              onClick={onclickNavSearch}
              src="https://img.icons8.com/pastel-glyph/64/000000/search--v2.png"
              alt="Search Icon"
              className="searchImg"
            />
          </div>
          <div className="navSearchMeBox">{navSearchMeBox}</div>

          <div className="navInfo">
            <img
              src="https://image.flaticon.com/icons/svg/1216/1216895.svg"
              alt="IITI"
            />
            <a href="www.iiti.ac.in" className="loc">
              IIT INDORE,MP(452020)
            </a>
            <p> </p>
            <img
              src="https://image.flaticon.com/icons/svg/597/597177.svg"
              alt="Box"
            />
            <span>07324 306 717</span>
          </div>
        </div>
        <ul className={navStyle}>
          <li>
            <Link to="/allProducts">All Products</Link>
          </li>

          <li>
            <Link to="/categories">Category</Link>
          </li>

          <li>
            <Link to="/help">Help</Link>
          </li>
        </ul>
        {Cookies.get("token") ? (
          <div className={navPanelStyle}>
            <Link to="/basket">
              <img
                src="https://image.flaticon.com/icons/svg/126/126083.svg"
                alt="basket"
                className="cartLogo"
              />
              Cart
            </Link>
            <p style={{ fontSize: "2vw" }}>|</p>
            <Link to="/logout">Logout</Link>
          </div>
        ) : (
          <div className={navPanelStyle}>
            <a onClick={openSignupModal}>Sign UP</a>
            <p style={{ fontSize: "2vw" }}>|</p>
            <a onClick={openLoginModal}>Log IN</a>
          </div>
        )}
      </nav>
      <div className={navSearchOP}>
        <img
          onClick={onclickNavSearchClose}
          className="close-nav-search-op"
          src="https://img.icons8.com/emoji/48/000000/cross-mark-emoji.png"
          alt="smile"
        />
        <input
          type="text"
          className="nav-search-op"
          placeholder="Search for Products ..."
          value={searchThis}
          onChange={onEnterSearch}
        />
        <img
          className="search-nav-search-op"
          src="https://img.icons8.com/pastel-glyph/64/000000/search--v2.png"
          alt="searchop"
        />
      </div>
    </>
  );
}

export default Nav;
