import React from "react";
import { prisma } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import { AspectRatio } from "@/components/ui/aspect-ratio";

import Form from "@/components/data/form";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { CalendarIcon, OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }
  const posts = await prisma.post.findMany({
    where: {
      authorId: session?.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      author: true,
    },
  });

  return (
    <div>
      <Form />

      <ul
        role="list"
        className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
      >
        {posts.map((post: any) => (
          <li key={post.id} className="relative">
            <div className="flex justify-between items-center mb-2">
              <Badge>{post.framework}</Badge>
              <Link href={`/dev/${post.id}`}>
                <Button variant="outline" size="sm">
                  <OpenInNewWindowIcon className="w-4 h-4 mr-2" />
                  View
                </Button>
              </Link>
            </div>
            <div
              className="border relative w-full hover:opacity-70 transition-all duration-300"
              style={{ paddingBottom: "66.66%" }}
            >
              {/* eslint-disable @next/next/no-img-element */}
              <img
                src={post.coverImg}
                alt="wtf"
                className="absolute top-0 left-0 w-full h-full object-cover pointer-events-none"
              />
            </div>

            <div className="flex items-center mt-2 gap-x-2">
              <HoverCard openDelay={0}>
                <HoverCardTrigger>
                  <img
                    className="h-6 w-6 rounded-full object-cover cursor-pointer"
                    src={post.author.image}
                    alt=""
                  />
                </HoverCardTrigger>
                <HoverCardContent className="w-80">
                  <div className="flex justify-between space-x-4">
                    <Avatar>
                      <AvatarImage src={post.author.image} alt="" />
                      <AvatarFallback>
                        <span>{post.author.name}</span>
                      </AvatarFallback>
                    </Avatar>
                    <div className="space-y-1">
                      <h4 className="text-sm font-semibold">
                        @{post.author.name}
                      </h4>
                      <p className="text-sm">
                        View {post.author.name}&apos;s profile to see their
                        projects.
                      </p>
                      <div className="flex items-center pt-2">
                        <Button variant="outline" size="sm">
                          View Projects
                        </Button>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>

              <p className="w-max max-w-[75%] truncate rounded-lg px-2 py-1 text-sm bg-muted">
                {post.title}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
