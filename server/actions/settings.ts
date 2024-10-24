"use server";

import { actionClient } from "@/lib/safe-action";
import { SettingsSchema } from "@/types/settings-schema";
import { auth } from "../auth";
import { eq } from "drizzle-orm";
import { db } from "..";
import { users } from "../schema";
import bcrypt from "bcrypt";
import { hash } from "crypto";
import { revalidatePath } from "next/cache";

export const settings = actionClient
  .schema(SettingsSchema)
  .action(
    async ({
      parsedInput: {
        email,
        password,
        newPassword,
        isTwoFactorEnabled,
        image,
        name,
      },
    }) => {
      const user = await auth();

      if (!user) {
        return { error: "User not found" };
      }

      const dbUser = await db.query.users.findFirst({
        where: eq(users.id, user.user.id),
      });
      if (!dbUser) {
        return { error: "User not found" };
      }

      if (user.user.isOAuth) {
        email = undefined;
        password = undefined;
        newPassword = undefined;
        isTwoFactorEnabled = undefined;
      }
      if (password && newPassword && dbUser.password) {
        const passwordMatch = await bcrypt.compare(password, dbUser.password);
        if (!passwordMatch) {
          return { error: "Password does not match" };
        }

        const samePassword = await bcrypt.compare(newPassword, dbUser.password);
        if (samePassword) {
          return { error: "New password is the same as the old password" };
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);
        password = hashedPassword;
        newPassword = undefined;
      }
      const updatedUser = await db
        .update(users)
        .set({
          twoFactorEnabled: isTwoFactorEnabled,
          name: name,
          email: email,
          password: password,
          image: image,
        })
        .where(eq(users.id, dbUser.id));
      revalidatePath("/dashboard/settings");
      return { success: "Settings Updated" };
    }
  );
