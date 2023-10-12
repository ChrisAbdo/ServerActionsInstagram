"use client";

import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";

const features = [
  {
    name: "Push to deploy.",
    description:
      "Aut illo quae. Ut et harum ea animi natus. Culpa maiores et sed sint et magnam exercitationem quia. Ullam voluptas nihil vitae dicta molestiae et. Aliquid velit porro vero.",
  },
  {
    name: "SSL certificates.",
    description:
      "Mollitia delectus a omnis. Quae velit aliquid. Qui nulla maxime adipisci illo id molestiae. Cumque cum ut minus rerum architecto magnam consequatur. Quia quaerat minima.",
  },
  {
    name: "Simple queues.",
    description:
      "Aut repellendus et officiis dolor possimus. Deserunt velit quasi sunt fuga error labore quia ipsum. Commodi autem voluptatem nam. Quos voluptatem totam.",
  },
  {
    name: "Advanced security.",
    description:
      "Magnam provident veritatis odit. Vitae eligendi repellat non. Eum fugit impedit veritatis ducimus. Non qui aspernatur laudantium modi. Praesentium rerum error deserunt harum.",
  },
  {
    name: "Powerful API.",
    description:
      "Sit minus expedita quam in ullam molestiae dignissimos in harum. Tenetur dolorem iure. Non nesciunt dolorem veniam necessitatibus laboriosam voluptas perspiciatis error.",
  },
  {
    name: "Database backups.",
    description:
      "Ipsa in earum deserunt aut. Quos minus aut animi et soluta. Ipsum dicta ut quia eius. Possimus reprehenderit iste aspernatur ut est velit consequatur distinctio.",
  },
];
const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0 },
};
export default function About() {
  const controls = useAnimation();

  useEffect(() => {
    controls.start("visible");
  }, [controls]);
  return (
    <div className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0">
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            All-in-one platform
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Ignite helps connect you to others building awesome projects. Ignite
            provides a platform to share your projects, get feedback, and
            discover new projects to contribute to.
          </p>
        </div>
        <dl className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 text-base leading-7 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={feature.name}
              initial="hidden"
              animate={controls}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <dt className="font-semibold text-primary">{feature.name}</dt>
              <dd className="mt-1 text-foreground">{feature.description}</dd>
            </motion.div>
          ))}
        </dl>
      </div>
    </div>
  );
}
