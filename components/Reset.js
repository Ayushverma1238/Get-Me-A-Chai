"use client";
import React from "react";
import { useState } from "react";
import Link from "next/link";
import { updatePassword } from "@/actions/useractions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";

const Resetpass = () => {
  const [form, setform] = useState({
    email: "",
    password: "",
    confirmPass: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlechange = (e) => {
    setform({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 🔥 VERY IMPORTANT

    if (form.password !== form.confirmPass) {
      toast("Password Mismatch...", {
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
      return;
    }

    await updatePassword(form.password, form.email);


    toast("Password Updated Successfull", {
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
      <div className="text-white overflow-y-auto py-5 mx-auto">
        <h1 className="text-center font-bold  text-3xl">Reset Password</h1>
        <div className="w-[90%] md:w-[40vw] max-w-110 px-10 mx-auto py-4 mt-7 rounded-2xl bg-linear-to-br from-slate-400 to-black shadow-xl shadow-white ring-2 ring-black hover:shadow-2xl transition-all">
          <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3">
              <label className="font-bold mx-1">Email</label>
              <input
                className="bg-gray-900 w-full ring-1 p-3 rounded-xl"
                type="text"
                name="email"
                value={form["email"] || ""}
                onChange={handlechange}
                placeholder={`Enter Your email`}
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold mx-1">Password</label>
              <div className="relative">
                <input
                  className="bg-gray-900 ring-1 w-full p-3 rounded-xl"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form['password'] || ""}
                  onChange={handlechange}
                  placeholder="Enter Password"
                />

                <span
                  className="absolute right-2 top-2 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <img src={showPassword ? "/hide.svg" : "/show.svg"} alt="" />
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              <label className="font-bold mx-1">Confirm Password</label>
              <div className="relative">
                <input
                  className="bg-gray-900  ring-1 w-full p-3 rounded-xl"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPass"
                  value={form['confirmPass'] || ""}
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
              className="text-white ring-1 my-3 w-full rounded-md bg-linear-to-br from-purple-800 to-blue-500 hover:font-bold px-4 py-2.5"
            >
              Reste Password
            </button>
          </form>
          <div className="flex gap-3 mt-4 items-center text-gray-300 justify-center">
            Login Now?{" "}
            <div className="relative inline-block group">
              <Link
                href="/login"
                className="cursor-pointer font-sans text-[#1605ff] font-bold"
              >
                Login
              </Link>
              <div className="absolute left-0 -bottom-1 h-1 w-full rounded-full bg-gray-500 scale-x-0 transition-transform duration-300 group-hover:scale-x-100 origin-left"></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Resetpass;
