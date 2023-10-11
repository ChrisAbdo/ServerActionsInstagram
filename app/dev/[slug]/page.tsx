import { prisma } from "@/prisma/db";

export default async function Home({ params }: { params: { slug: string } }) {
  const postId = parseInt(params.slug, 10); // Convert the slug to an integer
  const posts = await prisma.post.findMany({
    where: {
      id: postId,
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
      My Post: {params.slug}
      {posts.map((post: any) => (
        <li key={post.id}>
          {post.title} | {post.description} | {post.githubUrl} | {post.url} |
          {post.coverImg} | {post.demoUrl}
          {post.stack}
        </li>
      ))}
    </div>
  );
}
