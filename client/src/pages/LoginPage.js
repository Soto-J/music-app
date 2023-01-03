import React, { useState, useContext } from "react";
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from "../components/context/AuthContext";

function LoginPage() {
  const auth = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState(false);

  const from = location.state?.from?.pathname || "/";
  const inputclasses = "shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-sm-light"

  //updates data for all input fields 
  const fieldChanged = (name) => {
    return (event) => {
      let { value } = event.target;
      setData((prevData) => ({ ...prevData, [name]: value }));
    };
  };

  const login = async (e) => {
    e.preventDefault();
    let { email, password } = data;

    try {
      await auth.authenticate(email, password);
      console.log(auth);
      //redirects user to "/" if login succesful
      navigate(from, { replace: true });
    } catch (error) {
      setError(true);
    }
  };

  let errorMessage = "";
  if (error) {
    errorMessage = (
      <div className="px-4 py-3 text-teal-900 bg-teal-100 border-t-4 border-teal-500 rounded-b shadow-md" role="alert">
        <div className="flex">
          <div className="py-1"><svg className="w-6 h-6 mr-4 text-teal-500 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM9 11V9h2v6H9v-4zm0-6h2v2H9V5z"/></svg></div>
          <p className="font-bold">Login Failed</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-16">
      <form onSubmit={login} className="flex flex-col items-center justify-center h-auto">
          <div>
            <div className="mb-6 text-center">
              <p className="pb-2 text-xl">Login</p>
              {errorMessage}
            </div>
            
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
              <input
                type="email"
                className= {inputclasses}
                placeholder="example@email.com" 
                value={data.email}
                onChange={fieldChanged('email')}/>
            </div>

            <div className="mb-6">
              <label  htmlFor="password" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
              <input 
                type="password"
                className= {inputclasses}
                value={data.password}
                onChange={fieldChanged('password')}/>
            </div>
          
            <div className="grid grid-cols-2 gap-4">
              <div>
                <button
                  type="submit"
                  className="text-black bg-green-400 hover:bg-green-500 rounded-full text-sm px-5 py-2.5 text-center"
                  >Enter</button>
              </div>
              <div>
                <Link className="inline-block p-3 text-sm bg-green-300 rounded-full hover:bg-green-500" to="/signup">New User?</Link>
              </div>
            </div>
          </div>
      </form>
    </div>
);
}

export default LoginPage;