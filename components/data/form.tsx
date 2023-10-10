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
      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(!open);
        }}
      >
        <DialogTrigger>Open</DialogTrigger>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Create Post</DialogTitle>
            <Separator />
            <DialogDescription>
              {image ? (
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
                      setOpen(false);
                      toast({
                        title: "Post added",
                        description: "Your post has been added",
                      });
                    }
                  }}
                >
                  <div className="grid w-full items-center gap-1.5 mt-4">
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
                  </div>

                  <div className="flex items-center space-x-2 mt-4">
                    <UploadButton />
                  </div>
                </form>
              ) : (
                <form
                  className="grid gap-6"
                  onSubmit={async (e) => {
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
                >
                  <div>
                    <div className="space-y-1 mb-4">
                      <p className="text-sm text-gray-500">
                        Upload an image. Accepted formats: .png, .jpg
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

                          const file =
                            e.dataTransfer.files && e.dataTransfer.files[0];
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
                    {saving ? (
                      "loading"
                    ) : (
                      <p className="text-sm">Confirm upload</p>
                    )}
                  </button>
                </form>
              )}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
}
