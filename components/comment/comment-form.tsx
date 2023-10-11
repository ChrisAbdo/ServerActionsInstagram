import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "../ui/button";
import { addComment } from "@/app/actions";
import { Textarea } from "../ui/textarea";
import CommentUploadButton from "./comment-upload-button";

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

        <div className="grid w-full gap-2">
          <Textarea
            name="body"
            id="body"
            placeholder="Type your comment here..."
          />
          <CommentUploadButton />
        </div>
      </div>
    </form>
  );
}
