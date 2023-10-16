import Link from "next/link";
import { Button } from "../ui/button";

export default function NotFound() {
  return (
    <>
      <main className="grid min-h-full place-items-center px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <p className="text-base font-semibold text-orange-600">Oh No!</p>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Page not found
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Looks like the page you&apos;re trying to visit doesn&apos;t exist.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Link href="/projects">
              <Button>Go back to projects</Button>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
