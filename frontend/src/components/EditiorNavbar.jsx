import React from 'react'
import Logo from './Logo'
import { FiDownload } from "react-icons/fi";
import { Link } from 'react-router-dom';


const EditiorNavbar = ({ onDownload, onToggleView, showFrame }) => {
  return (
    <>
      <div className="EditiorNavbar flex items-center justify-between container-padding h-[72px] bg-[rgba(30,41,59,0.8)] backdrop-blur-xl border-b border-[rgba(148,163,184,0.1)] sticky top-0 z-50">
        <div className="logo">
          <Link to="/">
            <Logo className="w-[120px] sm:w-[140px]" />
          </Link>
        </div>
        <p className='hidden sm:block text-sm font-medium'><span className='text-[#64748b]'>Project /</span> <span className='text-[#e2e8f0]'>My first project</span></p>
        <div className="flex items-center gap-2">
          {onToggleView && (
            <button
              onClick={onToggleView}
              className="p-2 sm:p-[10px] btn bg-[rgba(30,41,59,0.8)] backdrop-blur-md border border-[rgba(148,163,184,0.1)] rounded-[10px] cursor-pointer text-xs sm:text-sm hover:bg-[rgba(34,211,238,0.15)] hover:border-[rgba(34,211,238,0.3)] hover:text-[#22d3ee] transition-all duration-200"
              title="Toggle view"
            >
              {showFrame ? 'Hide View' : 'Show View'}
            </button>
          )}
          <button
            onClick={onDownload}
            className="p-2 sm:p-[10px] btn bg-[rgba(30,41,59,0.8)] backdrop-blur-md border border-[rgba(148,163,184,0.1)] rounded-[10px] cursor-pointer text-lg sm:text-xl hover:bg-[rgba(34,211,238,0.15)] hover:border-[rgba(34,211,238,0.3)] hover:text-[#22d3ee] transition-all duration-200"
            title="Download project"
          >
            <FiDownload />
          </button>
        </div>
      </div>
    </>
  )
}

export default EditiorNavbar