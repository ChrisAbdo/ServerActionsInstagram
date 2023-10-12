import React from "react";
import { prisma } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

import Form from "@/components/data/form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { EyeOpenIcon, OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import FrameworkSelector from "@/components/data/framework-selector";
import { Input } from "@/components/ui/input";
import SearchProjects from "@/components/data/search-projects";
import FrameworkBadge from "@/components/data/framework-badge";
import DisplayProjects from "@/components/data/display-projects";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }
  const posts = await prisma.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
    },
  });

  return (
    <div className="mt-4">
      <div className="flex justify-between items-center border rounded-md p-4">
        <div className="flex items-center gap-x-2">
          <FrameworkSelector />
          <SearchProjects />
        </div>
        <div>
          <Form />
        </div>
      </div>
      <ul
        role="list"
        className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
      >
        {posts.map((post: any, index: number) => (
          <DisplayProjects key={post.id} post={post} index={index} />
        ))}
      </ul>
    </div>
  );
}
