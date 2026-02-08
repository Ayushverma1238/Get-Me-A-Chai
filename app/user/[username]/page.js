import PaymentPage from "@/components/PaymentPage";
import { notFound } from "next/navigation";
import User from "@/models/User";
import connectDb from "@/db/connectDb";

export default async function Username({ params }) {
  const { username } = await params; // ✅ NO await

  await connectDb();

  const user = await User.findOne({ username });

  if (!user) {
    notFound(); // ✅ call directly
  }

  return <PaymentPage username={username} />;
}

export async function generateMetadata({ params }) {
  const { username } =await params; // ✅ NO await

  return {
    title: `Support ${username} - Get Me A Chai`,
    description: "Page to make payment and view payment",
  };
}
