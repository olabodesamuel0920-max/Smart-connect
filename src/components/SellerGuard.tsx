import { ReactNode } from "react";
import { AlertCircle, Clock } from "lucide-react";
import Link from "next/link";

export type VerificationStatus = 'pending' | 'approved' | 'rejected' | 'suspended';

interface SellerGuardProps {
  children: ReactNode;
  status: VerificationStatus;
  feature?: 'onboarding' | 'business'; // onboarding = store setup, business = products/orders
}

export default function SellerGuard({ children, status, feature = 'business' }: SellerGuardProps) {
  // Always allow approved
  if (status === 'approved') {
    return <>{children}</>;
  }

  // Pending logic
  if (status === 'pending') {
    // Allow access to store setup/onboarding
    if (feature === 'onboarding') {
      return <>{children}</>;
    }

    // Block business features
    return (
      <div className="flex flex-col items-center justify-center p-12 glass-panel rounded-2xl border-emerald-500/20 text-center">
        <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
          <Clock className="text-emerald-500" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Verification Required</h2>
        <p className="text-neutral-400 max-w-md mx-auto mb-8">
          Your account is pending review. While you can set up your store profile, 
          managing products and processing orders requires full verification.
        </p>
        <div className="flex gap-4">
          <Link href="/seller/store" className="btn-primary">
            Complete Store Setup
          </Link>
          <Link href="/seller" className="btn-secondary">
            Check Status
          </Link>
        </div>
      </div>
    );
  }

  if (status === 'suspended') {
    return (
      <div className="flex flex-col items-center justify-center p-12 glass-panel rounded-2xl border-red-500/20 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="text-red-500" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Account Suspended</h2>
        <p className="text-neutral-400 max-w-md mx-auto mb-8">
          Your access to business features has been temporarily suspended. Please contact support for more information.
        </p>
        <button className="btn-secondary text-red-400 border-red-900/50">
          Contact Support
        </button>
      </div>
    );
  }

  if (status === 'rejected') {
    return (
      <div className="flex flex-col items-center justify-center p-12 glass-panel rounded-2xl border-red-500/20 text-center">
        <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
          <AlertCircle className="text-red-500" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Application Rejected</h2>
        <p className="text-neutral-400 max-w-md mx-auto mb-8">
          We regret to inform you that your seller application was not approved at this time.
        </p>
        <button className="btn-primary">
          Re-apply
        </button>
      </div>
    );
  }

  return null;
}
