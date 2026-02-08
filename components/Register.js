"use client";
import React from "react";
import { useState } from "react";
import { useRef } from "react";
import Link from "next/link";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";

const Register = () => {
  // await connectDb();
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    password: "",
    confirmpassword: "",
  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!form.username.trim()) {
      newErrors.username = "Username is required";
    }

    if (!form.password) {
      newErrors.password = "Password is required";
    } else if (form.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!form.confirmpassword) {
      newErrors.confirmpassword = "Confirm password is required";
    } else if (form.password !== form.confirmpassword) {
      newErrors.confirmpassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      setForm({
        name: "",
        email: "",
        username: "",
        password: "",
        confirmpassword: "",
      });

      toast("Registerd Successful", {
            position: "bottom-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            transition: Bounce,
          });

      setErrors({});
    }
  };

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlechange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  return (
    <>
    <ToastContainer
            position="bottom-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick={false}
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            transition={Bounce}
          />
      <div className="container mx-auto w-[70%] px-5 text-white pt-5 pb-20">
        <div className="max-w-3xl px-10 mx-auto py-4 rounded-2xl bg-linear-to-br from-slate-800 to-gray-500 shadow-xl shadow-white ring-2 ring-black hover:shadow-2xl transition-all">
          <h1 className="text-center text-xl transition-all ease-in-out duration-200 md:text-3xl font-bold pt-6">
            Welcome!.. Register YourSelf
          </h1>
          <form className="max-w-2xl mx-auto mt-5" onSubmit={handleSubmit}>
            <div className="info space-y-4">
              {[
                { label: "Name", name: "name" },
                { label: "Email", name: "email" },
                { label: "Username", name: "username" },
              ].map((field) => (
                <div key={field.name} className="flex flex-col gap-2">
                  <label className="font-bold mx-1">{field.label}</label>
                  <input
                    className="bg-gray-900 w-full p-3 rounded-xl"
                    type="text"
                    name={field.name}
                    value={form[field.name] || ""}
                    onChange={handlechange}
                    placeholder={`Enter Your ${field.label}`}
                  />
                  {errors[field.name] && (
                    <p className="text-red-500 text-sm ml-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              ))}

              <div className="flex flex-col gap-2">
                <label className="font-bold mx-1">Password</label>
                <div className="relative">
                  <input
                    className="bg-gray-900 w-full p-3 rounded-xl"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password || ""}
                    onChange={handlechange}
                    placeholder="Enter Password"
                  />

                  <span
                    className="absolute right-2 top-2 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <img
                      src={showPassword ? "/hide.svg" : "/show.svg"}
                      alt=""
                    />
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-bold mx-1">Confirm Password</label>
                <div className="relative">
                  <input
                    className="bg-gray-900 w-full p-3 rounded-xl"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmpassword"
                    value={form.confirmpassword || ""}
                    onChange={handlechange}
                    placeholder="Enter Confirm Password"
                  />

                  <span
                    className="absolute right-2 top-2 cursor-pointer"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    <img
                      src={showConfirmPassword ? "/hide.svg" : "/show.svg"}
                      alt=""
                    />
                  </span>
                </div>
              </div>

              <button
                type="submit"
                className="text-white w-full rounded-md bg-linear-to-br from-purple-800 to-blue-500 hover:font-bold px-4 py-2.5"
              >
                Register
              </button>
            </div>
          </form>
          <div className="text-center text-lg my-6">
            <div className="flex gap-5 justify-center">
              Already Register?{" "}
              <div className="relative inline-block group">
                <Link
                  href="/login"
                  className="cursor-pointer font-sans text-[#1605ff] font-bold"
                >
                  Login here
                </Link>

                <div className="absolute left-0 -bottom-1 h-1 w-full rounded-full bg-gray-800 scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
