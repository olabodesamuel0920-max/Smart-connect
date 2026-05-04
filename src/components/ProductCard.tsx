import Link from "next/link";
import { ShieldCheck } from "lucide-react";

interface ProductCardProps {
  name: string;
  price: string;
  category: string;
  slug: string;
  imageUrl?: string;
  storeName: string;
  isVerified?: boolean;
}

export default function ProductCard({ 
  name, 
  price, 
  category, 
  slug, 
  imageUrl, 
  storeName, 
  isVerified = true 
}: ProductCardProps) {
  return (
    <Link href={`/products/${slug}`} className="group block">
      <div className="glass-panel rounded-2xl overflow-hidden transition-all duration-300 hover:border-emerald-500/30 hover:shadow-2xl hover:shadow-emerald-900/10 active:scale-[0.98]">
        {/* Image Placeholder */}
        <div className="aspect-square bg-neutral-900 relative flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt={name} className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-500" />
          ) : (
            <div className="text-neutral-700 font-medium uppercase tracking-widest text-xs">No Image</div>
          )}
          <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md text-[10px] font-bold text-emerald-500 px-2 py-1 rounded-full border border-emerald-500/20 uppercase tracking-tighter">
            {category}
          </div>
        </div>

        <div className="p-4 space-y-2">
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-white line-clamp-1 group-hover:text-emerald-400 transition-colors">{name}</h3>
          </div>
          
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <span className="truncate">{storeName}</span>
            {isVerified && <ShieldCheck size={12} className="text-emerald-500 flex-shrink-0" />}
          </div>

          <div className="pt-2 flex justify-between items-center">
            <span className="text-lg font-black text-white">₦{price}</span>
            <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">View Details</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
