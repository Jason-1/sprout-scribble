import { auth } from "@/server/auth";
import { UserButton } from "./user-button";
import Link from "next/link";
import Logo from "@/components/navigation/logo";
import { LogIn } from "lucide-react";
import { Button } from "../ui/button";
import CartDrawer from "../cart/cart-drawer";

export default async function Nav() {
  const session = await auth();

  return (
    <header className="sticky top-0 left-0 p-8 dark:bg-background bg-background z-50">
      <nav>
        <ul className="flex justify-between items-center md:gap-8 gap-4">
          <li className="flex flex-1">
            <Link href="/" aria-label="sprout and scribble logo">
              <Logo />
            </Link>
          </li>
          <li className="relative flex items-center hover:bg-muted">
            <CartDrawer />
          </li>
          {!session ? (
            <li className="flex items-center justify-center">
              <Button asChild>
                <Link
                  className="flex gap-2"
                  aria-label="sign-in"
                  href={"/auth/login"}
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </Link>
              </Button>
            </li>
          ) : (
            <li className="flex items-center justify-center">
              <UserButton expires={session?.expires} user={session?.user} />
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
