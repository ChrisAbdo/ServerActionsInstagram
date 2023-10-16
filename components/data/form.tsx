"use client";

import { addPost } from "@/app/actions";
import { useState, useCallback, useMemo, ChangeEvent } from "react";
import { PutBlobResult } from "@vercel/blob";
import UploadButton from "./upload-button";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components//ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { HomeIcon, PlusIcon } from "@radix-ui/react-icons";
import { ScrollArea } from "@/components/ui/scroll-area";
import Uploader from "./blob-uploader";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "../ui/button";

import { frameworks } from "@/lib/constants/frameworks";

export default function Form() {
  const { toast } = useToast();

  const [data, setData] = useState<{
    image: string | null;
  }>({
    image: null,
  });
  const [file, setFile] = useState<File | null>(null);
  const [demoFile, setDemoFile] = useState<File | null>(null);

  const [dragActive, setDragActive] = useState(false);

  const onChangePicture = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.currentTarget.files && event.currentTarget.files[0];
      if (file) {
        if (file.size / 1024 / 1024 > 50) {
          alert("File size too big (max 50MB)");
        } else {
          setFile(file);
          const reader = new FileReader();
          reader.onload = (e) => {
            setData((prev) => ({ ...prev, image: e.target?.result as string }));
          };
          reader.readAsDataURL(file);
        }
      }
    },
    [setData]
  );

  const [saving, setSaving] = useState(false);

  const saveDisabled = useMemo(() => {
    return !data.image || saving;
  }, [data.image, saving]);

  const [image, setImage] = useState<string>("");
  const [open, setOpen] = useState(false);

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={() => {
          setOpen(!open);
        }}
      >
        <SheetTrigger asChild>
          <Button variant="secondary">
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Project
          </Button>
        </SheetTrigger>
        <SheetContent className="w-full">
          <ScrollArea className="h-full w-full mt-4 pr-4">
            <DialogHeader>
              <DialogTitle>Upload Project</DialogTitle>
              <Separator />
              <DialogDescription>
                <form
                  action={async (formData: FormData) => {
                    const result = await addPost(formData);
                    if (result?.error) {
                      toast({
                        variant: "destructive",
                        title: "Failed to add post",
                        description: "Something went wrong",
                      });
                    } else {
                      setImage("");
                      setFile(null);
                      setData({ image: null });
                      setOpen(false);
                      toast({
                        title: "Post added",
                        description: "Your post has been added",
                      });
                    }
                  }}
                  className="px-2"
                >
                  <div className="space-y-12">
                    <div className="border-b border/10">
                      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="col-span-full">
                          <label
                            htmlFor="title"
                            className="block text-sm font-medium leading-6 text-foreground"
                          >
                            Project Name
                          </label>
                          <div className="mt-2">
                            <div className="flex rounded-md shadow-sm sm:max-w-md">
                              <Input
                                type="text"
                                name="title"
                                id="title"
                                autoComplete="off"
                                placeholder="title"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-span-full">
                          <label
                            htmlFor="description"
                            className="block text-sm font-medium leading-6 text-foreground"
                          >
                            About Project
                          </label>
                          <div className="mt-2">
                            <Textarea
                              name="description"
                              id="description"
                              rows={3}
                              className="block w-full rounded-md py-1.5 shadow-sm placeholder:text-gray-400  sm:text-sm sm:leading-6"
                              defaultValue={""}
                            />
                          </div>
                          <p className="mt-3 text-sm leading-6 text-muted-foreground">
                            Please explain your project here.
                          </p>
                        </div>

                        <div className="col-span-full">
                          <label
                            htmlFor="stack"
                            className="block text-sm font-medium leading-6 text-foreground"
                          >
                            Framework
                          </label>
                          <div className="mt-2">
                            {/* @ts-ignore */}
                            <Select name="framework" id="framework">
                              <SelectTrigger>
                                <SelectValue
                                  placeholder="Theme"
                                  // @ts-ignore
                                  name="framework"
                                  id="framework"
                                />
                              </SelectTrigger>
                              <SelectContent className="h-48">
                                <ScrollArea className="h-full">
                                  {frameworks.map((framework) => (
                                    <SelectItem
                                      key={framework}
                                      value={framework}
                                    >
                                      {framework}
                                    </SelectItem>
                                  ))}
                                </ScrollArea>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="mt-3" />
                        </div>
                        <div className="col-span-full">
                          <Uploader />
                        </div>
                      </div>
                    </div>

                    <div className="border-b border/10 pb-12">
                      <h2 className="text-base font-semibold leading-7 ">
                        Project Information
                      </h2>

                      <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="col-span-full">
                          <label
                            htmlFor="title"
                            className="block text-sm font-medium leading-6 "
                          >
                            GitHub URL
                          </label>
                          <div className="mt-2">
                            <div className="flex rounded-md shadow-sm sm:max-w-md">
                              <Input
                                type="text"
                                name="githubUrl"
                                id="githubUrl"
                                autoComplete="off"
                                placeholder="githubUrl"
                              />
                            </div>
                          </div>
                        </div>
                        <div className="col-span-full">
                          <label
                            htmlFor="url"
                            className="block text-sm font-medium leading-6 "
                          >
                            Project URL
                          </label>
                          <div className="mt-2">
                            <div className="flex rounded-md shadow-sm sm:max-w-md">
                              <Input
                                type="text"
                                name="url"
                                id="url"
                                autoComplete="off"
                                placeholder="url"
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-end gap-x-6">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setOpen(!open);
                      }}
                    >
                      Cancel
                    </Button>
                    <UploadButton />
                  </div>

                  <div className="flex items-center space-x-2 mt-4"></div>
                </form>
              </DialogDescription>
            </DialogHeader>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
