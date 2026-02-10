import { NextResponse } from "next/server";
import connectDb from "@/db/connectDb";
import Payment from "@/models/Payment";
import User from "@/models/User";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req) {
  try {
    await connectDb();

    // 🔽 dynamic import (runtime-only, build-safe)
    const { validatePaymentVerification } = await import(
      "razorpay/dist/utils/razorpay-utils"
    );

    const formData = await req.formData();
    const body = Object.fromEntries(formData);

    const payment = await Payment.findOne({
      oid: body.razorpay_order_id,
    });

    if (!payment) {
      return NextResponse.json(
        { success: false, reason: "Order not found" },
        { status: 404 }
      );
    }

    const user = await User.findOne({ username: payment.to_user });

    if (!user || !user.razorpaysecret) {
      return NextResponse.json(
        { success: false, reason: "User secret not found" },
        { status: 400 }
      );
    }

    const isValid = validatePaymentVerification(
      {
        order_id: body.razorpay_order_id,
        payment_id: body.razorpay_payment_id,
      },
      body.razorpay_signature,
      user.razorpaysecret
    );

    if (!isValid) {
      return NextResponse.json(
        { success: false, reason: "Signature mismatch" },
        { status: 400 }
      );
    }

    if (!payment.done) {
      await Payment.findOneAndUpdate(
        { oid: body.razorpay_order_id },
        { done: true }
      );
    }

    return NextResponse.json({
      success: true,
      user: payment.to_user,
    });
  } catch (error) {
    console.error("❌ RAZORPAY VERIFY ERROR:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
