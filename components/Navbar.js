"use client"
import { useRouter } from "next/navigation";
import { useSession, signIn, signOut } from "next-auth/react";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";


const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [showdropdown, setShowdropdown] = useState(false);
  return (
    <nav className="bg-gray-900 z-100000 gap-2 md:gap-0 sticky top-0 text-white flex px-5 transition-all ease-in-out duration-1000 items-center min-h-16 py-2 justify-center flex-col md:flex-row md:justify-between w-full">
      <Link href={"/"}>
        <div className="logo text-lg flex justify-center items-center">
          <img src="/tea.gif" width={44} alt="" />
          <span className="font-bold text-xl md:text-base my-3 md:my-0">GetMeAChai</span>
        </div>
      </Link>
      {/* <ul className='flex gap-10 justify-between'>
        <li>Home</li>
        <li>About</li>
        <li>Contact</li>
        <li>SignUp</li>
        <li>Login</li>
      </ul> */}

      <div className="flex gap-3 sm:flex-row flex-col items-center relative">
        {session && (
          <>
            <button
              onClick={() => {
                setShowdropdown(!showdropdown);
              }}
              onBlur={() => {
                setTimeout(() => {
                  setShowdropdown(false);
                }, 100);
              }}
              id="dropdownHoverButton"
              data-dropdown-toggle="dropdownHover"
              data-dropdown-trigger="hover"
              className="inline-flex items-center justify-center text-white bg-blue-700 hover:bg-blue-800 dark:bg-blue-600 dark:hover:bg-blue-700 rounded-md box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
              type="button"
            >
              {session.user.email}
              <svg
                className="w-4 h-4 ms-1.5 -me-0.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m19 9-7 7-7-7"
                />
              </svg>
            </button>

            <div
              id="dropdownHover"
              className={`z-1000 left-12 ${showdropdown ? "" : "hidden"} absolute top-12 bg-gray-600 text-white border border-default-medium rounded-lg shadow-lg w-44`}
            >
              <ul
                className="p-2 text-sm text-body font-medium"
                aria-labelledby="dropdownHoverButton"
              >
                <li
                    onMouseDown={()=>{
                      if (session) {
                        router.push("/dashboard");
                      } else {
                        signIn("github", { callbackUrl: "/dashboard" });
                      }
                    }}
                    // href="/dashboard"
                    className="inline-flex cursor-pointer items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                  >
                    Dashboard
                  
                </li>

                <li
                    onMouseDown={() => {
                      if (session) {
                        router.push(`/user/${session.user.name}`);
                      } else {
                        signIn("github", { callbackUrl: "/dashboard" });
                      }
                    }}
                    // href={`/user/${session.user.name}`}
                    className="inline-flex cursor-pointer items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                  >
                    Your Page
                  
                </li>

                <li>
                  <Link
                    onMouseDown={() => {
                      signOut({ callbackUrl: "/" });
                    }}
                    href="#"
                    className="inline-flex items-center w-full p-2 hover:bg-neutral-tertiary-medium hover:text-heading rounded"
                  >
                    Sign out
                  </Link>
                </li>
              </ul>
            </div>
          </>
        )}
        {session && (
          <div className=" hidden md:inline gap-4 hover:font-bold">
            <button
              onClick={() => {
                signOut({ callbackUrl: "/" });
              }}
              type="button"
              // onClick={()=>{signIn("github")}}
              className="rounded-xl text-white bg-linear-to-br from-purple-600 to-blue-500 hover:bg-linear-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 hover:font-bold"
            >
              Logout
            </button>
          </div>
        )}

        {!session && (
          <div className="flex gap-5">
          <Link href={"/login"}>
            <button
              type="button"
              // onClick={()=>{signIn("github")}}
              className="rounded-xl text-white bg-linear-to-br from-purple-600 to-blue-500 hover:bg-linear-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 hover:font-bold"
            >
              Login
            </button>
          </Link>
          <Link href={"/register"}>
            <button
              type="button"
              // onClick={()=>{signIn("github")}}
              className="rounded-xl text-white bg-linear-to-br from-purple-600 to-blue-500 hover:bg-linear-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-base text-sm px-4 py-2.5 text-center leading-5 hover:font-bold"
            >
              Register
            </button>
          </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
