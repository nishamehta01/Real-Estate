import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link,  useNavigate } from "react-router-dom"
import { signInFailure, signInStart, signInSuccess } from '../../redux/user/userSlice'
import GoogleAuth from '../compnents/GoogleAuth'

const SignIn = () => {
  const [formData, setFormData] = useState({})
  const {loading, error} = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleChange = async(e)=> {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try{
      dispatch(signInStart())

      const res = await fetch("/api/auth/signin", 
        {method: "POST", headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify(formData),
    })

    const data = await res.json()

    if(data.success === false){
      dispatch(signInFailure(data.message))
      return
    }

    dispatch(signInSuccess(data))
    navigate("/")
    }catch (error){
      dispatch(signInFailure(error.message))

    }
  }

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl text-center my-7 font-semibold">Sign In</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
    
        <input
         type="email" 
        placeholder="email"
        className="p-3 rounded-lg border" 
        id="email"
        onChange={handleChange}
        />

        <input type="password" 
        placeholder="password"
        className="p-3 rounded-lg border" 
        id="password"
        onChange={handleChange}
        />

        <button 
         disabled={loading}
        className="bg-purple-800 rounded-lg p-3 text-white uppercase hover:opacity-80 disabled:opacity-80">
          {loading ? "Loading..." : "Sign In"}
        </button>

        <GoogleAuth/>

      </form>
      <div className="flex gap-2 mt-5">
        <p>Don't have an account?
          <Link to={"/sign-up"}>
          <span className="text-purple-900">Sign Up</span></Link>
        </p>
      </div>
          
          {error && <p className="text-red-700 mt-5">{error}</p>}
      </div>
  )
}

export default SignIn
