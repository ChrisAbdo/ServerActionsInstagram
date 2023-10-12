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
import { OpenInNewWindowIcon } from "@radix-ui/react-icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import FrameworkSelector from "@/components/data/framework-selector";
import { Input } from "@/components/ui/input";
import SearchProjects from "@/components/data/search-projects";

export default async function Home({ params }: { params: { slug: string } }) {
  const session = await getServerSession(authOptions);

  const framework = params.slug;
  console.log(framework);

  if (!session) {
    redirect("/api/auth/signin");
  }
  const posts = await prisma.post.findMany({
    where: {
      OR: [{ framework: params.slug }, { title: { contains: params.slug } }],
    },
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

      {posts.length === 0 ? (
        <div>
          <span>No results found.</span>&nbsp;
          <span>
            Return to{" "}
            <Link href="/projects" className="underline">
              projects.
            </Link>
          </span>
        </div>
      ) : null}
      <ul
        role="list"
        className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
      >
        {posts.map((post: any) => (
          <li key={post.id} className="relative">
            <div className="flex justify-between items-center mb-2">
              <Badge>{post.framework}</Badge>
              <Link href={`/projects/project/${post.id}`}>
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
              <Image
                src={post.coverImg}
                width={400}
                height={400}
                alt="wtf"
                placeholder="blur"
                blurDataURL={post.coverImg}
                priority
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
