import NavigationSidebar from "./components/NavigationSidebar";
import GlobalChat from "./components/GlobalChat";
import TopBanners from "./components/TopBanners";
import RecentWins from "./components/RecentWins";
import GameSections from "./components/GameSections";
import { ScrollArea } from "./components/ui/scroll-area";

export default function App() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <div className="flex h-screen">
        {/* Left Sidebar - Navigation */}
        <NavigationSidebar />
        
        {/* Main Content */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6">
              <TopBanners />
              <RecentWins />
              <GameSections />
            </div>
          </ScrollArea>
        </div>
        
        {/* Right Sidebar - Global Chat */}
        <GlobalChat />
      </div>
    </div>
  );
}