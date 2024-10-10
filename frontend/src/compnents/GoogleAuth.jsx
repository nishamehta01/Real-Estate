import React from 'react'
import {getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { app } from "../firebase"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { signInSuccess } from  "../../redux/user/userSlice"

const GoogleAuth = () => {
   const dispatch = useDispatch()
   const navigate = useNavigate()

    const handleGoogleClick = async () => {
      try {
          const provider = new GoogleAuthProvider()
          const auth = getAuth(app)

          const result = await signInWithPopup(auth, provider)

          const res = await fetch("/api/auth/google", {
            method: "POST",
            headers: {
                "content-Type": "application/json",
            },
            body: JSON.stringify({
              name: result.user.displayName,
              email: result.user.email,
              photo: result.user.photoURL,
            }),
          })

          const data = await res.json()

          dispatch(signInSuccess(data))
          navigate("/")
      } catch (error) {
         console.log("Could not sign in with google", error);
      }
    }
  return (
    <button 
    onClick={handleGoogleClick}
    type="button"
    className="bg-pink-600 p-3 rounded-lg text-white uppercase hover:opacity-95">
        Continue with google
        </button>
  )
}

export default GoogleAuth