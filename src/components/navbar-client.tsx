"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import { UserCircle } from "lucide-react";
import { ThemeSwitcher } from "./theme-switcher";
import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";

export default function NavbarClient() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setUser(data.user);
    };

    checkUser();
  }, []);

  return (
    <nav className="w-full border-b border-border bg-background py-4">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link href="/" prefetch className="text-xl font-bold">
          <span className="text-primary">MCP</span>Market
          <span className="text-blue-500">.place</span>
        </Link>
        <div className="flex gap-4 items-center">
          <ThemeSwitcher />
          {user ? (
            <>
              <Link href="/dashboard">
                <Button>Dashboard</Button>
              </Link>
              <div className="relative">
                <Button variant="ghost" className="rounded-full p-0 w-10 h-10">
                  <UserCircle className="h-6 w-6" />
                </Button>
              </div>
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
