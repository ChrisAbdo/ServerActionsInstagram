import React, { useEffect, useState } from "react";
import { upvotePost, checkIfUserUpvoted } from "@/app/actions"; // assuming you have a function to check the upvote status
import { useToast } from "@/components/ui/use-toast";
import { ArrowUpIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";

export default function UpvotePost({ post }: { post: any }) {
  const { toast } = useToast();

  // State to track if the user has upvoted the post
  const [hasUpvoted, setHasUpvoted] = useState(false);

  useEffect(() => {
    // Function to check if the current user has upvoted the post
    const fetchUpvoteStatus = async () => {
      try {
        const upvoted = await checkIfUserUpvoted(post.id); // function that checks if the user has upvoted this post
        setHasUpvoted(upvoted);
      } catch (error) {
        console.error("Failed to check upvote status:", error);
      }
    };

    fetchUpvoteStatus();
  }, [post.id]);

  const handleUpvote = async () => {
    try {
      const result = await upvotePost(post.id); // assuming post.id is valid

      if (result.message) {
        setHasUpvoted(result.message === "Successfully upvoted the post."); // Adjust based on your API's success message
        toast({
          title:
            result.message === "Successfully upvoted the post."
              ? "Post upvoted"
              : "Upvote removed",
          description:
            result.message === "Successfully upvoted the post."
              ? "Your upvote has been registered"
              : "You have removed your upvote",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error occurred",
        description: "Something went wrong while upvoting the post",
      });
    }
  };

  //   if (hasUpvoted) {
  //     return (
  //   <Button size="sm" variant="secondary" onClick={handleUpvote}>
  //     {post._count.PostUpvote} <ArrowUpIcon className="h-4 w-4" />
  //   </Button>
  //     );
  //   }

  return (
    <>
      {hasUpvoted ? (
        <Button size="sm" variant="secondary" onClick={handleUpvote}>
          {post._count.PostUpvote} <ArrowUpIcon className="h-4 w-4" />
        </Button>
      ) : (
        <Button size="sm" variant="ghost" onClick={handleUpvote}>
          {post._count.PostUpvote}
          <ArrowUpIcon className="h-4 w-4" />
        </Button>
      )}
    </>
  );
}
