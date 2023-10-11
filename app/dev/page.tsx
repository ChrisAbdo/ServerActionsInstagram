import React from "react";
import { prisma } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

import Form from "@/components/data/Form.1";
import Link from "next/link";

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
      <br />
      {posts.map((post: any) => (
        <Link key={post.id} href={`/dev/${post.id}`}>
          {post.id}
          <br />
          {post.title} | {post.description} | {post.framework} |{" "}
          {post.githubUrl} | {post.url} |{post.coverImg} | {post.demoUrl} |
          {/* stack is an array of strings */}
        </Link>
      ))}
    </div>
  );
}
