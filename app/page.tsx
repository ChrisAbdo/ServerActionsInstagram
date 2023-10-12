import Features from "@/components/landing-page/features";
import Globe from "@/components/landing-page/globe";
import HeroAnimation from "@/components/landing-page/hero-animation";
import React from "react";

export default function HomePage() {
  return (
    <div className="bg-background">
      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="text-center">
            <HeroAnimation />
          </div>
          <Features />

          <div>
            <h1 className="text-center text-4xl font-bold tracking-tight sm:text-6xl">
              Join a community of creators and innovators from around the world
            </h1>

            <Globe />
          </div>
        </div>
      </div>
    </div>
  );
}
