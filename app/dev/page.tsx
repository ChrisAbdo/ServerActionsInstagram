import React from "react";
import { prisma } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";

import Form from "@/components/data/form";

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
      {posts.map((post) => (
        <li key={post.id}>
          {post.content}
          <img src={post.imageUrl} alt="post image" />
        </li>
      ))}
    </div>
  );
}
