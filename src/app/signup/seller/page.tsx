import Link from "next/link";

export default function SellerSignupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-lg glass-panel p-8 rounded-2xl shadow-2xl border-emerald-500/10">
        <div className="text-center mb-8">
          <div className="inline-block p-2 bg-emerald-500/10 rounded-full mb-4">
            <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Become a Seller</h1>
          <p className="text-neutral-400">Join our trusted network of gadget professionals</p>
        </div>

        <form className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Business Name</label>
              <input 
                type="text" 
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                placeholder="Gadget Hub"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-300 mb-1">Email Address</label>
              <input 
                type="email" 
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
                placeholder="biz@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-1">Verification Documents (ID/License)</label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-neutral-700 border-dashed rounded-lg bg-neutral-800/50 hover:bg-neutral-800 transition-colors cursor-pointer">
              <div className="space-y-1 text-center">
                <svg className="mx-auto h-12 w-12 text-neutral-500" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                  <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <div className="flex text-sm text-neutral-400">
                  <span className="text-emerald-500 font-medium">Upload files</span>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-neutral-500">PDF, PNG, JPG up to 10MB</p>
              </div>
            </div>
          </div>
          <button type="submit" className="w-full btn-primary py-3 font-semibold mt-4">
            Submit Application
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-neutral-500">
          Already have an account? <Link href="/login" className="text-emerald-500 hover:text-emerald-400 font-medium ml-1">Log in</Link>
        </div>
      </div>
    </div>
  );
}
