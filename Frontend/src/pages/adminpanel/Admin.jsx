import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Sidebar from "./SideBar"
import Stats from "./Stats";
import RecentOrders from "./RecentOrders";
import TodaysActivity from "./TodaysActivity";

const Admin = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsOpen(false);
      } else {
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />

      <div
        className={`transition-all duration-300 ${
          isOpen ? "ml-64" : "ml-20"
        } p-4 md:p-6`}
      >
        <div className="mb-4 md:mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
            Dashboard
          </h1>
          <p className="text-sm md:text-base text-gray-600 mb-3 md:mb-4">
            Welcome back!
          </p>

          <div className="relative max-w-xl flex">
            <div className="bg-[#c44569]  px-4 rounded-l-xl shadow-md flex items-center justify-center">
              <Search className="text-white" size={20} />
            </div>
            <input
              type="text"
              placeholder="Search orders by customer, ID, or status..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 px-4 py-3.5 text-md border-2 border-l-0 border-[#c44569] rounded-r-xl focus:border-[#c44569] focus:outline-none shadow-md hover:shadow-lg focus:shadow-xl transition-all bg-white"
            />
          </div>
        </div>

        <Stats />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RecentOrders searchQuery={searchQuery} />
          <TodaysActivity />
        </div>
      </div>
    </div>
  );
};

export default Admin;
