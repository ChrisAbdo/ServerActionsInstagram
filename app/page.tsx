"use client";

import React from "react";
import { addPost } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function Home() {
  return (
    <>
      <form action={addPost}>
        <Input
          type="text"
          name="content"
          id="content"
          autoComplete="off"
          placeholder="content"
        />
        <Input
          type="text"
          name="imageUrl"
          id="imageUrl"
          autoComplete="off"
          placeholder="imageUrl"
        />

        <div className="flex items-center space-x-2">
          <Button type="submit">Submit</Button>
        </div>
      </form>

      {/* POSTS */}
      {/* {posts.length > 0 &&
        posts.map((post) => (
          <div key={post.id}>
            <div className="flex justify-between">
              <div className="flex items-center space-x-2">
                <div className="flex flex-col">
                  <h1>{post.author?.name}</h1>
                  <time
                    dateTime={post.createdAt.toISOString()}
                    className="text-muted-foreground"
                  >
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "full",
                    }).format(post.createdAt)}
                  </time>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-6">
              <div className="mt-4">
                <span className="font-semibold">{post.author?.name}</span>
                &nbsp;{post.content} | {post.category}
              </div>
            </div>
          </div>
        ))} */}
    </>
  );
}
