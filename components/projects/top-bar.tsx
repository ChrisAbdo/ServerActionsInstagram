import { HomeIcon } from "@radix-ui/react-icons";
import Form from "../data/form";
import FrameworkSelector from "../data/framework-selector";
import SearchProjects from "../data/search-projects";

export default function TopBar() {
  return (
    <div className="border-b pb-5 sm:flex sm:items-center sm:justify-between">
      <div>
        <div className="flex gap-x-2">
          <FrameworkSelector />
          <SearchProjects />
        </div>
      </div>
      <div className="mt-2 sm:mt-0">
        <Form />
      </div>
    </div>
  );
}
