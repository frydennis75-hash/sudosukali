import Navigation from "@/components/navigation";
import TournamentSystem from "@/components/tournament-system";

export default function Tournaments() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <TournamentSystem />
      </div>
    </div>
  );
}