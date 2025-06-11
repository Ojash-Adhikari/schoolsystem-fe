import React, { useState, useEffect, useRef } from "react";
import useSignIn from "react-auth-kit/hooks/useSignIn";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "../../assets/css/account.css"; // Import your CSS file for styling

const Login = () => {
  const signIn = useSignIn();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [passwordVisibility, setPasswordVisibility] = useState(false);
  const [showActivateButton, setShowActivateButton] = useState(false);

  // Create a ref to directly manipulate the `myDIV` element
  const myDivRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    setPasswordVisibility((prevVisibility) => !prevVisibility);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    axios
      .post("/api/users/token/", formData)
      .then((response) => {
        setShowActivateButton(false);
        if (
          signIn({
            auth: {
              token: response.data.access,
              type: "Bearer",
            },
            refresh: response.data.refresh,
            userState: response.data.user,
          }, console.log(response))
        ) {
          toast.success("Login Successful.");

          switch (response.data.user.user_type) {
            case "PRINCIPAL":
              navigate("/principal/dashboard");
              break;
            case "STUDENT":
              navigate("/user/dashboard");
              break;
            case "TEACHER":
              navigate("/teacher/dashboard");
              break;
            default:
              console.log("Unknown user type");
              break;
          }
        } else {
          toast.error("Login Failed.");
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          toast.error("Please use an Activated account.");
          setShowActivateButton(true);
        } else {
          toast.error("Incorrect Username or Password.");
        }
      });
  };


  // Integrate the JavaScript snippet using useEffect
  useEffect(() => {
    // Create a new div element and set class names
    const para = document.createElement("div");
    para.className = "flex flex-wrap gap-0.5 h-screen items-center justify-center relative";
    document.body.classList.add("no-scroll");
    // Generate multiple div elements with given styles and append them
    let el = `<div class="transition-colors duration-[1.5s] hover:duration-[0s] border-[#00FF00] h-[calc(5vw-2px)] w-[calc(5vw-2px)] md:h-[calc(4vw-2px)] md:w-[calc(4vw-2px)] lg:h-[calc(3vw-4px)] lg:w-[calc(3vw-4px)] bg-gray-900 hover:bg-[#00FF00]"></div>`;
    for (let k = 1; k <= 1000; k++) {
      el += `<div class="transition-colors duration-[1.5s] hover:duration-[0s] border-[#00FF00] h-[calc(5vw-2px)] w-[calc(5vw-2px)] md:h-[calc(4vw-2px)] md:w-[calc(4vw-2px)] lg:h-[calc(3vw-4px)] lg:w-[calc(3vw-4px)] bg-gray-900 hover:bg-[#00FF00]"></div>`;
    }

    para.innerHTML = el;

    // Append the newly created div to the target element using the ref
    if (myDivRef.current) {
      myDivRef.current.appendChild(para);
    }
    return () => {
      document.body.classList.remove("no-scroll"); // Cleanup when component unmounts
    };
  }, []);

  return (
    <div className="bg-gray-200">
      <div className="bg-black before:animate-pulse before:bg-gradient-to-b before:from-gray-900 overflow-hidden before:via-[#00FF00] before:to-gray-900 before:absolute">
        {/* Attach ref to the target div */}
        <div id="myDIV" ref={myDivRef}>
          <div className="w-[100vw] h-[100vh] px-3 sm:px-5 flex items-center justify-center absolute">
            <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-500 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4 rounded-lg">
              <div className="w-full flex justify-center text-[#00FF00] text-xl mb:2 md:mb-5">Sign In</div>
              <form onSubmit={onSubmit}>
                <div className="mb-6">
                  <label htmlFor="text" className="block mb-2 text-xs font-medium text-white">
                    Your Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@alchems.net"
                    required
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="password" className="block mb-2 text-xs font-medium text-white">
                    Your password
                  </label>
                  <input
                    type={passwordVisibility ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    placeholder="**********"
                  />
                  <button type="button" onClick={togglePasswordVisibility} className="text-sm text-white mt-2">
                    {passwordVisibility ? "Hide Password" : "Show Password"}
                  </button>
                </div>
                <div className="flex flex-row justify-between">
                  <div className="text-white text-sm md:text-md mr-4">
                    <a href="/register" className="custom-link">Forgot Password</a>
                  </div>
                  <div className="text-white text-sm md:text-md">
                    <a href="/register" className="custom-link">Sign Up</a>
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-4 md:mt-10 w-full flex justify-center text-sm md:text-xl bg-[#350d69] py-2 rounded-md hover:bg-[#814fc2]"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
