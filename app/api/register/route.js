import connectDb from "@/db/connectDb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();
    console.log("REGISTER BODY 👉", body); // 👈 add this once

    const { name, email, username, password } = body;

    const hashedPassword = await bcrypt.hash(password, 10);

    

    if (!password) {
      return Response.json(
        { success: false, message: "Password missing" },
        { status: 400 },
      );
    }

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return Response.json(
        { success: false, message: "User already exists" },
        { status: 409 },
      );
    }

    await User.create({
      name,
      email,
      username,
      password: hashedPassword,
    });

    return Response.json({ success: true }, { status: 201 });
  } catch (error) {
    return Response.json(
      { success: false, message: error.message },
      { status: 500 },
    );
  }
}
