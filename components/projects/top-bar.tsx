import { HomeIcon } from "@radix-ui/react-icons";
import Form from "../data/form";
import FrameworkSelector from "../data/framework-selector";
import SearchProjects from "../data/search-projects";
import UpvoteFiltering from "../data/upvote-filtering";

export default function TopBar() {
  return (
    <div className="border-b pb-5 sm:flex sm:items-center sm:justify-between">
      <div className="flex gap-x-2">
        <UpvoteFiltering />
        <FrameworkSelector />
        <SearchProjects />
      </div>
      <div className="mt-2 sm:mt-0">
        <Form />
      </div>
    </div>
  );
}
