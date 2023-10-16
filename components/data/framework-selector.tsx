"use client";

import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { frameworks } from "@/lib/constants/frameworks";
import { ScrollArea } from "../ui/scroll-area";

export default function FrameworkSelector() {
  const router = useRouter();

  const handleSelectChange = (selectedValue: string) => {
    router.push(`/projects/${selectedValue}`);
  };
  return (
    <Select onValueChange={handleSelectChange}>
      <SelectTrigger className="w-[220px]">
        <SelectValue placeholder="Framework" />
      </SelectTrigger>
      <SelectContent className="h-48">
        <ScrollArea className="h-full">
          <SelectItem value=" ">All</SelectItem>
          {frameworks.map((framework) => (
            <SelectItem key={framework} value={framework}>
              {framework}
            </SelectItem>
          ))}
        </ScrollArea>
      </SelectContent>
    </Select>
  );
}
