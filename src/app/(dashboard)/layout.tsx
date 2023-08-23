import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import { getApiLimitCount } from "@/lib/api-limit";

const DashBoardLayout = async ({ children }: { children: React.ReactNode }) => {
  const apiLimitCount = await getApiLimitCount();
  return (
    <div className="h-full relative">
      <div
        className="hidden h-full md:flex md:
      w-72 md:flex-col md:fixed ms:inset-y-0 bg-gray-900"
      >
        <SideBar apiLimitCount={apiLimitCount} />
      </div>
      <Navbar />
      <main className="md:pl-72">{children}</main>
    </div>
  );
};

export default DashBoardLayout;
