import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { addComment } from "@/app/actions";

export default function CommentForm({ postId }: { postId: number }) {
  return (
    <form action={addComment}>
      <div className="flex w-full items-center gap-2">
        <Input
          name="postId"
          id="postId"
          type="text"
          placeholder="Name"
          value={postId}
          readOnly={true}
          className="hidden"
        />
        <Input name="body" id="body" type="text" placeholder="Email" />

        <Button type="submit">Subscribe</Button>
      </div>
    </form>
  );
}
