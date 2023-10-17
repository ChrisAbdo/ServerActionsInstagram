import React from "react";
import { prisma } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import DisplayProjects from "@/components/data/display-projects";
import TopBar from "@/components/projects/top-bar";

export default async function Home({ params }: { params: { slug: string } }) {
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
      _count: {
        select: { PostUpvote: true },
      },
    },
  });

  return (
    <div className="mt-4">
      <TopBar />
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
