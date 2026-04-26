import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import ListCard from '../components/ListCard';
import GridCard from '../components/GridCard';
import { api_base_url } from '../helper';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiPlus, FiFolder } from 'react-icons/fi';
import { toast } from 'react-toastify';

const Home = () => {

  const [data, setData] = useState(null);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [projTitle, setProjTitle] = useState("");
  const navigate = useNavigate();
  const [isCreateModelShow, setIsCreateModelShow] = useState(false);

  // Filter data based on search query
  const filteredData = data === null ? null : data.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createProj = (e) => {
    if (projTitle.trim() === "") {
      toast.error("Please enter project title");
    } else {
      fetch(api_base_url + "/createProject", {
        mode: "cors",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: projTitle.trim(),
          userId: localStorage.getItem("userId")
        })
      }).then(res => res.json()).then(data => {
        if (data.success) {
          setIsCreateModelShow(false);
          setProjTitle("");
          toast.success("Project created successfully!");
          navigate(`/editior/${data.projectId}`);
        } else {
          toast.error(data.message || "Something went wrong");
        }
      }).catch(err => {
        toast.error("Failed to create project");
        console.error(err);
      });
    }
  };

  const getProj = () => {
    fetch(api_base_url + "/getProjects", {
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
        setData(data.projects);
      } else {
        setError(data.message);
      }
    }).catch(err => {
      setError("Failed to load projects. Please try again.");
      console.error(err);
    });
  };

  useEffect(() => {
    getProj();
  }, []);


  const [userData, setUserData] = useState(null);
  const [userError, setUserError] = useState("");;

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
        setUserData(data.user);
      }
      else {
        setUserError(data.message);
      }
    }).catch(err => {
      console.error(err);
    })
  }, [])

  const [isGridLayout, setIsGridLayout] = useState(false);


  return (
    <>
      <Navbar isGridLayout={isGridLayout} setIsGridLayout={setIsGridLayout} />
      <div className='flex flex-col lg:flex-row items-start lg:items-center justify-between container-padding my-8 lg:my-12 gap-6'>
        <div>
          <h2 className='text-2xl lg:text-3xl font-bold text-primary mb-2'>Welcome back, {userData ? userData.username : ""} 👋</h2>
          <p className='text-muted text-sm'>Manage and organize your coding projects</p>
        </div>
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto'>
          <div className="inputBox !w-full sm:!w-[280px] lg:!w-[320px] !mb-0 relative">
            <FiSearch className='absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] text-lg' />
            <input
              type="text"
              placeholder='Search projects...'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='!pl-11'
            />
          </div>
          <button onClick={() => { setIsCreateModelShow(true) }} className='btnBlue !py-3 !px-5 flex items-center justify-center gap-2 !text-sm whitespace-nowrap'>
            <FiPlus className='text-lg' />
            <span className='font-semibold'>New Project</span>
          </button>
        </div>
      </div>

      <div className="cards container-padding pb-12">
        {
          error ? (
            <div className='flex flex-col items-center justify-center py-20'>
              <p className='text-red-400 text-sm'>{error}</p>
            </div>
          ) : filteredData === null ? (
            <div className='flex flex-col items-center justify-center py-20'>
              <div className="spinner mx-auto mb-4"></div>
              <p className="text-muted text-sm">Loading projects...</p>
            </div>
          ) : isGridLayout ?
            <div className='grid'>
              {
                filteredData.length > 0 ? filteredData.map((item, index) => (
                  <GridCard key={index} item={item} />
                )) : (
                  <div className='col-span-full flex flex-col items-center justify-center py-20'>
                    <div className='w-20 h-20 rounded-full bg-[rgba(30,41,59,0.5)] lightMode:bg-[rgba(203,213,225,0.3)] flex items-center justify-center mb-4'>
                      <FiFolder className='text-4xl text-muted' />
                    </div>
                    <h3 className='text-xl font-semibold text-primary mb-2'>No projects found</h3>
                    <p className='text-muted text-sm mb-6'>Create your first project to get started</p>
                    <button onClick={() => { setIsCreateModelShow(true) }} className='btnBlue !py-2.5 !px-5 flex items-center gap-2'>
                      <FiPlus />
                      <span>New Project</span>
                    </button>
                  </div>
                )
              }
            </div>
            : <div className='list'>
              {
                filteredData.length > 0 ? filteredData.map((item, index) => (
                  <ListCard key={index} item={item} />
                )) : (
                  <div className='flex flex-col items-center justify-center py-20'>
                    <div className='w-20 h-20 rounded-full bg-[rgba(30,41,59,0.5)] lightMode:bg-[rgba(203,213,225,0.3)] flex items-center justify-center mb-4'>
                      <FiFolder className='text-4xl text-muted' />
                    </div>
                    <h3 className='text-xl font-semibold text-primary mb-2'>No projects found</h3>
                    <p className='text-muted text-sm mb-6'>Create your first project to get started</p>
                    <button onClick={() => { setIsCreateModelShow(true) }} className='btnBlue !py-2.5 !px-5 flex items-center gap-2'>
                      <FiPlus />
                      <span>New Project</span>
                    </button>
                  </div>
                )
              }
            </div>
        }
      </div>

      {/* Modal for Creating a New Project */}
      {isCreateModelShow &&
        <div className="createModelCon fixed top-0 left-0 right-0 bottom-0 w-screen h-screen bg-[rgba(0,0,0,0.6)] backdrop-blur-md flex items-center justify-center z-50">
          <div className="createModel w-[90vw] max-w-[480px] bg-[rgba(30,41,59,0.98)] backdrop-blur-xl border border-[rgba(148,163,184,0.1)] rounded-2xl p-6 shadow-2xl">
            <div className='w-12 h-12 rounded-full bg-cyan-500/10 flex items-center justify-center mb-4'>
              <FiPlus className='text-cyan-400 text-xl' />
            </div>
            <h3 className='text-xl font-bold mb-2'>Create New Project</h3>
            <p className='text-[#94a3b8] text-[0.9375rem] mb-6'>Give your project a name to get started</p>
            <div className="inputBox !mb-6">
              <input
                onChange={(e) => { setProjTitle(e.target.value) }}
                value={projTitle}
                type="text"
                placeholder='Enter project name...'
                autoFocus
              />
            </div>
            <div className='flex items-center gap-3 w-full'>
              <button onClick={createProj} className='btnBlue flex-1 !py-3 font-semibold'>Create Project</button>
              <button onClick={() => { setIsCreateModelShow(false); setProjTitle(""); }} className='btnSecondary flex-1 !py-3 font-semibold'>Cancel</button>
            </div>
          </div>
        </div>
      }
    </>
  );
}

export default Home;
