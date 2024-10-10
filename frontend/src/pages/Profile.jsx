import React, { PureComponent, useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { app } from "../firebase.js"

import {
  getDownloadURL, 
  getStorage, 
  ref, 
  uploadBytesResumable,
} from "firebase/storage"
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, updateUserFailure, updateUserSucces } from "../../redux/user/userSlice.js"

const Profile = () => {
  const { currentUser, loading, error } = useSelector((state) => state.user)

  //console.log(currentUser.rest.username) 
  

  const fileRef = useRef(null)

  const [file, setFile] = useState(undefined)
  const [filePercentage, setFilePercentage] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formData, setFormData] = useState({})
  const [updateSuccess, setUpdateSucess] = useState(false)

  const dispatch = useDispatch()

  //console.log(formData); {}
  //console.log(file)
  

  useEffect(() => {
    if(file){
      handleFileUpload(file)
    }
  }, [file])
  
  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on("state_changed", (snapshot) => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
      
      console.log("upload is " + progress + "%done") 
      setFilePercentage(Math.round(progress))
      
    }, 
    (error) => {
      setFileUploadError(true)
    },

    () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
        setFormData({
        ...formData,
         avatar: downloadURL,
       })
     )
    }
   )
  }
  
  const handleChange = (e) => {
  setFormData({...formData, [e.target.id] : e.target.value})
  }
  //console.log(formData);
  
  const handleSubmit = async(e) => {
    e.preventDefault()

    try {
       dispatch(updateUserStart())

       const res = await fetch(`/api/user/update/${currentUser.rest_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
       })

       const data = await res.json()
       
       if(data.success === false){
        dispatch(updateUserFailure(data.message)) 
        return
       }

       dispatch(updateUserSucces(data)) 
       setUpdateSucess(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message)) 
    }
  }

    const handleDeleteUser = async () => {
      try {
        dispatch(deleteUserStart())

        const res = await fetch(`/api/user/delete/${currentUser._id}`, {
          method: "DELETE"
          
        })

        const data = await res.json()

        if(data.success === false){
         dispatch(deleteUserFailure(data.message))
          return
        }

        dispatch(deleteUserSuccess())
      } catch (error) {
      dispatch(deleteUserFailure(error.message))
      }
    }

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>

      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input 
        type="file" onChange={(e) => setFile(e.target.files[0])}
        ref={fileRef} 
        accept="image/*" 
        hidden 
        />

        <img 
        src={formData.avatar || currentUser.avatar} 
        alt="Profile" 
        className="rounded-full w-24 h-24 object-cover cursor-pointer self-center mt-2"
        onClick={() => fileRef.current.click()}
        />

        <p className="self-center text-sm">
           {fileUploadError ? (
            <span>
              Error in image upload (imgage must be less than 2mb)
            </span>
           ) : filePercentage > 0 && filePercentage < 100 ? (
            <span>{`Uploading ${filePercentage}%`}</span>
           ) : filePercentage === 100 ? (
            <span>Image Successfully Uploaded</span>
           ) : ( 
             ""
            )}
        </p>

        <input 
        type="text" 
        placeholder="username"
        defaultValue={currentUser.username}
        id="username"  
        className="border rounded-lg p-3"
        onChange={handleChange}
        />

        <input 
        type="email" 
        placeholder="email" 
        defaultValue={currentUser.email}
        id="email" 
        className="border rounded-lg p-3" 
        onChange={handleChange}
        />
        
        <input 
        type="password" 
        placeholder="password" 
        id="password" 
        className="border rounded-lg p-3" 
        onChange={handleChange}
        />

        <button disabled ={loading} className="bg-purple-800 rounded-lg p-3 text-white uppercase hover:opacity-80 disabled:opacity-80">
          {loading ? "Loading..." : "update"}
         </button>
         </form>

         <div className="flex justify-between mt-5">
          <span onClick={handleDeleteUser} className="text-red-800 cursor-pointer">Delete account</span>
          <span className="text-red-800 cursor-pointer">Sign Out</span>
         </div>
        <p className="text-red-700 mt-5">{error ? error : ""}</p>
        <p className="text-green-700 mt-5">
          {updateSuccess ? "user is updated successfully" : ""}</p>
    </div>
  )
}

export default Profile