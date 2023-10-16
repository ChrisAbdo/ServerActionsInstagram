import { HomeIcon } from "@radix-ui/react-icons";
import ShareAccountButton from "./share-account";

export default function Heading({ params }: { params: { slug: string } }) {
  return (
    <div className="lg:flex lg:items-center lg:justify-between mt-4">
      <div className="min-w-0 flex-1">
        <h2 className="text-2xl font-bold leading-7 sm:truncate sm:text-3xl sm:tracking-tight">
          {params.slug}&apos;s Projects
        </h2>
      </div>
      <div className="mt-5 flex lg:ml-4 lg:mt-0">
        <ShareAccountButton params={params} />
      </div>
    </div>
  );
}
