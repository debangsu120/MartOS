'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Store, Package, TrendingUp } from 'lucide-react';
import { useAuthStore } from '@/store';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast.success('Welcome back!');
      router.push('/dashboard');
    } catch (error) {
      toast.error('Invalid credentials');
    }
  };

  return (
    <div className="flex h-screen w-full">
      {/* Left Side - Branding (Hidden on Mobile) */}
      <div className="hidden lg:flex w-1/2 relative bg-gradient-to-br from-[#3e5219] to-[#556b2f] overflow-hidden items-center justify-center p-12">
        {/* Abstract Background */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <svg height="100%" width="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern height="40" id="dotPattern" patternUnits="userSpaceOnUse" width="40" x="0" y="0">
                <circle cx="2" cy="2" fill="#ffffff" r="2"></circle>
              </pattern>
            </defs>
            <rect fill="url(#dotPattern)" height="100%" width="100%" x="0" y="0"></rect>
          </svg>
        </div>
        
        {/* Decorative Image */}
        <div className="absolute -right-24 -bottom-24 w-[600px] h-[600px] rounded-full overflow-hidden opacity-40 mix-blend-overlay pointer-events-none">
          <img 
            alt="Organic ingredients"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAwxOzJbTLNWUUCxBKRIpxPC8upv9aPtYk6pDtUAZzZ0z-v8Y7IMERnvz65wo25mb0wMuDlPLWRnBzydzf4WOwW0-3_nvYzn5Uh-qLnkEJ00F57_WODS87b7VUeqJ3ZXth9FoQv1r7FvqQM61yIUVjnovaz0ZlUx2l4Wq07V2Pu29hchXi_QFxgmTp2xRttcfio9KHJThtwib_TVmhhFl3F5F17ON3ZpRdfBN1sP1unHCBOybUqsceKaDOtC1A24J1h_SwCEXLHD34M"
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 max-w-lg text-white">
          <div className="flex items-center gap-3 mb-8">
            <Store size={40} className="text-white" />
            <h1 className="font-display text-5xl font-bold">MartOS</h1>
          </div>
          <h2 className="font-display text-4xl leading-tight mb-6 font-bold">
            Smart Retail Management for Modern Marts
          </h2>
          <p className="text-lg opacity-90 mb-12">
            Streamline your inventory, manage suppliers, and optimize your POS with our premium, unified retail operating system designed for artisanal and organic brands.
          </p>
          
          {/* Feature Cards */}
          <div className="space-y-6">
            <div className="glass-panel rounded-2xl p-6 flex items-center gap-4 hover-lift">
              <div className="bg-white/20 p-3 rounded-full flex items-center justify-center">
                <Package className="text-white" />
              </div>
              <div>
                <h3 className="font-display text-xl mb-1">Real-time Inventory</h3>
                <p className="text-sm opacity-80">Track stock levels across all your boutique locations instantly.</p>
              </div>
            </div>
            <div className="glass-panel rounded-2xl p-6 flex items-center gap-4 hover-lift ml-8">
              <div className="bg-white/20 p-3 rounded-full flex items-center justify-center">
                <TrendingUp className="text-white" />
              </div>
              <div>
                <h3 className="font-display text-xl mb-1">Predictive Analytics</h3>
                <p className="text-sm opacity-80">Forecast demand for your seasonal and artisanal products.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 bg-[#fff8f4]">
        {/* Mobile Brand Header */}
        <div className="absolute top-8 left-8 flex lg:hidden items-center gap-2 text-[#3e5219]">
          <Store size={32} />
          <span className="font-display text-xl font-bold">MartOS</span>
        </div>
        
        <div className="w-full max-w-md bg-white rounded-[32px] p-8 sm:p-12 soft-shadow border border-[#fff1e4]">
          <div className="mb-10 text-center">
            <h2 className="font-display text-3xl text-[#231a0f] mb-2">Welcome Back</h2>
            <p className="text-[#45483c]">Sign in to manage your retail operations.</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-medium text-[#231a0f] mb-2 uppercase tracking-wide" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-[#45483c]/50">✉</span>
                </div>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@boutiquemart.com"
                  required
                  className="w-full pl-11 pr-4 py-3 bg-[#fff1e4] border-none rounded-xl text-[#231a0f] focus:ring-2 focus:ring-[#3e5219] focus:bg-white transition-colors"
                />
              </div>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-[#231a0f] uppercase tracking-wide" htmlFor="password">
                  Password
                </label>
                <Link href="/forgot-password" className="text-xs font-medium text-[#3e5219] hover:text-[#556b2f] transition-colors">
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <span className="text-[#45483c]/50">🔒</span>
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full pl-11 pr-11 py-3 bg-[#fff1e4] border-none rounded-xl text-[#231a0f] focus:ring-2 focus:ring-[#3e5219] focus:bg-white transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-[#45483c]/50 hover:text-[#231a0f] transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-5 w-5 rounded border-[#c5c8b8] text-[#3e5219] focus:ring-[#3e5219] bg-[#fff1e4] border-none"
              />
              <label htmlFor="remember-me" className="ml-3 block text-sm text-[#45483c]">
                Remember me for 30 days
              </label>
            </div>
            
            <button
              type="submit"
              className="w-full flex justify-center py-4 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-[#3e5219] hover:bg-[#556b2f] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3e5219] transition-colors duration-200"
            >
              Sign In to Dashboard
            </button>
          </form>
          
          <div className="mt-8 pt-8 border-t border-[#fff1e4] text-center">
            <p className="text-sm text-[#45483c]">
              Don't have an account?{' '}
              <Link href="/contact" className="text-xs font-medium text-[#3e5219] hover:text-[#556b2f] ml-1">
                Contact Support
              </Link>
            </p>
          </div>
        </div>
        
        {/* Footer Text */}
        <div className="absolute bottom-8 text-center w-full lg:w-1/2">
          <p className="text-xs text-[#45483c]/60">© 2024 MartOS Retail Systems. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}