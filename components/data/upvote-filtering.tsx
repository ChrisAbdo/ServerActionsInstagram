"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { usePathname } from "next/navigation";
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ThickArrowDownIcon,
  ThickArrowUpIcon,
} from "@radix-ui/react-icons";

export default function UpvoteFiltering() {
  const pathname = usePathname();
  const router = useRouter();

  function toggleAscendingFiltering() {
    router.push("/projects/ascending");
  }

  function toggleDescendingFiltering() {
    router.push("/projects/descending");
  }

  return (
    <>
      {pathname === "/projects/ascending" ? (
        <Button
          size="icon"
          variant="secondary"
          onClick={toggleAscendingFiltering}
          className="px-2"
        >
          <ThickArrowUpIcon className="w-5 h-5" />
        </Button>
      ) : (
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleAscendingFiltering}
          className="px-2"
        >
          <ThickArrowUpIcon className="w-5 h-5" />
        </Button>
      )}

      {pathname === "/projects/descending" ? (
        <Button
          size="icon"
          variant="secondary"
          onClick={toggleDescendingFiltering}
          className="px-2"
        >
          <ThickArrowDownIcon className="w-5 h-5" />
        </Button>
      ) : (
        <Button
          size="icon"
          variant="ghost"
          onClick={toggleDescendingFiltering}
          className="px-2"
        >
          <ThickArrowDownIcon className="w-5 h-5" />
        </Button>
      )}
    </>
  );
}
