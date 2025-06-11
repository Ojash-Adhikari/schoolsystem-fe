import React, { useState, useEffect, useRef } from "react";
import useFetch from "../../utils/useFetch";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import "../../assets/css/account.css"; 

const Register = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    username: "",
    phone_number: "",  // Updated from `phonenumber` to `phone_number`
    password: "",
    confirmPassword: "",
  });
  const [passwordVisibility, setPasswordVisibility] = useState(false);

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

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    const userData = {
      email: formData.email,
      username: formData.username,
      phone_number: formData.phone_number, 
      password: formData.password,
    };

    axios
      .post("/api/users/register/", userData)
      .then((response) => {
        toast.success("Registration Successful. Redirecting to login...");
        navigate("/login");
      })
      .catch((error) => {
        console.error(error);
        toast.error("Registration Failed. Please try again.");
      });
  };

  useEffect(() => {
    const para = document.createElement("div");
    document.body.classList.add("no-scroll");
    para.className = "flex flex-wrap gap-0.5 h-screen items-center justify-center relative";
    let el = `<div class="transition-colors duration-[1.5s] hover:duration-[0s] border-[#00FF00] h-[calc(5vw-2px)] w-[calc(5vw-2px)] md:h-[calc(4vw-2px)] md:w-[calc(4vw-2px)] lg:h-[calc(3vw-4px)] lg:w-[calc(3vw-4px)] bg-gray-900 hover:bg-[#00FF00]"></div>`;
    for (let k = 1; k <= 1000; k++) {
      el += `<div class="transition-colors duration-[1.5s] hover:duration-[0s] border-[#00FF00] h-[calc(5vw-2px)] w-[calc(5vw-2px)] md:h-[calc(4vw-2px)] md:w-[calc(4vw-2px)] lg:h-[calc(3vw-4px)] lg:w-[calc(3vw-4px)] bg-gray-900 hover:bg-[#00FF00]"></div>`;
    }

    para.innerHTML = el;
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
        <div id="myDIV" ref={myDivRef}>
          <div className="w-[100vw] h-[100vh] px-3 sm:px-5 flex items-center justify-center absolute">
            <div className="w-full sm:w-1/2 lg:2/3 px-6 bg-gray-500 bg-opacity-20 bg-clip-padding backdrop-filter backdrop-blur-sm text-white z-50 py-4 rounded-lg">
              <div className="w-full flex justify-center text-[#00FF00] text-xl mb:2 md:mb-5">Register</div>
              <form onSubmit={onSubmit}>
                {/* Email Field */}
                <div className="mb-4">
                  <label htmlFor="email" className="block mb-2 text-xs font-medium text-white">Your Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="name@example.com"
                    required
                  />
                </div>
                
                {/* Username Field */}
                <div className="mb-4">
                  <label htmlFor="username" className="block mb-2 text-xs font-medium text-white">Username</label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="your username"
                    required
                  />
                </div>
                
                {/* Phone Number Field */}
                <div className="mb-4">
                  <label htmlFor="phone_number" className="block mb-2 text-xs font-medium text-white">Phone Number</label>
                  <input
                    type="text"
                    id="phone_number"  // Updated from `phonenumber` to `phone_number`
                    name="phone_number"
                    value={formData.phone_number}  // Updated to use `phone_number`
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    placeholder="123-456-7890"
                    required
                  />
                </div>
                
                {/* Password Field */}
                <div className="mb-4">
                  <label htmlFor="password" className="block mb-2 text-xs font-medium text-white">Password</label>
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
                </div>

                {/* Confirm Password Field */}
                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block mb-2 text-xs font-medium text-white">Confirm Password</label>
                  <input
                    type={passwordVisibility ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-1.5 md:p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    required
                    placeholder="**********"
                  />
                </div>

                {/* Toggle Password Visibility */}
                <div className="flex flex-row justify-between">
                  <button type="button" onClick={togglePasswordVisibility} className="text-sm text-white mt-2 mb-4">
                    {passwordVisibility ? "Hide Password" : "Show Password"}
                  </button>
                  <div className="text-white text-sm mt-2 md:text-md">
                    <a href="/login" className="custom-link">Sign in</a>
                  </div>
                </div>

                <button
                  type="submit"
                  className="mt-4 md:mt-10 w-full flex justify-center text-sm md:text-xl bg-[#350d69] py-2 rounded-md"
                >
                  Register
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
