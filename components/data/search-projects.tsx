"use client";

import React from "react";
import { Input } from "../ui/input";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";

export default function SearchProjects() {
  const router = useRouter();

  const [showButton, setShowButton] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  const handleSearchChange = (e: any) => {
    // Push the selected value to the router, for example: "/themes/light"
    router.push(`/projects/${inputValue}`);
  };
  return (
    <div className="flex w-full max-w-sm items-center space-x-2">
      <Input
        type="text"
        placeholder="Search project name"
        //   on enter key press search
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearchChange(e);
          }
        }}
        onChange={(e) => {
          setInputValue(e.target.value);
          if (e.target.value.length > 0) {
            setShowButton(true);
          }
        }}
      />
      {showButton ? <Button onClick={handleSearchChange}>Search</Button> : null}
    </div>
  );
}
