import Link from "next/link";
import { createClient } from "../../supabase/server";
import { Button } from "./ui/button";
import { User, UserCircle } from "lucide-react";
import UserProfile from "./user-profile";
import { ThemeSwitcher } from "./theme-switcher";

export default async function Navbar() {
  const supabase = createClient();

  const {
    data: { user },
  } = await (await supabase).auth.getUser();

  return (
    <nav className="w-full border-b border-border bg-background py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link href="/" prefetch className="text-xl font-bold">
            <span className="text-primary">MCP</span>Market
            <span className="text-blue-500">.place</span>
          </Link>
          <div className="hidden md:flex gap-6">
            <Link
              href="/servers"
              className="text-foreground hover:text-primary transition-colors"
            >
              Servers
            </Link>
            <Link
              href="/blog"
              className="text-foreground hover:text-primary transition-colors"
            >
              Blog
            </Link>
            <Link
              href="/resources"
              className="text-foreground hover:text-primary transition-colors"
            >
              Resources
            </Link>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <ThemeSwitcher />
          {user ? (
            <>
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
              <UserProfile />
            </>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost">Sign In</Button>
              </Link>
              <Link href="/sign-up">
                <Button className="bg-blue-600 hover:bg-blue-500 text-white">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
