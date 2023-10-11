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
import { HomeIcon } from "@radix-ui/react-icons";
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
  const [demoUrl, setDemoUrl] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [demoVideoFile, setDemoVideoFile] = useState<File | null>(null);

  return (
    <>
      <Sheet
        open={open}
        onOpenChange={() => {
          setOpen(!open);
        }}
      >
        <SheetTrigger>Sheet</SheetTrigger>
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
                >
                  <div className="space-y-12">
                    <div className="border-b border-gray-900/10">
                      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                          <label
                            htmlFor="title"
                            className="block text-sm font-medium leading-6 text-gray-900"
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
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            About Project
                          </label>
                          <div className="mt-2">
                            <Textarea
                              name="description"
                              id="description"
                              rows={3}
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              defaultValue={""}
                            />
                          </div>
                          <p className="mt-3 text-sm leading-6 text-gray-600">
                            Please explain your project here.
                          </p>
                        </div>

                        <div className="col-span-full">
                          <label
                            htmlFor="stack"
                            className="block text-sm font-medium leading-6 text-gray-900"
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
                      </div>
                    </div>

                    <div className="col-span-full">
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Cover Image
                      </label>
                      <div>
                        <div className="flex rounded-md shadow-sm sm:max-w-md">
                          {image ? (
                            <Input
                              readOnly={image ? true : false}
                              type="text"
                              name="coverImg"
                              value={image}
                            />
                          ) : (
                            <Input
                              className="w-full"
                              onChange={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                setSaving(true);
                                fetch("/api/create-blob", {
                                  method: "POST",
                                  headers: {
                                    "content-type":
                                      file?.type || "application/octet-stream",
                                  },
                                  body: file,
                                }).then(async (res) => {
                                  if (res.status === 200) {
                                    const { url } =
                                      (await res.json()) as PutBlobResult;
                                    setImage(url);
                                    toast({
                                      title: "Image uploaded",
                                      description:
                                        "Your image has been uploaded and given a URL",
                                    });
                                  } else {
                                    const error = await res.text();
                                    alert(error);
                                  }
                                  setSaving(false);
                                });
                              }}
                              name="coverImg"
                              id="coverImg"
                              type="file"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="col-span-full mb-4">
                      <label
                        htmlFor="demoUrl"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Demo Video
                      </label>
                      <div>
                        <div className="flex rounded-md shadow-sm sm:max-w-md">
                          {demoUrl ? (
                            <Input
                              readOnly={demoUrl ? true : false}
                              type="text"
                              name="demoUrl"
                              id="demoUrl"
                              value={demoUrl}
                            />
                          ) : (
                            <Input
                              className="w-full"
                              onChange={async (e) => {
                                e.preventDefault();
                                e.stopPropagation();

                                setSaving(true);
                                fetch("/api/create-blob", {
                                  method: "POST",
                                  headers: {
                                    "content-type":
                                      demoFile?.type ||
                                      "application/octet-stream",
                                  },
                                  body: demoFile,
                                }).then(async (res) => {
                                  if (res.status === 200) {
                                    const { url } =
                                      (await res.json()) as PutBlobResult;
                                    setDemoUrl(url);
                                    toast({
                                      title: "DemoURL uploaded",
                                      description:
                                        "Your video has been uploaded and given a URL",
                                    });
                                  } else {
                                    const error = await res.text();
                                    alert(error);
                                  }
                                  setSaving(false);
                                });
                              }}
                              name="demoUrl"
                              id="demoUrl"
                              type="file"
                            />
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="border-b border-gray-900/10 pb-12">
                      <h2 className="text-base font-semibold leading-7 text-gray-900">
                        Personal Information
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        Use a permanent address where you can receive mail.
                      </p>

                      <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                          <label
                            htmlFor="first-name"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            First name
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="first-name"
                              id="first-name"
                              autoComplete="given-name"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="last-name"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Last name
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="last-name"
                              id="last-name"
                              autoComplete="family-name"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-4">
                          <label
                            htmlFor="email"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Email address
                          </label>
                          <div className="mt-2">
                            <input
                              id="email"
                              name="email"
                              type="email"
                              autoComplete="email"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-3">
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Country
                          </label>
                          <div className="mt-2">
                            <select
                              id="country"
                              name="country"
                              autoComplete="country-name"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                            >
                              <option>United States</option>
                              <option>Canada</option>
                              <option>Mexico</option>
                            </select>
                          </div>
                        </div>

                        <div className="col-span-full">
                          <label
                            htmlFor="street-address"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            Street address
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="street-address"
                              id="street-address"
                              autoComplete="street-address"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2 sm:col-start-1">
                          <label
                            htmlFor="city"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            City
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="city"
                              id="city"
                              autoComplete="address-level2"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label
                            htmlFor="region"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            State / Province
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="region"
                              id="region"
                              autoComplete="address-level1"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>

                        <div className="sm:col-span-2">
                          <label
                            htmlFor="postal-code"
                            className="block text-sm font-medium leading-6 text-gray-900"
                          >
                            ZIP / Postal code
                          </label>
                          <div className="mt-2">
                            <input
                              type="text"
                              name="postal-code"
                              id="postal-code"
                              autoComplete="postal-code"
                              className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="border-b border-gray-900/10 pb-12">
                      <h2 className="text-base font-semibold leading-7 text-gray-900">
                        Notifications
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-gray-600">
                        Well always let you know about important changes, but
                        you pick what else you want to hear about.
                      </p>

                      <div className="mt-10 space-y-10">
                        <fieldset>
                          <legend className="text-sm font-semibold leading-6 text-gray-900">
                            By Email
                          </legend>
                          <div className="mt-6 space-y-6">
                            <div className="relative flex gap-x-3">
                              <div className="flex h-6 items-center">
                                <input
                                  id="comments"
                                  name="comments"
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                              </div>
                              <div className="text-sm leading-6">
                                <label
                                  htmlFor="comments"
                                  className="font-medium text-gray-900"
                                >
                                  Comments
                                </label>
                                <p className="text-gray-500">
                                  Get notified when someones posts a comment on
                                  a posting.
                                </p>
                              </div>
                            </div>
                            <div className="relative flex gap-x-3">
                              <div className="flex h-6 items-center">
                                <input
                                  id="candidates"
                                  name="candidates"
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                              </div>
                              <div className="text-sm leading-6">
                                <label
                                  htmlFor="candidates"
                                  className="font-medium text-gray-900"
                                >
                                  Candidates
                                </label>
                                <p className="text-gray-500">
                                  Get notified when a candidate applies for a
                                  job.
                                </p>
                              </div>
                            </div>
                            <div className="relative flex gap-x-3">
                              <div className="flex h-6 items-center">
                                <input
                                  id="offers"
                                  name="offers"
                                  type="checkbox"
                                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                                />
                              </div>
                              <div className="text-sm leading-6">
                                <label
                                  htmlFor="offers"
                                  className="font-medium text-gray-900"
                                >
                                  Offers
                                </label>
                                <p className="text-gray-500">
                                  Get notified when a candidate accepts or
                                  rejects an offer.
                                </p>
                              </div>
                            </div>
                          </div>
                        </fieldset>
                        <fieldset>
                          <legend className="text-sm font-semibold leading-6 text-gray-900">
                            Push Notifications
                          </legend>
                          <p className="mt-1 text-sm leading-6 text-gray-600">
                            These are delivered via SMS to your mobile phone.
                          </p>
                          <div className="mt-6 space-y-6">
                            <div className="flex items-center gap-x-3">
                              <input
                                id="push-everything"
                                name="push-notifications"
                                type="radio"
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              />
                              <label
                                htmlFor="push-everything"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Everything
                              </label>
                            </div>
                            <div className="flex items-center gap-x-3">
                              <input
                                id="push-email"
                                name="push-notifications"
                                type="radio"
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              />
                              <label
                                htmlFor="push-email"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Same as email
                              </label>
                            </div>
                            <div className="flex items-center gap-x-3">
                              <input
                                id="push-nothing"
                                name="push-notifications"
                                type="radio"
                                className="h-4 w-4 border-gray-300 text-indigo-600 focus:ring-indigo-600"
                              />
                              <label
                                htmlFor="push-nothing"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                No push notifications
                              </label>
                            </div>
                          </div>
                        </fieldset>
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
