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
import { Separator } from "../ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import Uploader from "./blob-uploader";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
      {/* <form
              action={async (formData: FormData) => {
                const result = await addPost(formData);
                if (result?.error) {
                  toast({
                    variant: "destructive",
                    title: "Failed to add post",
                    description: "Something went wrong",
                  });
                } else {
                  toast({
                    title: "Post added",
                    description: "Your post has been added",
                  });
                }
              }}
              className="flex"
            >
              <Input
                type="text"
                name="content"
                id="content"
                autoComplete="off"
                placeholder="content"
                className="w-56"
              />
              <Input
                type="text"
                name="imageUrl"
                value={image}
                id="imageUrl"
                autoComplete="off"
                placeholder="imageUrl"
                className="w-56"
              />
      
              <div className="flex items-center space-x-2">
                <UploadButton />
              </div>
            </form>
      
            <form
              className="grid gap-6"
              onSubmit={async (e) => {
                e.preventDefault();
                setSaving(true);
                fetch("/api/create-blob", {
                  method: "POST",
                  headers: {
                    "content-type": file?.type || "application/octet-stream",
                  },
                  body: file,
                }).then(async (res) => {
                  if (res.status === 200) {
                    const { url } = (await res.json()) as PutBlobResult;
                    setImage(url);
                  } else {
                    const error = await res.text();
                    alert(error);
                  }
                  setSaving(false);
                });
              }}
            >
              <div>
                <div className="space-y-1 mb-4">
                  <h2 className="text-xl font-semibold">Upload a file</h2>
                  <p className="text-sm text-gray-500">
                    Accepted formats: .png, .jpg, .gif, .mp4
                  </p>
                </div>
                <label
                  htmlFor="image-upload"
                  className="group relative mt-2 flex h-72 cursor-pointer flex-col items-center justify-center rounded-md border border-gray-300 bg-white shadow-sm transition-all hover:bg-gray-50"
                >
                  <div
                    className="absolute z-[5] h-full w-full rounded-md"
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActive(true);
                    }}
                    onDragEnter={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActive(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActive(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setDragActive(false);
      
                      const file = e.dataTransfer.files && e.dataTransfer.files[0];
                      if (file) {
                        if (file.size / 1024 / 1024 > 50) {
                          alert("File size too big (max 50MB)");
                        } else {
                          setFile(file);
                          const reader = new FileReader();
                          reader.onload = (e) => {
                            setData((prev) => ({
                              ...prev,
                              image: e.target?.result as string,
                            }));
                          };
                          reader.readAsDataURL(file);
                        }
                      }
                    }}
                  />
                  <div
                    className={`${
                      dragActive ? "border-2 border-black" : ""
                    } absolute z-[3] flex h-full w-full flex-col items-center justify-center rounded-md px-10 transition-all ${
                      data.image
                        ? "bg-white/80 opacity-0 hover:opacity-100 hover:backdrop-blur-md"
                        : "bg-white opacity-100 hover:bg-gray-50"
                    }`}
                  >
                    <svg
                      className={`${
                        dragActive ? "scale-110" : "scale-100"
                      } h-7 w-7 text-gray-500 transition-all duration-75 group-hover:scale-110 group-active:scale-95`}
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"></path>
                      <path d="M12 12v9"></path>
                      <path d="m16 16-4-4-4 4"></path>
                    </svg>
                    <p className="mt-2 text-center text-sm text-gray-500">
                      Drag and drop or click to upload.
                    </p>
                    <p className="mt-2 text-center text-sm text-gray-500">
                      Max file size: 50MB
                    </p>
                    <span className="sr-only">Photo upload</span>
                  </div>
                  {data.image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={data.image}
                      alt="Preview"
                      className="h-full w-full rounded-md object-cover"
                    />
                  )}
                </label>
                <div className="mt-1 flex rounded-md shadow-sm">
                  <input
                    id="image-upload"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={onChangePicture}
                  />
                </div>
              </div>
      
              <button
                disabled={saveDisabled}
                className={`${
                  saveDisabled
                    ? "cursor-not-allowed border-gray-200 bg-gray-100 text-gray-400"
                    : "border-black bg-black text-white hover:bg-white hover:text-black"
                } flex h-10 w-full items-center justify-center rounded-md border text-sm transition-all focus:outline-none`}
              >
                {saving ? "loading" : <p className="text-sm">Confirm upload</p>}
              </button>
            </form> */}
      <Dialog>
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className="max-w-3xl overflow-y-auto">
          <ScrollArea className="h-full w-full p-4 mt-4 ">
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
                  className="px-4"
                >
                  {/* <div className="grid w-full items-center gap-1.5 mt-4">
              <Label htmlFor="content">Caption</Label>
              <Textarea
                name="content"
                id="content"
                placeholder="Type your message here."
              />
            </div>
            

            <div className="grid w-full items-center gap-1.5 mt-4">
              <Label htmlFor="imageUrl">Image URL</Label>

              <>
                <Input
                  type="text"
                  name="imageUrl"
                  value={image}
                  id="imageUrl"
                  autoComplete="off"
                  placeholder="imageUrl"
                />
                <img
                  src={image}
                  alt="Preview"
                  className="rounded-md object-cover"
                />
              </>
            </div> */}

                  {/* <Input
            type="text"
            name="title"
            id="title"
            autoComplete="off"
            placeholder="title"
          />
          <Input
            type="text"
            name="description"
            id="description"
            autoComplete="off"
            placeholder="description"
          />
          <Input
            type="text"
            name="githubUrl"
            id="githubUrl"
            autoComplete="off"
            placeholder="description"
          />
          <Input
            type="text"
            name="url"
            id="url"
            autoComplete="off"
            placeholder="description"
          />
         
          {image ? (
            <Input
              readOnly={image ? true : false}
              type="text"
              name="coverImg"
              value={image}
            />
          ) : (
            <Input
              onChange={async (e) => {
                e.preventDefault();
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
                    const { url } = (await res.json()) as PutBlobResult;
                    setImage(url);
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
          <Input
            type="text"
            name="demoUrl"
            id="demoUrl"
            autoComplete="off"
            placeholder="demoUrl"
          />
          <Input
            type="text"
            name="stack"
            id="stack"
            autoComplete="off"
            placeholder="stack"
          /> */}
                  <div className="space-y-12">
                    <div className="border-b border-gray-900/10">
                      <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-4">
                          <label
                            htmlFor="username"
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
                            htmlFor="about"
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
                          {/* <label
              htmlFor="cover-photo"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Cover photo
            </label>
            <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
              <div className="text-center">
                <HomeIcon
                  className="mx-auto h-12 w-12 text-gray-300"
                  aria-hidden="true"
                />
                <div className="mt-4 flex text-sm leading-6 text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs leading-5 text-gray-600">
                  PNG, JPG, GIF up to 10MB
                </p>
              </div>
            </div> */}
                          <Uploader />
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
                    <button
                      type="button"
                      className="text-sm font-semibold leading-6 text-gray-900"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Save
                    </button>
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                    <UploadButton />
                  </div>
                </form>
              </DialogDescription>
            </DialogHeader>
          </ScrollArea>
        </DialogContent>
      </Dialog>

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

                          {/* stack shows here */}

                          <div className="mt-2">
                            {/* @ts-ignore */}
                            <Select name="framework" id="framework">
                              <SelectTrigger className="w-[180px]">
                                <SelectValue
                                  placeholder="Theme"
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
                        htmlFor="username"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Demo Video
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
