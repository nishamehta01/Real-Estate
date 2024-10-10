import React from 'react'
import {FaSearch} from "react-icons/fa"
import {Link} from "react-router-dom"
import {useSelector} from "react-redux"

const Header = () => {
  const {currentUser } = useSelector((state) => state.user)
  return (
    <header className="bg-purple-200 shadow-lg sticky">
        <div className="flex justify-between items-center max-w-6xl mx-auto p-3">
           <Link to={"/"}>
           <h1 className="font-bold text-sm items-center sm:text-lg flex-wrap">
                <span className="text-purple-500 ">Real</span>
                <span className="text-purple-800 ">Estate</span>
                </h1> 
           </Link> 

                <form className="p-3 bg-slate-100 rounded-lg flex items-center">
                <input type="text" placeholder="search..." className="foucs:outline-none bg-transparent w-24 sm:w-64"/>
                <FaSearch className="text-purple-900"/>
                </form>
                <ul className="flex gap-2 sm:gap-3">
                  <Link to={"/"}>
                  <li className="text-purple-800 font-bold">Home</li>
                  </Link>
                    <Link to={"/about"}>
                    <li className="text-purple-800 font-bold">About</li>
                    </Link>
                    <Link  to={"/profile"}>
                    {currentUser ? (
                      <img src={currentUser.avatar} alt="profile pic" className="rounded-full w-7 h-7 object-cover" />
                    ) : (
                    
                  
                    <li className="text-purple-800 font-bold hover:underline">SignIn</li>
                    )}
                    </Link>
                </ul>
                
        </div>
    </header>
  )
}

export default Header