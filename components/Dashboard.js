"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { fetchuser, updateProfile } from "@/actions/useractions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Bounce } from "react-toastify";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    username: "",
    profile: "",
    coverPic: "",
    razorpayid: "",
    razorpaysecret: "",
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
      getData();
    }
  }, [status]);

  const getData = async () => {
    if (!session?.user) return;

    const u = await fetchuser(session.user.name);
    if (u) setForm(u); // ✅ never set null
  };

  const handlechange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // 🔥 VERY IMPORTANT

    await updateProfile(form, session.user.name);
    toast("Profile Updated", {
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

  if (status === "loading") {
    return <p>Loading...</p>;
  }

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
      <div className="container mx-auto transition-all ease-in-out duration-200 px-5 md:px-0 text-white pt-5 pb-20">
        <h1 className="text-center text-xl transition-all ease-in-out duration-200 md:text-3xl font-bold pt-6">
          Welcome to your Dashboard
        </h1>

        <form className="max-w-2xl mx-auto" onSubmit={handleSubmit}>
          <div className="info space-y-4">
            {[
              { label: "Name", name: "name" },
              { label: "Email", name: "email" },
              { label: "Username", name: "username" },
              { label: "Profile Picture", name: "profile" },
              { label: "Cover Picture", name: "coverPic" },
              { label: "Razorpay Id", name: "razorpayid" },
            ].map((field) => (
              <div key={field.name} className="flex flex-col gap-2">
                <label className="font-bold mx-1">{field.label}</label>
                <input
                  className="bg-gray-900 w-full p-3 rounded-xl"
                  type="text"
                  name={field.name}
                  value={form[field.name] || ""}
                  onChange={handlechange}
                />
              </div>
            ))}

            <div className="flex flex-col gap-2">
              <label className="font-bold mx-1">Razorpay Secret</label>
              <input
                className="bg-gray-900 w-full p-3 rounded-xl"
                type="text"
                name="razorpaysecret"
                value={form.razorpaysecret || ""}
                onChange={handlechange}
              />
            </div>

            <button
              type="submit"
              className="text-white w-full rounded-md bg-linear-to-br from-purple-800 to-blue-500 hover:font-bold px-4 py-2.5"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Dashboard;

 