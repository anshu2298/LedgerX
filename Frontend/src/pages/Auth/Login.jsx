import { useContext, useState } from "react";
import AuthLayout from "../../components/layouts/AuthLayout";
import { Link, useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosInstence";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext.jsx";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { updateUser } = useContext(UserContext);
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setError("Please provide a valid email");
      return;
    }

    if (!password) {
      setError("please enter password");
      return;
    }

    setError("");

    try {
      const response = await axiosInstance.post(API_PATHS.AUTH.LOGIN, {
        email,
        password,
      });

      const { token, user, success, message } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(user);
        navigate("/dashboard");
      }

      if (success) {
        toast.success(`${message} ${user.fullname}`);
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong, Please try again later.");
      }
    }
  };
  return (
    <AuthLayout>
      <div className='lg:w-[70%] h-3/4 md:h-full flex flex-col justify-center'>
        <h3 className='text-xl md:text-3xl font-semibold text-black'>
          Welcome Back
        </h3>
        <p className='text-xs md:text-lg text-slate-700 mt-[5px] mb-15'>
          Please enter your details to log in.
        </p>

        <form onSubmit={handleLogin}>
          <Input
            value={email}
            onChange={({ target }) => setEmail(target.value)}
            label='Email Address'
            placeholder='john@example.com'
            type='text'
          />

          <Input
            value={password}
            onChange={({ target }) => setPassword(target.value)}
            label='Password'
            placeholder='Enter password'
            type='password'
          />

          {error && <p className='text-red-500 text-xs pb-2.5'>{error}</p>}

          <button
            type='submit'
            className='btn-primary'
          >
            LOGIN
          </button>
          {/* <p>or</p> */}
          {/* <GoogleLogin
            onSuccess={async (credResponse) => {
              console.log(credResponse);
              const token = credResponse.credential;
              const decodedToken = jwtDecode(token);
              console.log(decodedToken);
              const fullname = decodedToken.name;
              const email = decodedToken.email;
              const profileImageUrl = decodedToken.picture;
              const s = decodedToken.name;
              const response = await axiosInstance.post(
                API_PATHS.AUTH.REGISTER,
                {
                  fullname,
                  email,
                  password,
                  profileImageUrl,
                }
              );
              navigate("/dashboard");
            }}
            onError={() => {
              console.log("LOGIN FAILED");
            }}
          /> */}

          <p className='text-[13px] text-slate-800 mt-3'>
            Don’t have an account?{" "}
            <Link
              className='font-medium text-primary underline'
              to='/signup'
            >
              SignUp
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Login;
