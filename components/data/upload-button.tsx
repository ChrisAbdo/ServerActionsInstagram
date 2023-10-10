"use client";

import React from "react";
// @ts-ignore
import { experimental_useFormStatus as useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";

export default function UploadButton() {
  const { pending } = useFormStatus();
  return (
    <Button disabled={pending} type="submit">
      {pending ? "Uploading..." : "Upload"}
    </Button>
  );
}
