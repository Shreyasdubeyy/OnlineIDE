import React, { useState } from 'react'
import { api_base_url } from '../helper';
import { useNavigate } from 'react-router-dom';
import { FiCode, FiTrash2, FiClock } from 'react-icons/fi';
import { toast } from 'react-toastify';

const ListCard = ({item}) => {
  const navigate = useNavigate();
  const [isDeleteModelShow, setIsDeleteModelShow] = useState(false);
  
  const deleteProj = (id) => {
    fetch(api_base_url + "/deleteProject",{
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        progId: id,
        userId: localStorage.getItem("userId")
      })
    }).then(res=>res.json()).then(data=>{
      if(data.success){
        setIsDeleteModelShow(false)
        toast.success("Project deleted successfully");
        window.location.reload()
      }else{
        toast.error(data.message || "Failed to delete project");
        setIsDeleteModelShow(false)
      }
    }).catch(err => {
      toast.error("Failed to delete project");
      setIsDeleteModelShow(false);
      console.error(err);
    })
  }
  
  return (
    <>
      <div className="listCard card-base mb-3 w-full flex items-center justify-between p-5 cursor-pointer hover:shadow-xl hover:shadow-cyan-500/5 transition-all duration-300 group">
        <div onClick={()=>{navigate(`/editior/${item._id}`)}} className='flex items-center gap-4 flex-1'>
          <div className='w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center flex-shrink-0'>
            <FiCode className='text-white text-xl' />
          </div>
          <div className='flex-1 min-w-0'>
            <h3 className='text-base font-semibold text-primary mb-1 truncate'>{item.title}</h3>
            <div className='flex items-center gap-2 text-xs text-muted'>
              <FiClock className='text-sm flex-shrink-0' />
              <span className='truncate'>Updated {new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
        <div className='flex items-center gap-2'>
          <span className='text-xs font-semibold text-accent bg-cyan-400/10 px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200'>Open</span>
          <button 
            onClick={(e)=>{
              e.stopPropagation();
              setIsDeleteModelShow(true)
            }} 
            className='p-2.5 rounded-lg hover:bg-red-500/10 hover:text-red-400 text-muted transition-all duration-200'
          >
            <FiTrash2 className='text-lg' />
          </button>
        </div>
      </div>

      {
        isDeleteModelShow ? <div className="model fixed top-0 left-0 w-screen h-screen bg-[rgba(0,0,0,0.6)] backdrop-blur-md flex justify-center items-center flex-col z-50">
          <div className="mainModel w-[90vw] max-w-[420px] bg-[rgba(30,41,59,0.98)] backdrop-blur-xl border border-[rgba(148,163,184,0.1)] rounded-2xl p-6 shadow-2xl">
            <div className='w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mb-4'>
              <FiTrash2 className='text-red-400 text-xl' />
            </div>
            <h3 className='text-xl font-bold mb-2'>Delete Project?</h3>
            <p className='text-[#94a3b8] text-[0.9375rem] mb-6 leading-relaxed'>This will permanently delete <span className='font-semibold text-[#e2e8f0]'>{item.title}</span>. This action cannot be undone.</p>
            <div className='flex items-center gap-3 w-full'>
              <button onClick={()=>{deleteProj(item._id)}} className='flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold hover:from-red-600 hover:to-red-700 transition-all duration-200 shadow-lg shadow-red-500/30'>Delete</button>
              <button onClick={()=>{setIsDeleteModelShow(false)}} className='flex-1 py-3 px-4 rounded-xl btnSecondary font-semibold'>Cancel</button>
            </div>
          </div>
        </div> : ""
      }
    </>
  )
}

export default ListCard