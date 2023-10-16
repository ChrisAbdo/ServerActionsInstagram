import React from "react";
import { prisma } from "@/prisma/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { redirect } from "next/navigation";
import DisplayProjects from "@/components/data/display-projects";
import Heading from "@/components/account/heading";
import NotFound from "@/components/account/not-found";

export default async function AccountSlugPage({
  params,
}: {
  params: { slug: string };
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/api/auth/signin");
  }

  const id = params.slug;

  const user = await prisma.user.findFirst({
    where: {
      name: params.slug,
    },
  });

  if (!user) {
    return <NotFound />;
  }

  const posts = await prisma.post.findMany({
    where: {
      authorId: user.id,
    },
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
    <div>
      {posts && (
        <>
          <Heading
            params={{
              // @ts-ignore
              slug: user.name,
            }}
          />

          <ul
            role="list"
            className="mt-8 grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8"
          >
            {posts.map((post: any, index: number) => (
              <DisplayProjects key={post.id} post={post} index={index} />
            ))}
          </ul>
        </>
      )}

      {!posts && <h1>what</h1>}
    </div>
  );
}
