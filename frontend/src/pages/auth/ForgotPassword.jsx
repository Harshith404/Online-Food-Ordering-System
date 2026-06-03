import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import { MdEmail, MdFastfood } from 'react-icons/md';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setLoading(true);
    try {
      await resetPassword(email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err) {
      console.error(err);
      setError('Failed to send reset email. Verify your email address is correct.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-3xl border border-slate-100 bg-white p-8 shadow-xl">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="rounded-2xl bg-primary-50 p-3.5 text-primary-500 shadow-inner">
              <MdFastfood size={36} />
            </div>
          </div>
          <h2 className="mt-6 font-display text-3xl font-black tracking-tight text-slate-800">
            Reset Password
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Enter your email to receive a password reset link
          </p>
        </div>

        {error && (
          <div className="rounded-xl bg-rose-50 border border-rose-100 p-4 text-sm font-semibold text-rose-600">
            {error}
          </div>
        )}
        {message && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 p-4 text-sm font-semibold text-emerald-600">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
                <MdEmail size={20} />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 pl-10 pr-4 py-2.5 text-slate-800 placeholder-slate-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 outline-none transition-all"
                placeholder="name@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary-500 hover:bg-primary-600 text-white font-bold py-3 shadow-md hover:shadow-lg transition-all focus:outline-none disabled:opacity-50"
          >
            {loading ? 'Sending...' : 'Send Link'}
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          <Link to="/login" className="font-bold text-primary-500 hover:text-primary-600 transition-colors">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
