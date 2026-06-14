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
            onClick={() => console.log('Google login')}
          >
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </Button>
          <Button 
            variant="secondary" 
            className="w-full justify-center"
            onClick={() => console.log('Facebook login')}
          >
            <img src="/facebook.svg" alt="Facebook" className="w-5 h-5" />
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
            onClick={() => console.log('Google signup')}
          >
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            Sign up with Google
          </Button>
          <Button 
            variant="secondary" 
            className="w-full justify-center"
            onClick={() => console.log('Facebook signup')}
          >
            <img src="/facebook.svg" alt="Facebook" className="w-5 h-5" />
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