"use client"

import { useState } from "react"
import { useRouter } from "next/navigation";

export default function LoginPage(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [loading,setLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async()=>{
       setLoading(true);
       try{
        const res = await fetch("/api/auth/login",{
            method:"POST",
            headers:{
              "Content-Type":"application/json",
            },
            body:JSON.stringify({email,password}),
        });
      const data = await res.json();
      if(data.token){
        localStorage.setItem("token",data.token);
        router.push("/jobs");
      }else{
        alert(data.error||"Login failed");
      }
     } catch(err){
      alert("Something went wrong");
     }finally{
      setLoading(false);
     }
    };

    return(
        <div className="flex items-center justify-center min-h-screen bg-background px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary">
            <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-md shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-6">
              Login</h2>
            <div className="space-y-4">
            <input
              className="w-full bg-transparent border border-border rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Email"
              type="email"
               disabled={loading}
              onChange ={(e)=> setEmail(e.target.value)}
             />

             <input
              className="w-full bg-transparent border border-border rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus-primary"
              type = "password"
              placeholder="Password"
               disabled={loading}
              onChange = {(e)=>setPassword(e.target.value)}
              />

              <button
              className="w-full bg-primary text-white py-2 rounded-xl hover-xl hover:opacity-90 transition"
              onClick={handleLogin}  disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </div>
      </div>
    </div>    
    );
}