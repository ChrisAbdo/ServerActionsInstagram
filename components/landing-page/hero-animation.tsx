"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Button } from "../ui/button";
import ExpandingArrow from "../shared/expanding-arrow";

export default function HeroAnimation() {
  const FADE_UP_ANIMATION_VARIANTS = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: "spring" } },
  };
  return (
    <motion.div
      initial="hidden"
      animate="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >
      <motion.div variants={FADE_UP_ANIMATION_VARIANTS}>
        <div className="hidden sm:mb-8 sm:flex sm:justify-center">
          <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-ring/10 hover:ring-ring/20">
            Announcing our next round of funding.{" "}
            <a href="#" className="font-semibold text-primary">
              <span className="absolute inset-0" aria-hidden="true" />
              Read more <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </div>
      </motion.div>

      <motion.h1
        className="text-4xl font-bold tracking-tight sm:text-6xl"
        variants={FADE_UP_ANIMATION_VARIANTS}
      >
        Where ideas&nbsp;
        <span
          className=" bg-gradient-to-r from-red-600 via-orange-400 to-orange-600
          animate-gradient-x bg-clip-text text-transparent transition-all duration-2000 ease-in-out"
        >
          catch fire
        </span>
        &nbsp;and collaboration takes flight
      </motion.h1>
      <motion.p
        className="mt-6 text-lg leading-8 text-muted-foreground"
        variants={FADE_UP_ANIMATION_VARIANTS}
      >
        Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui lorem
        cupidatat commodo. Elit sunt amet fugiat veniam occaecat fugiat aliqua.{" "}
      </motion.p>
      <motion.div
        className="mt-10 flex items-center justify-center gap-x-6"
        variants={FADE_UP_ANIMATION_VARIANTS}
      >
        <Link href="/projects">
          <Button>Get Started</Button>
        </Link>
        <Link href="/about">
          <Button variant="secondary" className="group pr-8">
            Learn More
            <ExpandingArrow />
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}
