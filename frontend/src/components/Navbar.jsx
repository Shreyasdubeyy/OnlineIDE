import React, { useEffect, useState } from 'react'
import Logo from './Logo'
import { Link, useNavigate } from 'react-router-dom'
import Avatar from 'react-avatar';
import { MdLightMode } from "react-icons/md";
import { BsGridFill } from "react-icons/bs";
import { FiMenu, FiX } from "react-icons/fi";
import { api_base_url, toggleClass } from '../helper';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ isGridLayout, setIsGridLayout }) => {
  const { isLightMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Lock scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const [data, setData] = useState(null);
  const [error, setError] = useState("");;

  useEffect(() => {
    fetch(api_base_url + "/getUserDetails", {
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId: localStorage.getItem("userId")
      })
    }).then(res => res.json()).then(data => {
      if (data.success) {
        setData(data.user);
      }
      else {
        setError(data.message);
      }
    }).catch(err => {
      console.error(err);
    })
  }, [])

  const logout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("token");
    localStorage.removeItem("isLoggedIn");
    window.location.href = "/login";
  }

  return (
    <>
      <div className="navbar flex items-center justify-between container-padding h-[72px] bg-[rgba(30,41,59,0.8)] backdrop-blur-xl border-b border-[rgba(148,163,184,0.1)] sticky top-0 z-50">
        <div className="logo">
          <Logo className="w-[140px]" />
        </div>
        
        {/* Desktop Links */}
        <div className="hidden lg:flex items-center gap-8">
          <button onClick={logout} className='btnBlue !bg-gradient-to-r !from-red-500 !to-red-600 !shadow-red-500/30 !py-2 !px-4 !text-sm hover:!from-red-600 hover:!to-red-700'>Logout</button>
          <Avatar onClick={() => { toggleClass(".dropDownNavbar", "hidden") }} name={data ? data.name : ""} size="38" round="50%" className='cursor-pointer' />
        </div>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className='lg:hidden p-2 text-[#94a3b8] hover:text-[#22d3ee] transition-colors'
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? <FiX className='text-2xl' /> : <FiMenu className='text-2xl' />}
        </button>

        {/* Desktop Dropdown */}
        <div className='dropDownNavbar hidden absolute right-[1rem] sm:right-[2rem] lg:right-[5rem] top-[72px] shadow-2xl p-3 rounded-xl bg-[rgba(30,41,59,0.98)] backdrop-blur-xl border border-[rgba(148,163,184,0.1)] w-[200px] transition-all duration-300' onMouseLeave={() => { toggleClass(".dropDownNavbar", "hidden") }}>
          <div className='py-3 border-b-[1.5px] border-b-[rgba(148,163,184,0.1)]'>
            <h3 className='text-base font-semibold' style={{ lineHeight: 1.3 }}>{data ? data.name : ""}</h3>
          </div>
          <i onClick={toggleTheme} className='flex items-center gap-3 mt-3 mb-2 cursor-pointer text-[#94a3b8] hover:text-[#22d3ee] transition-colors duration-200 py-2' style={{ fontStyle: "normal" }} role="button" tabIndex={0} aria-label="Toggle theme"><MdLightMode className='text-xl' /> <span className='text-sm font-medium'>{isLightMode ? 'Dark' : 'Light'} mode</span></i>
          <i onClick={() => setIsGridLayout(!isGridLayout)} className='flex items-center gap-3 mb-2 cursor-pointer text-[#94a3b8] hover:text-[#22d3ee] transition-colors duration-200 py-2' style={{ fontStyle: "normal" }} role="button" tabIndex={0} aria-label="Toggle layout"><BsGridFill className='text-lg' /> <span className='text-sm font-medium'>{isGridLayout ? "List" : "Grid"} layout</span></i>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div 
          className='lg:hidden fixed inset-0 top-[72px] bg-[rgba(0,0,0,0.6)] backdrop-blur-md z-40' 
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div 
            className='bg-[rgba(30,41,59,0.98)] backdrop-blur-xl border-b border-[rgba(148,163,184,0.1)] p-6 max-h-[calc(100vh-72px)] overflow-y-auto' 
            onClick={(e) => e.stopPropagation()}
          >
            <div className='flex flex-col gap-4'>
              <div>
                <div className='flex items-center gap-3 mb-4'>
                  <Avatar name={data ? data.name : ""} size="40" round="50%" />
                  <div>
                    <p className='text-sm font-semibold text-[#e2e8f0]'>{data ? data.name : ""}</p>
                    <p className='text-xs text-[#64748b]'>{data ? data.email : ""}</p>
                  </div>
                </div>
                <button onClick={toggleTheme} className='w-full flex items-center gap-3 text-[#94a3b8] hover:text-[#22d3ee] transition-colors py-3 text-sm font-medium' aria-label="Toggle theme">
                  <MdLightMode className='text-xl' /> {isLightMode ? 'Dark' : 'Light'} mode
                </button>
                <button onClick={() => { setIsGridLayout(!isGridLayout); setIsMobileMenuOpen(false); }} className='w-full flex items-center gap-3 text-[#94a3b8] hover:text-[#22d3ee] transition-colors py-3 text-sm font-medium' aria-label="Toggle layout">
                  <BsGridFill className='text-lg' /> {isGridLayout ? "List" : "Grid"} layout
                </button>
                <button onClick={logout} className='w-full btnBlue !bg-gradient-to-r !from-red-500 !to-red-600 mt-4'>Logout</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
