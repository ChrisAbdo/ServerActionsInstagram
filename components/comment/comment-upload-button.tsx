"use client";

import React from "react";
// @ts-ignore
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export default function CommentUploadButton({ input }: { input: string }) {
  const { pending } = useFormStatus();

  return (
    <Button disabled={pending || !input} type="submit">
      {pending ? "Commenting..." : "Comment"}
    </Button>
  );
}
