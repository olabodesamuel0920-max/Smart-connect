import Link from "next/link";

export default function BuyerSignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md glass-panel p-8 rounded-2xl shadow-2xl border-emerald-500/10">
        <div className="text-center mb-8">
          <div className="inline-block p-2 bg-emerald-500/10 rounded-full mb-4">
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Create Buyer Account</h1>
          <p className="text-neutral-400">Join the premium gadget marketplace</p>
        </div>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Full Name</label>
            <input 
              type="text" 
              className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
              placeholder="John Doe"
            />
          </div>
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
            Create Account
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-neutral-500">
          Already have an account? <Link href="/login" className="text-emerald-500 hover:text-emerald-400 font-medium ml-1">Log in</Link>
        </div>
      </div>
    </div>
  );
}
