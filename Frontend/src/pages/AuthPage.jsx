import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import BrandMark from '../components/shared/BrandMark';

const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: [0.22, 0.61, 0.36, 1] }
  },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } }
};

const errorVariants = {
  hidden: { opacity: 0, height: 0 },
  visible: { 
    opacity: 1, 
    height: 'auto',
    transition: { duration: 0.2, ease: 'easeOut' }
  },
  exit: { 
    opacity: 0, 
    height: 0,
    transition: { duration: 0.15 }
  }
};

function FloatingInput({ id, label, type = 'text', value, onChange, ...props }) {
  const [focused, setFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className="relative">
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className="peer w-full rounded-xl border border-white/20 bg-white/5 px-4 pb-2 pt-6 text-white placeholder-transparent transition-all duration-200 focus:border-accent-400 focus:outline-none focus:ring-2 focus:ring-accent-400/20"
        placeholder={label}
        {...props}
      />
      <label
        htmlFor={id}
        className={`absolute left-4 transition-all duration-200 pointer-events-none ${
          focused || hasValue
            ? 'top-2 text-xs text-accent-400'
            : 'top-4 text-sm text-white/60'
        }`}
      >
        {label}
      </label>
    </div>
  );
}

function AuthPage() {
  const navigate = useNavigate();
  const { login, register, error, clearError } = useAuth();
  
  const [mode, setMode] = useState('login');
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    organization: ''
  });

  const toggleMode = () => {
    setMode(mode === 'login' ? 'signup' : 'login');
    clearError();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    let result;
    if (mode === 'login') {
      result = await login(formData.email, formData.password);
    } else {
      result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        organization: formData.organization
      });
    }

    setLoading(false);

    if (result.success) {
      navigate('/');
    }
  };

  return (
    <div className="relative min-h-screen bg-ink-900 text-white">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-br from-ink-900 via-ink-800 to-ink-700" />
      <div 
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-4 py-12 lg:flex-row lg:gap-16">
        {/* Left side - Branding */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.33, 1, 0.68, 1] }}
          className="mb-10 max-w-xl lg:mb-0"
        >
          <div className="mb-6 flex items-center gap-3">
            <BrandMark />
            <div>
              <p className="text-lg font-semibold">Impact Pulse</p>
              <p className="text-sm text-white/70">Precision social impact analytics</p>
            </div>
          </div>
          <h1 className="text-4xl font-semibold leading-tight">
            Calm, secure access to your executive-grade insights.
          </h1>
          <p className="mt-3 text-white/70">
            Seamless SSO, natural motion, and zero noise. Built to inspire trust before a single
            metric loads.
          </p>
        </motion.div>

        {/* Right side - Auth form */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mode}
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={cardVariants}
            className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold">
                {mode === 'login' ? 'Welcome back' : 'Create executive access'}
              </h2>
              <button
                className="text-sm text-white/70 underline-offset-4 hover:underline transition-colors"
                onClick={toggleMode}
              >
                {mode === 'login' ? 'Create account' : 'Sign in'}
              </button>
            </div>

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {mode === 'signup' && (
                <FloatingInput
                  id="name"
                  label="Full name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  autoComplete="name"
                />
              )}
              <FloatingInput
                id="email"
                label="Work email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
              <FloatingInput
                id="password"
                label="Password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                required
              />
              {mode === 'signup' && (
                <FloatingInput
                  id="organization"
                  label="Organization"
                  type="text"
                  value={formData.organization}
                  onChange={handleChange}
                  autoComplete="organization"
                />
              )}

              {/* Error message */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    variants={errorVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-300"
                  >
                    {error}
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-500 to-teal-500 py-3 font-medium text-white shadow-lg shadow-accent-500/20 transition-all duration-200 hover:shadow-xl hover:shadow-accent-500/30 disabled:opacity-60"
                type="submit"
              >
                {loading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  mode === 'login' ? 'Sign in' : 'Create account'
                )}
              </motion.button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-white/10 px-2 text-white/50 backdrop-blur-sm">or continue with</span>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02, boxShadow: '0 12px 30px rgba(255,255,255,0.12)' }}
                whileTap={{ scale: 0.98 }}
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/20 bg-white/5 py-3 font-medium text-white transition-all duration-200 hover:bg-white/10"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Continue with Google
              </motion.button>
            </form>

            <p className="mt-6 text-center text-xs text-white/50">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default AuthPage;


