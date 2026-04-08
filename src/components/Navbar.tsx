import Link from 'next/link';

export function Navbar(){
    return(
        <div className="w-full flex items-center justify-between py-4">
            <h1 className="text-xl font-semibold text-primary">Hirely</h1>
            <div className="flex items-center gap-6 text-sm text-gray-600">
            <Link href="/jobs" className="hover:text-primary transition">Jobs</Link>
             <Link href="/dashboard" className="hover:text-primary transition">Dashboard</Link>
             </div>
             <div className="flex items-center gap-3">
                <Link href="/login" className="text-sm text-gray-600 hover:text-primary">Login</Link>
                <Link href="/signup" className="bg-primary text-white px-4 py-2 rounded-xl text-sm hover:opacity-90 transition">Sign Up</Link>
             </div>
        </div>
    )
}

