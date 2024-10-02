import React, { useState } from "react";
import useAuthStore from "../../store/authStore";
import axiosMasterInstance from "../../config/axiosMasterInstance";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [isAuthenticated, login] = useAuthStore((store) => [
    store.isAuthenticated,
    store.login,
  ]);

  const handleLogin = async () => {
    console.log("Login attempt")

    try {
      const responsePromise = axiosMasterInstance.post("/loginAdmin", {
        email,
        password,
      });

      toast.promise(responsePromise, {
        pending: "logging in...",
        error: "Failed to log in. check ur email, password",
      });
      const response = await responsePromise;

      if (response.status === 200 && response.data.role ==="MASTER") {
        toast.success("Logged in")
        const data = await response.data;
        login(email, password);
        console.log("The login data is ",data);
        window.location.href = "/";
      } else {
        toast.error("Failed to log in. check ur email, password")
        setErrorMessage("Invalid login credentials");
      }
    } catch (error) {
      console.error("Error during authentication:", error);
      setErrorMessage("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div>
        {isAuthenticated ? (
          <p>You are already logged in.</p>
        ) : (
          <div className="flex flex-col border-2 border-gray-300 bg-gray-200 px-4 py-5 rounded-md w-[50vh] gap-3">
            <h1 className="text-3xl font-bold flex justify-center">
              Svkm Master Login
            </h1>
            <div className="flex flex-col">
              <label>Email:</label>
              <input
                type="text"
                value={email}
                onChange={(e) => {
                  setErrorMessage("");
                  setEmail(e.target.value);
                }}
                className="block border rounded-md w-full p-2"
              />
            </div>
            <div className="flex flex-col">
              <label>Password:</label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setErrorMessage("");
                  setPassword(e.target.value);
                }}
                className="block border rounded-md w-full p-2"
              />
            </div>
            {errorMessage && (
              <p className=" text-red-600 text-center">{errorMessage}</p>
            )}
            <div className="flex justify-center w-full">
              <button
                onClick={handleLogin}
                className="bg-blue-500 hover:bg-blue-700 text-white py-1 px-6 rounded-md"
              >
                Login
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
