"use client";
import { Calendar, ChevronRight, Clock, ExternalLink, X } from "lucide-react";

interface Contest {
  id: string;
  name: string;
  platform: "codeforces" | "codechef";
  startTime: string;
  duration: string;
  url: string;
  status: "upcoming" | "running";
}

// Mock contest data
const mockContests: Contest[] = [
  {
    id: "1",
    name: "Codeforces Round 918 (Div. 2)",
    platform: "codeforces",
    startTime: "2024-01-15T14:35:00Z",
    duration: "2h 15m",
    url: "https://codeforces.com/contest/1915",
    status: "upcoming",
  },
  {
    id: "2",
    name: "CodeChef Starters 115",
    platform: "codechef",
    startTime: "2024-01-17T14:30:00Z",
    duration: "3h",
    url: "https://codechef.com/START115",
    status: "upcoming",
  },
  {
    id: "3",
    name: "Educational Codeforces Round 162",
    platform: "codeforces",
    startTime: "2024-01-18T17:35:00Z",
    duration: "2h",
    url: "https://codeforces.com/contest/1916",
    status: "upcoming",
  },
  {
    id: "4",
    name: "CodeChef Cook-Off 148",
    platform: "codechef",
    startTime: "2024-01-20T21:30:00Z",
    duration: "2h 30m",
    url: "https://codechef.com/COOK148",
    status: "running",
  },
];

interface ContestSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

export function ContestSidebar({ isOpen, onToggle }: ContestSidebarProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTimeUntilContest = (dateString: string) => {
    const now = new Date();
    const contestDate = new Date(dateString);
    const diff = contestDate.getTime() - now.getTime();

    if (diff < 0) return "Started";

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getPlatformColor = (platform: Contest["platform"]) => {
    return platform === "codeforces" ? "#1f8dd6" : "#5865f2";
  };

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={onToggle}
        className={`fixed top-1.5 right-4 z-50 p-3 bg-[#2f3136] hover:bg-[#36393f] rounded-lg border border-[#40444b] transition-all duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-0"
        }`}>
        <ChevronRight
          className={`w-5 h-5 text-white transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 w-80 bg-[#2f3136] border-l border-[#40444b] transform transition-transform duration-300 ease-in-out z-40 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}>
        <div className="p-4 border-b border-[#40444b]">
          <div className="flex items-center justify-between">
            <h2 className="text-white text-lg font-semibold">
              Upcoming Contests
            </h2>
            <button
              onClick={onToggle}
              className="p-1 hover:bg-[#40444b] rounded transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        </div>
        <div className="p-4 h-[580px] space-y-3 overflow-y-scroll contest-scrollbar">
          {mockContests.map((contest) => (
            <div
              key={contest.id}
              className="bg-[#36393f] rounded-lg p-4 border border-[#40444b] hover:border-[#5865f2] transition-colors group">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{
                        backgroundColor: getPlatformColor(contest.platform),
                      }}
                    />
                    <span className="text-xs text-gray-400 uppercase font-medium">
                      {contest.platform}
                    </span>
                    {contest.status === "running" && (
                      <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded-full">
                        LIVE
                      </span>
                    )}
                  </div>
                  <h3 className="text-white text-sm font-medium leading-tight mb-2">
                    {contest.name}
                  </h3>
                </div>
                <a
                  href={contest.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-[#40444b] rounded">
                  <ExternalLink className="w-3 h-3 text-gray-400" />
                </a>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Calendar className="w-3 h-3" />
                  <span>{formatDate(contest.startTime)}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                  <Clock className="w-3 h-3" />
                  <span>{contest.duration}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-[#40444b]">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {contest.status === "running" ? "Started" : "Starts in"}
                  </span>
                  <span className="text-xs font-medium text-[#5865f2]">
                    {getTimeUntilContest(contest.startTime)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <button className="w-full py-2 px-4 bg-[#5865f2] hover:bg-[#4752c4] text-white text-sm rounded-lg transition-colors">
            View All Contests
          </button>
        </div>
        <div className="border-t border-[#40444b]  h-10" />
      </div>
    </>
  );
}
