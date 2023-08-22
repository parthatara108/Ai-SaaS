import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";

const DashBoardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-full relative">
      <div
        className="hidden h-full md:flex md:
      w-72 md:flex-col md:fixed ms:inset-y-0 z-[80] bg-gray-900"
      >
        <SideBar />
      </div>
      <Navbar />
      <main className="md:pl-72">{children}</main>
    </div>
  );
};

export default DashBoardLayout;
