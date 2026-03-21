import React, { useState } from 'react'
import Logo from '../components/Logo'
import { Link, useNavigate } from 'react-router-dom';
import { api_base_url } from '../helper';
import { FiMail, FiLock, FiArrowRight, FiCode } from 'react-icons/fi';

const Login = () => {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    fetch(api_base_url + "/login",{
      mode: "cors",
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: email,
        password: pwd
      })
    }).then(res => res.json()).then(data => {
      setIsLoading(false);
      if(data.success === true){
        localStorage.setItem("token", data.token);
        localStorage.setItem("isLoggedIn", true);
        localStorage.setItem("userId", data.userId);
        setTimeout(() => {
          window.location.href = "/"
        }, 200);
      } else {
        setError(data.message);
      }
    }).catch(err => {
      setIsLoading(false);
      setError("Something went wrong. Please try again.");
    })
  }

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8">
            <Logo className="w-[160px] mb-4" />
            <h1 className='text-3xl font-bold text-[#e2e8f0] mb-2'>Welcome back</h1>
            <p className='text-[#94a3b8] text-sm'>Sign in to continue to your projects</p>
          </div>

          {/* Form */}
          <form onSubmit={submitForm} className='space-y-5'>
            {/* Email Input */}
            <div>
              <label className='block text-sm font-medium text-[#94a3b8] mb-2'>Email Address</label>
              <div className="inputBox !mb-0 relative">
                <FiMail className='absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] text-lg' />
                <input 
                  required 
                  onChange={(e)=>{setEmail(e.target.value)}} 
                  value={email} 
                  type="email" 
                  placeholder='you@example.com'
                  className='!pl-11'
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className='block text-sm font-medium text-[#94a3b8] mb-2'>Password</label>
              <div className="inputBox !mb-0 relative">
                <FiLock className='absolute left-4 top-1/2 -translate-y-1/2 text-[#64748b] text-lg' />
                <input 
                  required 
                  onChange={(e)=>{setPwd(e.target.value)}} 
                  value={pwd} 
                  type="password" 
                  placeholder='Enter your password'
                  className='!pl-11'
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className='bg-red-500/10 border border-red-500/20 rounded-lg p-3'>
                <p className='text-red-400 text-sm'>{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit" 
              disabled={isLoading}
              className="btnBlue w-full !py-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="spinner !w-5 !h-5 !border-2"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <FiArrowRight />
                </>
              )}
            </button>

            {/* Sign Up Link */}
            <p className='text-center text-sm text-[#94a3b8]'>
              Don't have an account? <Link to="/signUp" className='text-[#22d3ee] hover:text-[#06b6d4] font-medium transition-colors duration-200'>Create one</Link>
            </p>
          </form>
        </div>
      </div>

      {/* Right Side - Hero */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] items-center justify-center p-12 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(34, 211, 238, 0.3) 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Content */}
        <div className="relative z-10 text-center max-w-lg">
          <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <FiCode className="text-white text-4xl" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-4">
            Build Amazing Projects
          </h2>
          <p className="text-lg text-[#94a3b8] mb-8">
            Your online code editor with real-time preview. Write HTML, CSS, and JavaScript all in one place.
          </p>
          <div className="flex items-center justify-center gap-8 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">100+</div>
              <div className="text-[#64748b]">Projects</div>
            </div>
            <div className="w-px h-12 bg-[#334155]"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">Fast</div>
              <div className="text-[#64748b]">Performance</div>
            </div>
            <div className="w-px h-12 bg-[#334155]"></div>
            <div className="text-center">
              <div className="text-2xl font-bold text-cyan-400 mb-1">Free</div>
              <div className="text-[#64748b]">Forever</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
