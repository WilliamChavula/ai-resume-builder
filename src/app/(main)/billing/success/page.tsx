import { Button } from "@/components/ui/button";
import Link from "next/link";

function Page() {
  return (
    <main className="mx-auto max-w-7xl space-y-6 px-3 py-6 text-center">
      <h1 className="text-3xl font-bold">Billing Success</h1>
      <p>
        The Checkout was successfully completed successfully. And your PRO
        account has been activated
      </p>
      <Button asChild>
        <Link href="/resumes">Create Resume</Link>
      </Button>
    </main>
  );
}

export default Page;
