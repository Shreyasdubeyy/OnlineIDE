import React, { useEffect, useState } from "react";
import logo from "../images/logo.png";
import { Link, useNavigate } from "react-router-dom";
import Avatar from "react-avatar";
// import Avatar from "react-avatar/dist/avatar";

import { MdLightMode } from "react-icons/md";
import { BsGridFill } from "react-icons/bs";
import { api_base_url, toggleClass } from "../helper";

const Navbar = ({ isGridLayout, setIsGridLayout }) => {
 const [theme, setTheme] = useState(localStorage.getItem("theme") || "dark");

useEffect(() => {
  document.body.className = theme; // 👈 directly change body class
  localStorage.setItem("theme", theme);
}, [theme]);


  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(api_base_url + "/getUserDetails", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId"),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setData(data.user);
          console.log("Fetched");
        } else {
          setError(data.message);
        }
      });
  }, []);

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    window.location.reload();
  };

  return (
    <>
      <div className="navbar flex items-center justify-between px-[100px] h-[80px] bg-[#141414]">
        <div className="logo">
          <img className="w-[150px] cursor-pointer" src={logo} alt="" />
        </div>
        <div className="links flex items-center gap-2">
          <Link>Home</Link>
          <Link>About</Link>
          <Link>Contact</Link>
          <Link>Services</Link>
          <button
  onClick={logout}
  className="btnBlue !bg-red-500 min-w-[100px] ml-2 hover:!bg-red-600 text-white text-sm px-4 py-2 rounded-md transition-all"
>
  Logout
</button>

          <Avatar
            onClick={() => {
              toggleClass(".dropDownNavbar", "hidden");
            }}
            name={data ? data.name : ""}
            size="40"
            round="50%"
            className=" cursor-pointer ml-2"
          />
        </div>

        <div className="dropDownNavbar hidden absolute right-[60px] top-[80px] shadow-lg shadow-black/50 p-[12px] rounded-lg bg-[#1A1919] w-[200px] max-h-[220px] overflow-y-auto transition-all duration-300 ease-in-out">
 
 
  <div className="py-[12px] border-b-[1px] border-b-[#fff] mb-4">
    <h3 className="text-[17px] text-white font-semibold" style={{ lineHeight: 2 }}>
      {data ? data.name : "User Name"}
    </h3>
  </div>

 
  <i
    onClick={() => setTheme(theme === "light" ? "dark" : "light")}
    className="flex items-center gap-3 mt-3 mb-4 cursor-pointer hover:bg-[#333] rounded p-2 transition-colors"
    style={{ fontStyle: "normal" }}
  >
    <MdLightMode className="text-[22px] text-yellow-400" />
    <span className="text-white text-[15px]">
      {theme === "light" ? "Dark mode" : "Light mode"}
    </span>
  </i>

 
  <i
    onClick={() => setIsGridLayout(!isGridLayout)}
    className="flex items-center gap-3 mt-3 mb-3 cursor-pointer hover:bg-[#333] rounded p-2 transition-colors"
    style={{ fontStyle: "normal" }}
  >
    <BsGridFill className="text-[22px] text-green-400" />
    <span className="text-white text-[15px]">
      {isGridLayout ? "List layout" : "Grid layout"}
    </span>
  </i>
</div>

      </div>
    </>
  );
};

export default Navbar;

// import React from 'react'
// import logo from "../images/logo.png"
// import {Link} from "react-router-dom"
// import Avatar from 'react-avatar';

// const Navbar = () => {
//   return (
//     <> <div className="navbar flex items-center justify-between px-[100px] h-[80px] bg-[#141414]">
//     <div className="logo">
//       <img src={logo} className='w-[150px] cursor-pointer' />
//     </div>

//     <div className="links flex items-center gap-2 ">
//     <Link>Home</Link>
//     <Link>About</Link>
//     <Link>Contact</Link>
//     </div>
//     <div className="dropDownNavbar absolute right-[60px] top-[80px] w-[150px] h-[200px] p-[10px] rounded-lg shadow-lg shadow-black/50 bg-[#1A1919]">
//     <div className='py-[10px] border-b-[1px] border-b-[#fff]'>
//       <h3 className='text-[16px]' style={{lineHeight:1}}>Shreyas Dubey</h3>

//     </div>

//     </div>
// </div>

// </>

//   )
// }

// export default Navbar
