"use client";
import { useState } from "react";

export default function SignupPage(){
    const [email,setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [role,setRole] = useState("CANDIDATE");
    const [loading,setLoading] = useState(false);
    const handleSignup = async (e:any) => {
        e.preventDefault();
        if(password.length<6){
            alert("Password must be at least 6 characters");
            return;
        }
        setLoading(true);
        try{
            const res = await fetch("/api/auth/signup",{
                method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({email,password,role}),
            });
            const data = await res.json();
            if(!res.ok){
                alert(data.error ||"Something went wrong");
                return;
            }
            alert("Signup successful 🎉");
            setEmail("");
            setPassword("");
            setRole("CANDIDATE");
            
        }catch(err){
            console.error(err);
        }finally{
            setLoading(false);
        }
    };
    return(
        <div className="flex items-center justify-center min-h-screen bg-background px-4">
           <form onSubmit={handleSignup} className="bg-card border border-border rounded-2xl p-8 w-full max-w-md shadow-lg">
             <h2 className="text-2xl font-semibold text-white mb-6">
                Sign Up
            </h2>
             <div className="space-y-4">
                <input placeholder="Email" type="email" className="w-full bg-transparent border border-border rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                <input placeholder="Password" type = "password" value={password} className="w-full bg-transparent border border-border rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary"onChange={(e)=>setPassword(e.target.value)} required/>
                <select className="w-full bg-transparent border border-border rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary" value={role} onChange={(e)=>setRole(e.target.value)}>
                    <option value="CANDIDATE">Candidate</option>
                    <option value="RECRUITER">Recruiter</option>
                </select>
                <button type="submit" disabled={loading} className="w-full bg-primary py-2 rounded-xl text-white font-medium hover:opacity-90 transition">Create Account</button>
             </div>
            </form> 
        </div>
    )
}