import Navigation from "@/components/navigation";
import NFTRewards from "@/components/nft-rewards";

export default function NFTRewardsPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <div className="container mx-auto px-4 py-8">
        <NFTRewards />
      </div>
    </div>
  );
}