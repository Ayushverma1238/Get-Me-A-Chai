import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import Payment from "@/models/Payment";
import { validatePaymentVerification } from "razorpay/dist/utils/razorpay-utils";
import User from "@/models/User";

export async function POST(req) {
  await connectDb();

  const formData = await req.formData();
  const body = Object.fromEntries(formData);

  const payment = await Payment.findOne({
    oid: body.razorpay_order_id,
  });

  if (!payment) {
    return NextResponse.json({ success: false, reason: "Order not found" });
  }

  let user = await User.findOne({ username: payment.to_user });
  const secret = user.razorpaysecret;

  // 🔐 VERIFY USING SERVER SECRET ONLY 
  const isValid = validatePaymentVerification(
    {
      order_id: body.razorpay_order_id,
      payment_id: body.razorpay_payment_id,
    },
    body.razorpay_signature,
    secret,
  );

  if (!isValid) {
    return NextResponse.json({ success: false, reason: "Signature mismatch" });
  }

  if (payment.done) {
    return NextResponse.json({ success: true });
  }

  await Payment.findOneAndUpdate(
    { oid: body.razorpay_order_id },
    { done: true },
  );

  return NextResponse.json({
    success: true,
    user: payment.to_user,
  });
}
