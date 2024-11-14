import {
  getDownloadURL, 
  getStorage, 
  ref,
   uploadBytesResumable 
 } from 'firebase/storage'
import React, { useState } from 'react'
import { app } from "../firebase.js"
//new import 
import { useSelector } from 'react-redux'; 
import { useNavigate } from 'react-router-dom'; 


const CreateListing = () => {
 const {currentUser} = useSelector((state) => state.user)
 const navigate = useNavigate()

 const [files, setFiles] = useState([])
 //console.log(files);
 const [formData, setFormData] = useState({
   imageUrls:[],
   name: "",
   description: "",
   address: "",
   type: "rent",
   bedrooms: 1,
   bathrooms: 1,
   regularPrice: 50,
   discountPrice:0,
   offer: false,
   parking: false,
   furnished: false,
})
//console.log(formData);
const [uploading, setUploading] = useState(false)
const [imageUploadError, setImageUploadError] = useState(false)
const [error, setError] = useState(false)
const [loading, setLoading] = useState(false)

 const handleImageSubmit = (e) => {
   if(files.length>0 && files.length<7){
     setUploading(true)
     setImageUploadError(false)
     
     const promises = []

     for(let i=0; i<files.length; i++){
       promises.push(storeImage(files[i]))
     }

     Promise.all(promises).then((urls) =>{
       setFormData({
         ...formData,
         imageUrls: formData.imageUrls.concat(urls)
       })

       setImageUploadError(false)
       setUploading(false)
     })
     .catch((error) => {
       setImageUploadError("Image upload faild (2 mb max image)")
       setUploading(false)
     })
   }else{
     setUploading(false)
     setImageUploadError("You can only upload 6  image per listing")
   }

 }

 const storeImage = async(file) => {
   return new Promise((resolve, reject) => {
     const storage = getStorage(app)
     const fileName = new Date().getTime() + file.name
     const storageRef = ref(storage, fileName)

     const uploadTask = uploadBytesResumable(storageRef, file)

     uploadTask.on(
       "state_changed",
       (snapshot) => {
         const progress = (snapshot.bytesTransferred /snapshot.totalBytes) * 100

         console.log(`Upload is ${progress}% done`);
         
       },

       (error) => {
         reject(error)
       },

       () => {
         getDownloadURL(uploadTask.snapshot.ref).then((downloadUrl) => {
           resolve(downloadUrl)
         })
       }
     )
   })
 }

 const handleRemoveImage = (index) => {
   setFormData({
     ...formData,
     imageUrls: formData.imageUrls.filter((_, i) => i !== index),
   })
 }

 const handleChange =(e) => {
   if(e.target.id === "sale" || e.target.id === "rent"){
    setFormData({
     ...formData,
     type: e.target.id
    })
   }

   if(
     e.target.id === "parking" ||
     e.target.id === "furnished" ||
     e.target.id === "offer"
   ) {
     setFormData({
       ...formData,
       [e.target.id]: e.target.checked,
     })
   }

   if(e.target.type === "number" || e.target.type === "text" || e.target.type === "textarea"){
     setFormData({
       ...formData,
       [e.target.id]: e.target.value,
     })
   }
 }

 const handleSubmit = async (e) => {
   e.preventDefault()

   try {
     if(formData.imageUrls.length <1) {
       return setError("you must upload atleast 1 image")
     }

    if(+formData.regularPrice < +formData.discountPrice){
     return setError("Discount price must be lower than regular price")
    }

    setLoading(true)
    setError(false)

    console.log("Submitting data:", {
      ...formData,
      UserRef: currentUser._id,
    });
   
    
    const res = await fetch("/api/listing/create", {
     method: "POST",
     headers: {
       "Content-Type":"application/json",
       //Authorization: `Bearer ${currentUser.token}`,// new add
   
     },
     body:JSON.stringify({
       ...formData,
       UserRef: currentUser._id,
     }),
    })

    const data = await res.json()
   
    setLoading(false)

    console.log("API Response:", data);
    
    if (data.success === false){
      setError(data.message)
    } 
   navigate(`/listing/${currentUser._id}`)

   
   } catch (error) {
     setError(error.message)
     setLoading(false)
   }
          // navigate(`/listings/${currentUser._id}`) // by gaurav
           
 }

 return (
   <main className= "p-3 max-w--4xl mx-auto">
       <h1 className="text-3xl text-center font-semibold my-7"> 
           Create a Listing
           </h1>
   
       <form onSubmit= {handleSubmit} className="flex flex-col sm:flex-row gap-4">
       <div className="flex flex-col gap-4 flex-1">
           <input 
           type="text" 
           placeholder="Name"
           className="border p-3 rounded-lg"
           id="name" 
           maxLength={50}
           minLength={1}
           onChange={handleChange}
           value={formData.name}
           required
           />
           <textarea  
           type="text"
           placeholder="Description"
           className="border p-3 rounded-lg"
           id="description"
           onChange={handleChange}
           value={formData.description}
           required
           />
           <input 
           type="text" 
           placeholder="Address"
           className="border p-3 rounded-lg"
           id="address" 
           onChange={handleChange}
           value={formData.address}
           required
           />

           <div className="flex gap-6 flex-wrap">
              <div className="flex gap-2">
               <input 
               type="checkbox" 
               id= "rent" 
               className="w-5"
               onChange={handleChange}
               checked={formData.type === "rent"}
               />
               <span>Rent</span>
              </div>

              <div className="flex gap-2">
               <input 
               type="checkbox" 
               id= "sale" 
               className="w-5"
               onChange={handleChange}
               checked={formData.type === "sale"}
               />
               <span>Sale</span>
              </div>

              <div className="flex gap-2">
               <input 
               type="checkbox" 
               id= "parking" 
               className="w-5"
               onChange={handleChange}
               checked={formData.parking}
               />
               <span>Parking spot</span>
              </div>

              <div className="flex gap-2">
               <input 
               type="checkbox" 
               id= "furnished" 
               className="w-5"
               onChange={handleChange}
               checked={formData.furnished}
               />
               <span>Furnished</span>
              </div>

              <div className="flex gap-2">
               <input 
               type="checkbox" 
               id= "offer" 
               className="w-5"
               onChange={handleChange}
               checked={formData.offer}
               />
               <span>Offer</span>
                </div>
              </div>
 
               <div className="flex gap-6 flex-wrap">
                  <div className="flex gap-2 items-center">
                  <input
                   type="number"
                    id= "bedrooms"
                     min={1} 
                     max={10}
                      required 
                      className="border border-gray-300 p-3 rounded-lg"
                      onChange={handleChange}
                      value={formData.bedrooms}
                      />
                      <p>Beds</p>
                  </div>

                  <div className="flex gap-2 items-center">
                  <input
                   type="number"
                    id= "bathrooms"
                     min={1} 
                     max={10}
                      required 
                      className="border border-gray-300 p-3 rounded-lg"
                      onChange={handleChange}
                      value={formData.bathrooms}
                      />
                      <p>Baths</p>
                  </div>

                  <div className="flex gap-2 items-center">
                  <input
                   type="number"
                    id= "regularPrice"
                     min={1} 

                    
                      required 
                      className="border border-gray-300 p-3 rounded-lg"
                      onChange={handleChange}
                      value={formData.regularPrice}
                      />
                      <div className="flex flex-col items-center">
                       <p>Regular Price</p>
                       <span className="text-sm">(₹/month)</span>
                      </div>
                   </div>

                   {formData.offer && (
                     <div className="flex gap-2 items-center">
                     <input
                      type="number"
                       id= "discountPrice"
                        min={1} 
                        
                         required 
                         className="border border-gray-300 p-3 rounded-lg"
                         onChange={handleChange}
                         value={formData.discountPrice}
                         />
                         <div className="flex flex-col items-center">
                          <p>Discount Price</p>
                          <span className="text-sm">(₹/month)</span>
                         </div>
                      </div>
                   )}
               </div>
           </div>

           <div className="flex flex-col gap-4 flex-1">
             <p className="font-semibold">Images:
               <span className="font-normal text-gray-600 ml-2 ">
               The first image will be the cover
               </span>
             </p>

             <div className="flex gap-4">
               <input
               onChange={(e) => 
                 setFiles(e.target.files)
               } 
               type="file" 
               id="images" 
               accept="image/*" 
               multiple
               className="border border-gray-300 p-3 rounded w-full"
               />

               <button 
               type="button"
               className="p-3 text-green-700 border border-green-700 uppercase rounded-lg hover:shadow-lg disabled:opacity-80"
               onClick={handleImageSubmit}>
                 {uploading ? "Uploading..." : "Upload"}
               </button>
             </div>

             <p className="text-red-700 text sm">{imageUploadError && imageUploadError}

             </p>

            {formData.imageUrls.length > 0 &&
            formData.imageUrls.map((url, index) => (
              <div key={url} className="flex justify-between p-3 items-center border">
               <img src={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg"
               
               />
               <button type="button" className="p-3 text-red-700 rounded-lg uppercase hover:opacity-75"
               onClick={()=>handleRemoveImage(index)}
               >
                 Delete
               </button>
              </div>
            ))
            } 

             <button 
             disabled={loading}
             className="p-3 bg-purple-900 rounded-lg text-white uppercase hover:opacity-95 disabled:opacity-85">
               {loading ? "Creating..." : "Create Listing"}
             </button>

             {error && <p className="text-red-700 text-sm">{error}</p>}
           </div>
       </form>
   </main>
 )
}
export default CreateListing
