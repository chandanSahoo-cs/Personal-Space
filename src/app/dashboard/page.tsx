"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";

const Page = () => {
  const { isOpen } = useAuthStore();
  const hasVerified = useRef(false);

  const router = useRouter();


  useEffect(() => {
    hasVerified.current = true;
  }, []);

  return isOpen ? (
    <div className="fixed inset-0 bg-[url('/image2.gif')] bg-cover bg-center bg-no-repeat z-0" />
  ) : (
    <div className="min-h-screen bg-[url('/image2.gif')] bg-cover bg-center bg-no-repeat p-8">
      <div className="absolute inset-0 bg-black/60" />
      <div className="relative z-10">
        <div className="flex gap-6 max-w-4xl mx-auto">
          <div
            onClick={() => router.push("/dashboard/upload")}
            className="flex-1 bg-[#2f3136] rounded-2xl p-6 border border-[#40444b] hover:border-[#5865f2] transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex justify-between items-center gap-2">
                <h2 className="text-white text-xl font-semibold mb-1">Files</h2>
              </div>
            </div>
          </div>

          {/* <div className="flex-1 bg-[#2f3136] rounded-2xl p-6 border border-[#40444b] hover:border-[#5865f2] transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-white text-xl font-semibold mb-1">
                  QuickQuill
                </h2>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Page;
