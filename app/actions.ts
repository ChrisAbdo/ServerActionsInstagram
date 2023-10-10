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
  const content = String(formData.get("content"));
  const imageUrl = String(formData.get("imageUrl"));
  const authorId = session?.user.id;

  try {
    await prisma.post.create({
      data: {
        content,
        imageUrl,
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
