import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import NProgressBar from "@/app/components/NProgressBar";
import ActivityFeed from "@/app/components/ActivityFeed";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NProgressBar />
      <Navbar />
      <ActivityFeed />
      <main className="flex-1">{children}</main>
      <Footer />
    </>
  );
}
