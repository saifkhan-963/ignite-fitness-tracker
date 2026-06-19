import { Button, Input, Modal } from "../components/elements/Elements";
import { Lock, Mail, User, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export const LoginModal = ({ isOpen, onClose, onSwitchToSignup }) => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({ username: '', password: '', remember: false });
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Validation example
    const newErrors = {};
    if (!values.username) newErrors.username = 'Username is required';
    if (!values.password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        await login(values);
        onClose();
      } catch (error) {
        console.error('Login failed', error);
      }
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Welcome Back">
      <div className="space-y-6">
        {/* Social Login Buttons */}
        <div className="space-y-3">
          <Button 
            variant="secondary" 
            className="w-full justify-center"
            onClick={() => alert('Google login coming soon! OAuth credentials needed in .env')}
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
            Continue with Google
          </Button>
          <Button 
            variant="secondary" 
            className="w-full justify-center"
            onClick={() => alert('Facebook login coming soon! OAuth credentials needed in .env')}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Continue with Facebook
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input 
            type="text" 
            label="Username"
            placeholder="Enter your username" 
            icon={Mail}
            error={errors.username}
            value={values.username}
            onChange={(e) => setValues({...values, username: e.target.value})}
          />
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"}
              label="Password" 
              placeholder="Enter your password" 
              icon={Lock}
              error={errors.password}
              value={values.password}
              onChange={(e) => setValues({...values, password: e.target.value})}
            />
            <button
              type="button"
              className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input onChange={(e) => setValues({...values, remember: e.target.checked})}
              type="checkbox" className="rounded border-gray-300 text-orange-500 focus:ring-orange-500" />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">Remember me</span>
            </label>
            <button 
              type="button"
              className="text-sm text-orange-500 hover:text-orange-600"
              onClick={() => console.log('Forgot password')}
            >
              Forgot password?
            </button>
          </div>

          <Button className="w-full" loading={loading}>Sign in</Button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <button 
            className="text-orange-500 hover:text-orange-600 font-medium"
            onClick={() => {
              onClose();
              onSwitchToSignup();
            }}
          >
            Sign up
          </button>
        </p>
      </div>
    </Modal>
  );
};

export const SignupModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [values, setValues] = useState({ username: '', email: '', password: '', confirmPassword: '', termsNServices: false });
  const [showPassword, setShowPassword] = useState(false);

  const isStrongPassword = (password) => {
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return strongPasswordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Validation example
    const newErrors = {};
    if (!values.username) newErrors.username = 'Username is required';
    if (!values.email) newErrors.email = 'Email is required';
    if (!values.password) newErrors.password = 'Password is required';
    if (!isStrongPassword(values.password)) newErrors.password = 'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character';
    if (values.password !== values.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!values.termsNServices) newErrors.termsNServices = 'You must agree to the Terms of Service and Privacy Policy';
    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) {
      try {
        await register(values);
        setValues({ username: '', email: '', password: '', confirmPassword: '', termsNServices: false });
        onClose();
      } catch (error) {
        console.error('Registration failed', error);
      }
    }
    setLoading(false);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Account">
      <div className="space-y-6">
        {/* Social Signup Buttons */}
        <div className="space-y-3">
          <Button 
            variant="secondary" 
            className="w-full justify-center"
            onClick={() => alert('Google signup coming soon! OAuth credentials needed in .env')}
          >
            <svg className="w-5 h-5" viewBox="0 0 48 48"><path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/><path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/><path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/><path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/></svg>
            Sign up with Google
          </Button>
          <Button 
            variant="secondary" 
            className="w-full justify-center"
            onClick={() => alert('Facebook signup coming soon! OAuth credentials needed in .env')}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="#1877F2"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            Sign up with Facebook
          </Button>
        </div>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300 dark:border-gray-600" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white dark:bg-gray-800 text-gray-500">
              Or sign up with email
            </span>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <Input 
            type="text" 
            label="Username" 
            placeholder="Enter your username" 
            icon={User}
            error={errors.username}
            value={values.username}
            onChange={(e) => setValues({...values, username: e.target.value})}
          />
          <Input 
            type="email" 
            label="Email" 
            placeholder="Enter your email" 
            icon={Mail}
            error={errors.email}
            value={values.email}
            onChange={(e) => setValues({...values, email: e.target.value})}
          />
          <div className="relative">
            <Input 
              type={showPassword ? "text" : "password"}
              label="Password" 
              placeholder="Create a strong password" 
              icon={Lock}
              error={errors.password}
              value={values.password}
              onChange={(e) => setValues({...values, password: e.target.value})}
            />
            <button
              type="button"
              className="absolute right-3 top-[34px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <Input 
            type={showPassword ? "text" : "password"}
            label="Confirm Password" 
            placeholder="Confirm your password" 
            icon={Lock}
            error={errors.confirmPassword}
            value={values.confirmPassword}
            onChange={(e) => setValues({...values, confirmPassword: e.target.value})}
          />

          <div className="flex items-start">
            <label className="flex items-center">
              <input onChange={(e) => setValues({...values, termsNServices: e.target.checked})}
                type="checkbox"
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                I agree to the{' '}
                <a href="#" className="text-orange-500 hover:text-orange-600">
                  Terms of Service
                </a>{' '}
                and{' '}
                <a href="#" className="text-orange-500 hover:text-orange-600">
                  Privacy Policy
                </a>
              </span>
            </label>
          </div>
          {errors.termsNServices && (
              <div className="flex items-center ml-1">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <span className="text-sm text-red-500">{errors.termsNServices}</span>
              </div>
            )}

          <Button className="w-full" loading={loading}>Create Account</Button>
        </form>

        <p className="text-center text-sm text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <button 
            className="text-orange-500 hover:text-orange-600 font-medium"
            onClick={() => {
              onClose();
              onSwitchToLogin();
            }}
          >
            Sign in
          </button>
        </p>
      </div>
    </Modal>
  );
};