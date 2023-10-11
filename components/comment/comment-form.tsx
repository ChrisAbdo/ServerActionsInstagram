"use client";

import React from "react";
import { Input } from "@/components/ui/input";
import { addComment } from "@/app/actions";
import { Textarea } from "@/components/ui/textarea";
import CommentUploadButton from "./comment-upload-button";
import { useToast } from "../ui/use-toast";

export default function CommentForm({ postId }: { postId: number }) {
  const [input, setInput] = React.useState("");

  const { toast } = useToast();
  return (
    <form
      //   action={addComment}
      action={async (formData: FormData) => {
        const result = await addComment(formData);
        if (result?.error) {
          toast({
            variant: "destructive",
            title: "Failed to add post",
            description: "Something went wrong",
          });
        } else {
          setInput("");
          toast({
            title: "Comment added",
            description: "Your comment has been added",
          });
        }
      }}
    >
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
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your comment here..."
          />
          <CommentUploadButton input={input} />
        </div>
      </div>
    </form>
  );
}
