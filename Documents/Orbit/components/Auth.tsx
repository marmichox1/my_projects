import React, { useState } from 'react';
import { Sparkles, ArrowRight } from './Icons';

interface AuthProps {
    onLogin: (credentials: { email: string; password: string }) => Promise<void>;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<'login' | 'signup'>('login');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await onLogin({ email, password });
        } catch (error) {
            console.error(error);
            alert('Login failed. Please check your credentials.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex bg-white w-full">
            <div className="hidden lg:flex w-1/2 bg-slate-950 relative justify-center items-center overflow-hidden">
                <div className="absolute w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[100px] -top-20 -left-20"></div>
                <div className="absolute w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[100px] bottom-0 right-0"></div>
                <div className="absolute w-full h-full bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

                <div className="relative z-10 p-16 max-w-2xl text-white">
                    <h1 className="text-6xl font-bold tracking-tight mb-6 leading-tight">
                        Simplify your <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-400">workflow.</span>
                    </h1>
                    <p className="text-slate-400 text-lg leading-relaxed max-w-md">
                        Orbit empowers your business with comprehensive tools for inventory, team management, analytics, and growth.
                    </p>

                    <div className="mt-12 flex items-center gap-4 text-sm text-slate-500 font-medium">
                        <div className="flex -space-x-2">
                            <div className="w-8 h-8 rounded-full bg-slate-800 border-2 border-slate-950"></div>
                            <div className="w-8 h-8 rounded-full bg-slate-700 border-2 border-slate-950"></div>
                            <div className="w-8 h-8 rounded-full bg-slate-600 border-2 border-slate-950"></div>
                        </div>
                        <span>Trusted by 4,000+ companies</span>
                    </div>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 lg:p-16">
                <div className="w-full max-w-sm">
                    <div className="lg:hidden flex items-center gap-2 mb-8">
                        <span className="text-xl font-bold text-slate-900">Orbit</span>
                    </div>

                    <h2 className="text-2xl font-bold text-slate-900 mb-2">
                        {mode === 'login' ? 'Welcome back' : 'Create an account'}
                    </h2>
                    <p className="text-slate-500 mb-8">
                        {mode === 'login' ? 'Please enter your details to sign in.' : 'Enter your details to get started today.'}
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all placeholder:text-slate-300"
                                placeholder="name@company.com"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1.5">Password</label>
                            <input
                                type="password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-900/10 focus:border-slate-900 outline-none transition-all placeholder:text-slate-300"
                                placeholder="••••••••"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-slate-900 hover:bg-slate-800 text-white py-3 rounded-xl font-medium transition-all shadow-xl shadow-slate-200 flex items-center justify-center gap-2 mt-2"
                        >
                            {isLoading ? (
                                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                            ) : (
                                <>
                                    {mode === 'login' ? 'Sign In' : 'Sign Up'}
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500">
                            {mode === 'login' ? "Don't have an account?" : "Already have an account?"}
                            <button
                                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                                className="ml-2 font-medium text-slate-900 hover:underline"
                            >
                                {mode === 'login' ? 'Sign up' : 'Log in'}
                            </button>
                        </p>
                        <p className="text-xs text-slate-400 mt-6">
                            made with love by Ayman AABIYDA
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Auth;