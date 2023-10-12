"use client";

import React from "react";
import { Badge } from "../ui/badge";
import { useRouter } from "next/navigation";

export default function FrameworkBadge({ framework }: { framework: string }) {
  const router = useRouter();

  const handleSearchChange = (e: any) => {
    router.push(`/projects/${framework}`);
  };
  return <Badge onClick={handleSearchChange}>{framework}</Badge>;
}
