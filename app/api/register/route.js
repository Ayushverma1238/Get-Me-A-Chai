import connectDb from "@/db/connectDb";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export async function POST(req) {
  try {
    await connectDb();

    const body = await req.json();
    const { name, email, username, password } = body;

    // ✅ 1. Validate FIRST
    if (!email || !username || !password) {
      return Response.json(
        { success: false, message: "Email, username and password are required" },
        { status: 400 }
      );
    }

    // ✅ 2. Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return Response.json(
        { success: false, message: "User already exists" },
        { status: 409 }
      );
    }

    // ✅ 3. Hash password AFTER validation
    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ 4. Create user
    await User.create({
      name: name || username, // fallback safety
      email,
      username,
      password: hashedPassword,
    });

    return Response.json(
      { success: true, message: "User registered successfully" },
      { status: 201 }
    );
  }catch (error) {
  console.error("❌ REGISTER API ERROR");
  console.error(error);
  console.error(error.stack);

  return Response.json(
    {
      success: false,
      message: error.message,
      name: error.name,
    },
    { status: 500 }
  );
}

}


