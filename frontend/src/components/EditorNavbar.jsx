import React from 'react'
import logo from "../images/logo.png"
import { FiDownload } from "react-icons/fi";
import { Link } from 'react-router-dom';


const EditorNavbar = () => {
  return (
    <>
      <div className="EditorNavbar flex items-center justify-between px-[100px] h-[80px] bg-[#141414]">
        <div className="logo">
 <Link to="/">
            <img className='w-[150px] cursor-pointer' src={logo} alt="Logo" />
          </Link>        </div>
        {/* <p>File / <span className='text-[gray]'>My first project</span></p> */}
        {/* <i className='p-[8px] btn bg-black rounded-[5px] cursor-pointer text-[20px]'><FiDownload /></i> */}
      </div>
    </>
  )
}

export default EditorNavbar