import CommentForm from "@/components/comment/comment-form";
import { prisma } from "@/prisma/db";
import { HomeIcon, PersonIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const pages = [
  { name: "Projects", href: "#", current: false },
  { name: "Project Nero", href: "#", current: true },
];

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
      {/* My Post: {params.slug}
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
      </ul> */}

      <nav className="flex mt-4" aria-label="Breadcrumb">
        <ol role="list" className="flex items-center space-x-4">
          <li>
            <div>
              <a href="#" className="text-gray-400 hover:text-gray-500">
                <HomeIcon
                  className="h-5 w-5 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="sr-only">Home</span>
              </a>
            </div>
          </li>
          {pages.map((page) => (
            <li key={page.name}>
              <div className="flex items-center">
                <svg
                  className="h-5 w-5 flex-shrink-0 text-gray-300"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                >
                  <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
                </svg>
                <a
                  href={page.href}
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                  aria-current={page.current ? "page" : undefined}
                >
                  {page.name}
                </a>
              </div>
            </li>
          ))}
        </ol>
      </nav>

      <div className="relative isolate overflow-hidden bg-background py-12 lg:overflow-visible">
        {posts.map((post: any) => (
          <div
            key={post.id}
            className="mx-auto grid grid-cols-1 gap-x-8 gap-y-16 lg:mx-0 lg:max-w-none lg:grid-cols-2 lg:items-start lg:gap-y-10"
          >
            <div className="lg:col-span-2 lg:col-start-1 lg:row-start-1 lg:mx-auto lg:grid lg:w-full lg:grid-cols-2 lg:gap-x-8">
              <div>
                <div className="lg:max-w-lg">
                  <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                    {post.title}
                  </h1>
                  <p className="mt-6 text-xl leading-8 text-muted-foreground">
                    {post.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="-ml-12 -mt-12 p-12 lg:sticky lg:top-4 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:overflow-hidden">
              <img
                className="w-[48rem] max-w-none rounded-xl ring-1 ring-gray-400/10 sm:w-[57rem]"
                src={post.coverImg}
                alt=""
              />
            </div>
            <div className="lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:mx-auto lg:grid lg:w-full lg:grid-cols-2 lg:gap-x-8">
              <div className="lg:pr-4">
                <div className="text-base leading-7 text-muted-foreground">
                  <div className="space-y-8">
                    <div className="flex items-center border-b">
                      <div className="space-y-1">
                        <p className="font-medium text-muted-foreground">
                          Framework
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        {post.framework}
                      </div>
                    </div>
                    <div className="flex items-center border-b">
                      <div className="space-y-1">
                        <p className="font-medium text-muted-foreground">URL</p>
                      </div>
                      <div className="ml-auto font-medium">
                        <Link
                          href={post.url}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {post.url ? post.url : "No URL Found"}
                        </Link>
                      </div>
                    </div>
                    <div className="flex items-center border-b">
                      <div className="space-y-1">
                        <p className="font-medium text-muted-foreground">
                          GitHub URL
                        </p>
                      </div>
                      <div className="ml-auto font-medium">
                        <Link
                          href={post.githubUrl}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {post.githubUrl ? post.githubUrl : "No URL Found"}
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-x-4 mt-8">
                    <Link
                      href={post.url}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Button>View Project</Button>
                    </Link>
                    <Link
                      href={post.githubUrl}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      <Button variant="outline">View Repository</Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <div className="mt-12" />

        <h1 className="text-2xl font-semibold mb-2">Leave a comment!</h1>

        <CommentForm postId={postId} />
        <div className="space-y-8">
          <div className="mt-2" />
          {comments &&
            comments.map((comment: any) => (
              <>
                <div key={comment.id} className="flex">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={comment.author.image} alt="Avatar" />
                    <AvatarFallback>
                      <PersonIcon />
                    </AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {comment.author.name}
                    </p>
                    <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                      {comment.body}
                    </pre>
                  </div>
                </div>
                <Separator />
              </>
            ))}
        </div>
      </div>
    </div>
  );
}
