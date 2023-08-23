import Navbar from "@/components/Navbar";
import SideBar from "@/components/SideBar";
import { getApiLimitCount } from "@/lib/api-limit";
import { checkSubscription } from "@/lib/subscription";

const DashBoardLayout = async ({ children }: { children: React.ReactNode }) => {
  const apiLimitCount = await getApiLimitCount();
  const isPro = await checkSubscription();
  return (
    <div className="h-full relative">
      <div
        className="hidden h-full md:flex md:
      w-72 md:flex-col md:fixed ms:inset-y-0 bg-gray-900"
      >
        <SideBar isPro={isPro} apiLimitCount={apiLimitCount} />
      </div>
      <Navbar />
      <main className="md:pl-72">{children}</main>
    </div>
  );
};

export default DashBoardLayout;
