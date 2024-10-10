import React, { useState } from 'react'
import {Link,  useNavigate} from "react-router-dom"

const SignUp = () => {
  const [formData, setFormData] = useState({})
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
      setLoading(true)

      const res = await fetch("/api/auth/signup", 
        {method: "POST", headers: {
        "Content-Type": "application/json",
      },
      body:JSON.stringify(formData),
    });

    const data = await res.json()

    if(data.success === false){
      setLoading(false)
      setError(data.message)
      return;
    }

    setLoading(false)
    setError(null)
    navigate("/sign-in")
    }catch (error){
      setLoading(false)
      setError(error.message)

    }
  }

  return (
    <div className="max-w-lg mx-auto p-3">
      <h1 className="text-3xl text-center my-7 font-semibold">Sign Up</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>

        <input type="text" 
        placeholder="username"
        className="p-3 rounded-lg border" 
        id="username"
        onChange={handleChange}
        />

        <input type="email" 
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
          {loading ? "Loading..." : "Sign Up"}
        </button>
         {/*<GoogleAuth />*/}

      </form>
      <div className="flex gap-2 mt-5">
        <p>Have an account?
          <Link to={"/sign-in"}>
          <span className="text-purple-900">Sign in</span>
          </Link>
        </p>
      </div>
      {error && <p className="text-red-700 mt-5">{error}</p>}
      </div>
  )
}

export default SignUp
