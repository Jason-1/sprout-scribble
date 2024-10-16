"use server";

import { RegisterSchema } from "@/types/register-schema";
import { createSafeActionClient } from "next-safe-action";
import bcrypt from "bcrypt";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";

const action = createSafeActionClient();

export const emailRegister = action
  .schema(RegisterSchema)
  .action(async ({ parsedInput }) => {
    const { email, name, password } = parsedInput;

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(hashedPassword);

    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    //check if email is in DB, if so sat its in use, if not register user and send verification email

    if (existingUser) {
      // if(!existingUser.emailVerified) {
      //     const verificationToken =
      // }
      return { error: "Email already in use" };
    }
    return { success: "Register successful" };
  });
