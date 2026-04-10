export default function SignupPage(){
    return(
        <div className="flex items-center justify-center min-h-screen bg-background px-4">
           <div className="bg-card border border-border rounded-2xl p-8 w-full max-w-md shadow-lg">
             <h2 className="text-2xl font-semibold text-white mb-6">
                Sign Up
            </h2>
             <div className="space-y-4">
                <input placeholder="Email" type="email" className="w-full bg-transparent border border-border rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary" />
                <input placeholder="Password" type = "password" className="w-full bg-transparent border border-border rounded-xl px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-primary" />
                <select className="w-full bg-transparent border border-border rounded-xl py-2 px-3 focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="CANDIDATE">Candidate</option>
                    <option value="RECRUITER">Recruiter</option>
                </select>
                <button className="w-full bg-primary py-2 rounded-xl text-white font-medium hover:opacity-90 transition">Create Account</button>
             </div>
            </div> 
        </div>
    )
}