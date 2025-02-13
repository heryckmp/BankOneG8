import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";
import MobileNav from "@/components/MobileNav";
import Sidebar from "@/components/Sidebar";
import Image from "next/image";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getLoggedInUser();

  if (!user) {
    redirect('/sign-in');
  }

  return (
    <main className="flex min-h-screen w-full bg-gray-50">
      <Sidebar user={user} />
      <section className="flex min-h-screen flex-1 flex-col">
        <div className="root-layout">
          <Image src="/icons/logo.svg" width={30} height={30} alt="logo" />
          <div>
            <MobileNav user={user} />
          </div>
        </div>
        {children}
      </section>
    </main>
  );
}
