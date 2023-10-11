"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import ProfileDropdown from "../auth/profile-dropdown";
import { ModeToggle } from "./mode-toggle";

export default function MainNav() {
  const pathname = usePathname();

  const { data: session } = useSession();

  return (
    <header className="sticky top-0 bg-background z-50">
      <nav
        className="flex items-center justify-between py-3"
        aria-label="Global"
      >
        <div className="flex items-center gap-x-12">
          <h1 className="text-2xl font-semibold">Ignite</h1>
          <div className="hidden md:flex md:gap-x-12">
            <Link
              href="/"
              className={cn(
                "transition-colors hover:text-foreground/80 text-sm font-medium",
                pathname === "/" ? "text-foreground" : "text-foreground/60"
              )}
            >
              Home
            </Link>

            <Link
              href="/app"
              className={cn(
                "transition-colors hover:text-foreground/80 text-sm font-medium",
                pathname?.startsWith("/app")
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              App
            </Link>
          </div>
        </div>
        <div className="flex lg:hidden">
          <button
            type="button"
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <span className="sr-only">Open main menu</span>
            {/* <Menu className="h-6 w-6" aria-hidden="true" /> */}
          </button>
        </div>
        <div className="flex items-center space-x-1">
          {session && <ProfileDropdown />}

          {!session && (
            <Button variant="default" onClick={() => signIn()}>
              Log in
            </Button>
          )}
          <div className="hidden md:flex">
            <ModeToggle />
          </div>
        </div>
      </nav>
    </header>
  );
}
