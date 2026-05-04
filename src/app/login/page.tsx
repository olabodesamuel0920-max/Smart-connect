import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl shadow-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
          <p className="text-neutral-400">Secure access to Smart Connect</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Email Address</label>
            <input 
              type="email" 
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              placeholder="name@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Password</label>
            <input 
              type="password" 
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              placeholder="••••••••"
            />
          </div>
          <button type="submit" className="w-full btn-primary py-3 font-semibold mt-2">
            Sign In
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-neutral-500">
          Don't have an account? <br />
          <div className="mt-2 space-x-4">
            <Link href="/signup/buyer" className="text-emerald-500 hover:text-emerald-400 font-medium">Join as Buyer</Link>
            <span className="text-neutral-700">|</span>
            <Link href="/signup/seller" className="text-emerald-500 hover:text-emerald-400 font-medium">Start Selling</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
