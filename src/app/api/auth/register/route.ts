import { NextResponse } from "next/server";
import { z } from "zod";
import { authService } from "@/lib/services/authService";

const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().optional(),
  address_line: z.string().optional(),
  city: z.string().optional(),
  zip_code: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    const newUser = await authService.register(validatedData);

    return NextResponse.json(
      { message: "User created successfully", user: newUser },
      { status: 201 }
    );
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: "Validation error", errors: error.errors }, { status: 400 });
    }
    
    if (error.message === "Email Already Exists") {
      return NextResponse.json({ message: "Email already exists" }, { status: 409 });
    }

    console.error("Registration error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
