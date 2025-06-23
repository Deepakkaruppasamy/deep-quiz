import React, { useState } from "react";
import "./Login.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  loginUserName,
  loginUserEmail,
} from "../../Redux/action.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const Login = () => {
  const userId = useSelector((state) => state.mernQuize.userId);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({
      ...user,
      [name]: value,
    });
  };

  const login = () => {
    // Default admin bypass
    if (user.email === "admin@admin.com" && user.password === "admin123") {
      localStorage.setItem("isAdmin", "true");
      localStorage.removeItem("token");
      toast("Admin Login (default)", { type: "success" });
      setTimeout(() => {
        navigate("/admin-panel");
      }, 1000);
      return;
    }
    axios
      .post("http://localhost:3755/login", user)
      .then((res) => {
        if (res.data.user && res.data.user._id) {
          dispatch(loginUser(res.data.user._id));
          dispatch(loginUserName(res.data.user.name));
          dispatch(loginUserEmail(res.data.user.email));
          localStorage.setItem("isAdmin", res.data.isAdmin ? "true" : "false");
          if (res.data.token) localStorage.setItem("token", res.data.token);
          toast(`Successfully Login `, {
            type: "success",
          });
          setTimeout(() => {
            if (res.data.isAdmin) {
              navigate("/admin-panel");
            } else {
            navigate("/profile");
            }
          }, 2000);
        } else {
          toast("Invalid Credentials", {
            type: "error",
          });
        }
      })
      .catch((err) => {
        toast("Invalid Credentials", {
          type: "error" });
      });
  };

  return (
    <div className=" flex w-4/5 justify-around m-auto mt-16 mb-16">
      <div className="login mb-28 w-1/2 ml-48 ">
        <h1 className="text-2xl font-semibold">Login</h1>
        <input
          type="text"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Enter your Email"
        ></input>
        <input
          type="password"
          name="password"
          value={user.password}
          onChange={handleChange}
          placeholder="Enter your Password"
        ></input>
        <div>
          {" "}
          <button
            onClick={() => {
              login();
            }}
            className="p-2 pl-28 pr-28 bg-blue-500 h-10 rounded-md text-white  text-xl "
          >
            Login
          </button>
        </div>
        <div>OR</div>
        <Link to="/register">
          {" "}
          <button className="p-2 pl-28 pr-24 bg-blue-500 h-10 rounded-md text-white  text-xl ">
            Register
          </button>{" "}
        </Link>
      </div>
      <div className="w-1/2 ml-24">
        <img className="h-96 w-96" src="./login.gif" alt="logingif" />
      </div>
    </div>
  );
};
