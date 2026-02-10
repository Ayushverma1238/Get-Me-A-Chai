"use client";
export const dynamic = "force-dynamic";

import { fetchPayment, initiate } from "@/actions/useractions";
import React, { useEffect } from "react";
import Script from "next/script";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { fetchuser } from "@/actions/useractions";
import { useSearchParams, useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";
// import payments from "razorpay/dist/types/payments";

const PaymentPage = ({ username = "" }) => {
  const { data: session } = useSession();
  const [currentUser, setcurrentUser] = useState({});
  // const [mounted, setMounted] = useState(false);

  // useEffect(() => {
  //   setMounted(true);
  // }, []);

  // if (!mounted) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center text-white">
  //       Loading...
  //     </div>
  //   );
  // }

  const [paymentform, setpaymentform] = useState({
    name: "",
    message: "",
    amount: "",
  });
  const capitalize = (str = "") =>
    str.toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());

  useEffect(() => {
    if (!username) return;
    getData();
  }, [username]);

  const handleChange = (e) => {
    setpaymentform({ ...paymentform, [e.target.name]: e.target.value });
  };

  const [Payments, setPayments] = useState([]);

  const getData = async () => {
    if (!username) return;

    const u = await fetchuser(username);
    if (!u) return;

    setcurrentUser(u);

    const dbPayments = await fetchPayment(username);
    setPayments(dbPayments);
  };
  const SearchParams = useSearchParams();
  const router = useRouter();

  const totalAmount = Payments.reduce((a, b) => a + b.amount, 0);


  const paymentDone = SearchParams.get("paymentdone");

  useEffect(() => {
    if (paymentDone === "true") {
      toast("Payment has been made", {
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
      router.replace(`/user/${username}`);
    }
  }, [paymentDone, router, username]);

  const processPayment = async (amount) => {
    if (!session?.user) {
      alert("Please login first");
      return;
    }

    if (!currentUser?.razorpayid) {
      alert("Creator has not configured Razorpay");
      return;
    }
    const finalAmount = Number(amount);

    if (!finalAmount || finalAmount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    const a = await initiate(finalAmount, session.user.name, paymentform);
    const order_id = a.id;
    if (typeof window === "undefined") return;

    if (!window.Razorpay) {
      toast.error("Payment system loading, try again");
      return;
    }

    const options = {
      key: currentUser.razorpayid,

      amount: Number(amount) * 100,
      currency: "INR",
      name: "Get Me A Chai",
      description: "Test Transaction",
      image: "https://example.com/your_logo",
      order_id: order_id,

      handler: async function (response) {
        if (!session || !session.user) {
          alert("Session expired. Please login again.");
          return;
        }
        const formData = new FormData();
        formData.append("razorpay_order_id", response.razorpay_order_id);
        formData.append("razorpay_payment_id", response.razorpay_payment_id);
        formData.append("razorpay_signature", response.razorpay_signature);

        const res = await fetch("/api/razorpay", {
          method: "POST",
          body: formData,
        });

        const data = await res.json();

        if (data.success) {
          // console.log("Redirect data:", session.user);

          window.location.href = `/user/${session.user.name}?paymentdone=true`;
        } else {
          alert("Payment failed");
        }
      },

      // prefill: {
      //   name: "Ayush Verma",
      //   email: "ayush@example.com",
      //   contact: "9999999999",
      // },

      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
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
      {/* Load Razorpay script */}

      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="afterInteractive"
      />

      {/* Payment button */}
      {/* <button
        onClick={handlePayment}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg"
      >
        Pay ₹500
      </button> */}

      <div className="cover w-full bg-red-200 relative">
        <img
          className="object-cover w-full h-45 md:h-87.5"
          src={currentUser.coverPic || "../patreon_banner.gif"}
          alt="cover"
        />
        <div
          className="absolute z-10 left-1/2 -translate-x-1/2 -bottom-15
                w-24 h-24 sm:w-28 sm:h-28 md:w-30 md:h-30
                border-2 border-white rounded-full overflow-hidden"
        >
          <img
            src={currentUser.profile || `https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcStvL8kNVKvJskGpi8do02RNw2bn3sKxTTJ2g&s`}
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <div className="username pb-20 px-6 md:px-0 items-center flex gap-4 flex-col mt-20 text-white">
        <div className="font-bold text-3xl">@{username}</div>
        <div className="text-slate-400">Lets help {username} get a chai.</div>
        <div className="text-slate-400">
          {Payments.length} Payments . {currentUser.name} raised ₹
          {totalAmount};

        </div>

        <div className="payment flex flex-col md:flex-row gap-3 w-full max-w-5xl mx-auto px-4">
          <div className="supporters px-5 py-3 w-full md:w-[60%] bg-slate-900 rounded-lg text-white">
            <h2 className="text-2xl my-4 font-bold">Top 10 Supporters..</h2>
            <ul className="mx-5 text-lg max-h-65 overflow-y-auto">
              {Payments.filter((p) => p.done).length === 0 && (
                <li className="text-gray-400">No payments yet.</li>
              )}

              {Payments.filter((p) => p.done).map((p) => (
                <li key={p._id} className="my-4 flex gap-2 items-start">
                  <img
                    width={35}
                    // height={33}
                    src="../avatar.gif"
                    alt="avatar"
                    className="shrink-0"
                  />

                  <div className="flex flex-col 2xl:flex-row">
                    <div className="flex gap-1 flex-wrap">
                      <span className="text-gray-400">
                        {capitalize(p.name)}
                      </span>
                      <span>
                        Donated{" "}
                        <span className="font-bold text-white">{p.amount}</span>{" "}
                        with a message
                      </span>
                    </div>
                    {/* message on new line */}
                    <div className="text-gray-300 wrap-break-words">
                      "{capitalize(p.message)}. Lots of ❤️"
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-full md:w-[40%] px-5 py-3 bg-slate-900 rounded-lg text-white">
            <h2 className="text-2xl my-4 font-bold">Make a Payment</h2>
            <div className="flex gap-2 flex-col">
              <input
                className="bg-gray-800 w-full rounded-md p-3"
                type="text"
                name="name"
                placeholder="Enter Name"
                onChange={handleChange}
                value={paymentform.name || ""}
              />
              <input
                className="bg-gray-800 w-full rounded-md p-3"
                type="text"
                name="message"
                placeholder="Enter Message"
                onChange={handleChange}
                value={paymentform.message || ""}
              />
              <input
                className="bg-gray-800 w-full rounded-md p-3"
                type="text"
                name="amount"
                placeholder="Enter Amount"
                onChange={handleChange}
                value={paymentform.amount || ""}
              />
              <button
                type="button"
                className="
                    text-white rounded-md font-medium text-sm px-4 py-2.5 text-center leading-5
                    bg-linear-to-br from-purple-800 to-blue-500
                    hover:bg-linear-to-bl hover:font-bold
                    focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800
                    disabled:from-slate-100
                    disabled:to-slate-900
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                    disabled:hover:font-medium
                  "
                onClick={() => processPayment(Number(paymentform.amount))}
                disabled={
                  paymentform.name?.length < 3 ||
                  paymentform.message?.length < 4 ||
                  Number(paymentform.amount) <= 0
                }
              >
                Pay
              </button>
            </div>
            <div className=" flex gap-3 py-3">
              <button
                className="relative hover:font-bold rounded-md inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-heading rounded-base group bg-linear-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                onClick={() => {
                  processPayment(10);
                }}
              >
                <span className=" relative px-4 py-2.5 transition-all ease-in duration-75 bg-neutral-primary-soft rounded-base group-hover:bg-transparent group-hover:dark:bg-transparent leading-5">
                  Pay ₹10
                </span>
              </button>
              <button
                className="relative hover:font-bold rounded-md inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-heading rounded-base group bg-linear-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                onClick={() => {
                  processPayment(20);
                }}
              >
                <span className=" relative px-4 py-2.5 transition-all ease-in duration-75 bg-neutral-primary-soft rounded-base group-hover:bg-transparent group-hover:dark:bg-transparent leading-5">
                  Pay ₹20
                </span>
              </button>
              <button
                className="relative hover:font-bold rounded-md inline-flex items-center justify-center p-0.5 overflow-hidden text-sm font-medium text-heading rounded-base group bg-linear-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800"
                onClick={() => {
                  processPayment(30);
                }}
              >
                <span className=" relative px-4 py-2.5 transition-all ease-in duration-75 bg-neutral-primary-soft rounded-base group-hover:bg-transparent group-hover:dark:bg-transparent leading-5">
                  Pay ₹30
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
