"use client";

import React from "react";
import FrameworkBadge from "./framework-badge";
import Link from "next/link";
import { Button } from "../ui/button";
import { EyeOpenIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, useAnimation } from "framer-motion";
import UpvotePost from "./upvote-post";
import { Separator } from "../ui/separator";

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};

export default function DisplayProjects({
  post,
  key,
  index,
}: {
  post: any;
  key: any;
  index: any;
}) {
  const controls = useAnimation();

  const upvoteCount = post.upvotes;

  React.useEffect(() => {
    controls.start("visible");
  }, [controls]);

  return (
    <motion.div
      key={post.id}
      className="relative border rounded-md p-2"
      initial="hidden"
      animate={controls}
      variants={fadeUp}
      transition={{ duration: 0.5, delay: index * 0.05 }}
    >
      <div className="flex justify-between items-center mb-2">
        <FrameworkBadge framework={post.framework} />
        <Link href={`/projects/project/${post.id}`}>
          <Button variant="outline" size="sm">
            <EyeOpenIcon className="w-4 h-4 mr-2" />
            View
          </Button>
        </Link>
      </div>
      <div
        className="relative w-full hover:opacity-70 transition-all duration-300"
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
                <h4 className="text-sm font-semibold">@{post.author.name}</h4>
                <p className="text-sm">
                  View {post.author.name}&apos;s profile to see their projects.
                </p>
                <div className="flex items-center pt-2">
                  <Link href={`/account/${post.author.name}`}>
                    <Button variant="outline" size="sm">
                      View Projects
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>

        <p className="w-max max-w-[75%] truncate rounded-lg px-2 py-1 text-sm bg-muted">
          {post.title}
        </p>
      </div>

      <div className="flex items-center mt-2">
        <Separator />
      </div>

      <div className="flex justify-between items-center mt-2">
        <Link
          href={`/account/${post.author.name}`}
          className="text-sm text-muted-foreground hover:underline"
        >
          {post.author.name}
        </Link>
        <UpvotePost post={post} />
      </div>
    </motion.div>
  );
}
