"use server";

import { actionClient } from "@/lib/safe-action";
import { SettingsSchema } from "@/types/settings-schema";
import { auth } from "../auth";

export const reset = actionClient
  .schema(SettingsSchema)
  .action(async (values) => {
    const user = await auth();

    if (!user) {
      return { error: "User not found" };
    }
  });
