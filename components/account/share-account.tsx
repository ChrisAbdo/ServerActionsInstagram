import { CopyIcon, Share2Icon } from "@radix-ui/react-icons";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function ShareAccountButton({
  params,
}: {
  params: { slug: string };
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="secondary">
          <Share2Icon className="w-4 h-4 mr-2" />
          Share
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[520px]">
        <div className="flex flex-col space-y-2 text-center sm:text-left">
          <h3 className="text-lg font-semibold">Share project</h3>
          <p className="text-sm text-muted-foreground">
            Share this project to the world by copying the link below.
          </p>
        </div>
        <div className="flex items-center space-x-2 pt-4">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input
              id="link"
              defaultValue={`localhost:3000/account/${params.slug}`}
              readOnly
              className="h-9"
            />
          </div>
          <Button type="submit" size="icon" className="px-3">
            <span className="sr-only">Copy</span>
            <CopyIcon className="h-4 w-4" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
