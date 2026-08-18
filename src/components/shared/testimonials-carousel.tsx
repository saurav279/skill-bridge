"use client";

import { useState } from "react";
// import Image from "next/image";
import { testimonials as defaultTestimonials } from "@/data/testimonials";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

type TestimonialsCarouselProps = {
  items?: Testimonial[];
  title?: string;
  className?: string;
};

export function TestimonialsCarousel({
  items = defaultTestimonials,
  title = "What clients say",
  className,
}: TestimonialsCarouselProps) {
  const [index, setIndex] = useState(0);
  const total = items.length;
  const current = items[index];

  if (!current || total === 0) return null;

  function goPrev() {
    setIndex((i) => (i - 1 + total) % total);
  }

  function goNext() {
    setIndex((i) => (i + 1) % total);
  }

  return (
    <div
      className={cn(
        "mx-auto flex max-w-3xl flex-col items-center text-center",
        className
      )}
    >
      <h2 className="text-balance text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
        {title}
      </h2>

      <figure className="mt-10 w-full sm:mt-14">
        <blockquote
          key={current.id}
          className="animate-in fade-in slide-in-from-bottom-1 text-xl  leading-relaxed tracking-tight text-foreground duration-500 sm:text-2xl md:text-[1.75rem] md:leading-snug"
        >
          “{current.quote}”
        </blockquote>

        <figcaption
          key={`cap-${current.id}`}
          className="mt-10 flex animate-in fade-in flex-col items-center gap-3 duration-500"
        >
        <Avatar className="size-14 ring-1 ring-border/60 sm:size-16">
  <AvatarImage
    src={current.image}
    alt={current.name}
    className="object-cover"
  />
  <AvatarFallback>
    {current.name.charAt(0).toUpperCase()}
  </AvatarFallback>
</Avatar>
          <div>
            <p className="text-base font-semibold tracking-tight text-foreground">
              {current.name}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {current.role}, {current.company}
            </p>
          </div>
        </figcaption>
      </figure>

      <div className="mt-12 flex w-full max-w-xs items-center justify-between gap-4 sm:max-w-sm">
        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-xl px-5"
          onClick={goPrev}
          aria-label="Previous testimonial"
        >
          Prev
        </Button>

        <div
          className="flex items-center gap-2"
          role="tablist"
          aria-label="Testimonials"
        >
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={i === index}
              aria-label={`Show testimonial ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "size-2.5 rounded-full transition-colors",
                i === index
                  ? "bg-primary"
                  : "bg-muted-foreground/25 hover:bg-muted-foreground/40"
              )}
            />
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          className="h-10 rounded-xl px-5"
          onClick={goNext}
          aria-label="Next testimonial"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
