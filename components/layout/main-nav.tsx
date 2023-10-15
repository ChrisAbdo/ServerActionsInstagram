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
import { Badge } from "../ui/badge";

export default function MainNav() {
  const pathname = usePathname();

  const { data: session } = useSession();

  return (
    <header
      // className="sticky top-0 supports-backdrop-blur:bg-background/80 backdrop-blur border-b z-50"
      className={`sticky top-0 border-b z-50 ${
        pathname === "/projects"
          ? "bg-background"
          : "supports-backdrop-blur:bg-background/80 backdrop-blur"
      }`}
    >
      <nav
        className="flex items-center justify-between py-3 px-8"
        aria-label="Global"
      >
        <div className="flex items-center gap-x-12">
          <Link href="/" className="flex items-center space-x-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              className="lucide lucide-flame"
            >
              <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z" />
            </svg>
            <span className="font-bold inline-block uppercase">Ignite</span>
            <Badge className="rounded-sm">Beta</Badge>
          </Link>
          <div className="hidden md:flex md:gap-x-12">
            <Link
              href="/projects"
              className={cn(
                "transition-colors hover:text-foreground/80 text-sm font-medium",
                pathname === "/projects"
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              Projects
            </Link>

            <Link
              href="/about"
              className={cn(
                "transition-colors hover:text-foreground/80 text-sm font-medium",
                pathname?.startsWith("/about")
                  ? "text-foreground"
                  : "text-foreground/60"
              )}
            >
              About
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
