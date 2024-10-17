"use server";

import { RegisterSchema } from "@/types/register-schema";
import { createSafeActionClient } from "next-safe-action";
import bcrypt from "bcrypt";
import { db } from "..";
import { eq } from "drizzle-orm";
import { users } from "../schema";
import { generateEmailVerificationToken } from "./tokens";

const action = createSafeActionClient();

export const emailRegister = action
  .schema(RegisterSchema)
  .action(async ({ parsedInput }) => {
    const { email, name, password } = parsedInput;
    //hashing passwords
    const hashedPassword = await bcrypt.hash(password, 10);

    //check exisitng user
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (existingUser) {
      if (!existingUser.emailVerified) {
        const verificationToken = await generateEmailVerificationToken(email);
        //await setVerificationEmail();

        return { success: "Email Confirmation resent" };
      }
      return { error: "Email already in use" };
    }

    //logic for when user not registered

    await db.insert(users).values({
      email,
      name,
      password: hashedPassword,
    });

    const verificationToken = await generateEmailVerificationToken(email);
    //await setVerificationEmail();

    return { success: "Register successful" };
  });
