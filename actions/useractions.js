"use server";

import Razorpay from "razorpay";
import Payment from "@/models/Payment";
import User from "@/models/User";
import connectDb from "@/db/connectDb";
import { notFound } from "next/navigation";

import bcrypt from "bcryptjs";

export const initiate = async (amount, to_username, paymentform) => {
  if (!amount) {
    throw new Error("Amount is required");
  }

  await connectDb();

  let user = await User.findOne({username:to_username})
  if(!user){
    throw new error("Please Login Again")
  }
  const secret = user.razorpaysecret;
  const razorid = user.razorpayid;
  // ✅ Razorpay instance (SERVER KEYS ONLY)
  const instance = new Razorpay({
    key_id: razorid,
    key_secret: secret,
  });

  // ✅ Create order (amount in paise)
  const options = {
    amount: Number(amount) * 100,
    currency: "INR",
  };

  const order = await instance.orders.create(options);

  // ✅ Save payment in DB
  await Payment.create({
    oid: order.id,
    amount: amount,
    to_user: to_username,
    name: paymentform?.name ? paymentform.name : "Fans",
    message: paymentform?.message ? paymentform.message : "Love with Fans",
    
  });

  return order;
};

export const fetchuser = async (username) => {
  await connectDb();
  const u = await User.findOne({ username });
  return u ? u.toObject({ flattenObjectIds: true }) : null;
};

export const fetchPayment = async (username) => {
  await connectDb();
  const payments = await Payment.find({ to_user: username })
    .sort({ amount: -1 })
    .limit(10 )
    .lean();

  return payments.map(p => ({
    ...p,
    _id: p._id.toString(),
  }));
};


export const updateProfile = async (data, oldUsername) => {
  await connectDb();

  const ndata = data; // ✅ already a plain object

  if (oldUsername !== ndata.username) {
    const u = await User.findOne({ username: ndata.username });
    if (u) {
      return { success: false, message: "Username already exists" };
    }
    await User.updateOne({email:ndata.email}, ndata)
    await Payment.updateMany({to_user:oldUsername},{to_user:ndata.username})
  }

  await User.findOneAndUpdate(
    { username: oldUsername },
    ndata,
    { new: true }
  );

  return { success: true };
};



export const updatePassword = async (newPassword, email) => {
  await connectDb();

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await User.updateOne(
    { email },
    { password: hashedPassword }
  );

  return { success: true, message: "Password updated" };
};


