"use client"

import { useState } from "react"

export default function LoginPage(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");

    const handleLogin = async()=>{
        const res = await fetch("/api/auth/login",{
            method:"POST",
            body:JSON.stringify({email,password}),
        });
      const data = await res.json();
      if(data.token){
        localStorage.setItem("token",data.token);
        window.location.href = "/jobs";
      }else{
        alert(data.error);
      }
    };

    return(
        <div className="p-6 max-w-md mx-auto">
            <h1 className="text-xl font-bold mb-4">Login</h1>

            <input
              className="border p-2 w-full mb-2"
              placeholder="Email"
              onChange ={(e)=> setEmail(e.target.value)}
             />

             <input
              className="border p-2 w-full mb-2"
              type = "password"
              placeholder="Password"
              onChange = {(e)=>setPassword(e.target.value)}
              />

              <button 
              className="bg-black text-white px-4 py-2"
              onClick={handleLogin}>Login</button>
        </div>
    );
}