"use client"

import { useState } from "react"
import { useRouter } from "next/navigation";


export default function LoginPage(){
    const router = useRouter();
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [loading,setLoading] = useState(false);
    const [error,setError] = useState("");

    const handleLogin = async(e:any)=>{
      e.preventDefault();
      setError("");
      if(!email||!password){
        setError("Please fill all fields");
        return;
      }
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
      if(!res.ok){
        setError(data.error||"Login failed");
        return;
      }
          localStorage.setItem("token",data.token);
          localStorage.setItem("role", data.user.role);
          const role = data.user.role;
  
      if(role==="RECRUITER"){
        router.push("/dashboard");
      }else{
        router.push("/jobs");
      }
     } catch(err){
      setError("Something went wrong");
     }finally{
      setLoading(false);
     }
    };

    return(
        <div className="flex items-center justify-center min-h-screen bg-background px-4 ">
            <form onSubmit= {handleLogin} className="bg-card border border-border rounded-2xl p-8 w-full max-w-md shadow-lg">
              <h2 className="text-2xl font-semibold text-white mb-6">
              Login</h2>
              {error && ( <p className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg py-2 px-3 text-sm text-center mb-4" >{error}</p>)}
            <div className="space-y-4">
            <input
              className="w-full bg-transparent border border-border rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Email"
              type="email"
              value={email}
               disabled={loading}
              onChange ={(e)=> {setEmail(e.target.value); setError("");}}
              required/>

             <input
              className="w-full bg-transparent border border-border rounded-xl px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"
              type = "password"
              placeholder="Password"
              value={password}
               disabled={loading}
              onChange = {(e)=>{setPassword(e.target.value); setError("")}}
               required/>

              <button
              className="w-full bg-primary text-white py-2 rounded-xl  hover:opacity-90 transition disabled:opacity-50 disabled:cursor-not-allowed"
               type={"submit"} disabled={loading}>{loading ? "Logging in..." : "Login"}</button>
        </div>
      </form>
    </div>    
    );
}