import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type BrandLogoProps = {
  className?: string;
  /** Image height in pixels (width scales from 989×191 aspect). */
  height?: number;
  priority?: boolean;
};

export function BrandLogo({
  className,
  height = 32,
  priority = false,
}: BrandLogoProps) {
  const width = Math.round((989 / 191) * height);

  return (
    <Link
      href="/"
      className={cn("inline-flex items-center", className)}
      aria-label="Skill Bridge home"
    >
      <Image
        src="/logo.png"
        alt="Skill Bridge"
        width={width}
        height={height}
        className="h-auto w-auto"
        style={{ height, width: "auto" }}
        priority={priority}
      />
    </Link>
  );
}
