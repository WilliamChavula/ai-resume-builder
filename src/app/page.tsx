import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import logo from "../assets/logo.png";
import resumeImage from "../assets/resume-preview.jpg";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 bg-gray-100 px-5 py-12 text-center text-gray-900 md:flex-row md:text-start lg:gap-12">
      <div className="max-w-prose space-y-3">
        <Image
          src={logo}
          alt="Logo"
          width={150}
          height={150}
          className="mx-auto md:ms-0"
        />
        <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl 2xl:text-5xl">
          Create the{" "}
          <span className="inline-block bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
            Perfect Resume
          </span>{" "}
          in Minutes
        </h1>
        <p className="text-lg text-gray-500">
          Leverage our <strong>AI resume builder</strong> to craft a
          professional resume that stands out to recruiters.
        </p>
        <Button asChild size="lg" variant="premium">
          <Link href="/resumes">Get Started</Link>
        </Button>
      </div>
      <div>
        <Image
          src={resumeImage}
          alt="Resume image"
          width={600}
          className="lg: rotate-[1.5deg] rounded-lg shadow-md"
        />
      </div>
    </main>
  );
}
