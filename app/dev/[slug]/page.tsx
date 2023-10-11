import CommentForm from "@/components/comment/comment-form";
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

  const comments = await prisma.comment.findMany({
    where: {
      postId: postId,
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
      <CommentForm postId={postId} />
      <ul>
        {comments &&
          comments.map((comment: any) => (
            <li key={comment.id}>
              {comment.body}
              {comment.author ? comment.author.name : "User"}
            </li>
          ))}
      </ul>
    </div>
  );
}
