import { SignUp } from "@clerk/nextjs";

function Page() {
  return (
    <main className="flex h-screen items-center justify-center p-3">
      <SignUp />
    </main>
  );
}

export default Page;
