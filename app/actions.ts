"use server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth-options";
import { prisma } from "@/prisma/db";
import { revalidatePath } from "next/cache";

// Declare a module-level variable
let sessionCache: any = null;

// Define the getSession function
async function getSession() {
  if (!sessionCache) {
    sessionCache = await getServerSession(authOptions);
  }
  return sessionCache;
}

export async function addPost(formData: FormData) {
  const session = await getSession();
  const title = String(formData.get("title"));
  const description = String(formData.get("description"));
  const githubUrl = String(formData.get("githubUrl"));
  const url = String(formData.get("url"));
  const framework = String(formData.get("framework"));

  const coverImg = String(formData.get("coverImg"));
  const authorId = session?.user.id;

  try {
    await prisma.post.create({
      data: {
        title,
        description,
        githubUrl,
        url,
        framework,
        coverImg,
        authorId,
      },
    });
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
  revalidatePath("/dev");
}

export async function addComment(formData: FormData) {
  const session = await getSession();
  const postId = Number(formData.get("postId"));
  const body = String(formData.get("body"));
  const authorId = session?.user.id;

  try {
    await prisma.comment.create({
      data: {
        postId,
        body,
        authorId,
      },
    });
  } catch (error: any) {
    return {
      error: error.message,
    };
  }
  revalidatePath(`/dev/${postId}`);
}
