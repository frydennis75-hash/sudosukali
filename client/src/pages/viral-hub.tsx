import Navigation from "@/components/navigation"
import { ViralMarketing } from "@/components/viral-marketing"
import { SocialProof } from "@/components/social-proof"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Share, TrendingUp, Users } from "lucide-react"

export default function ViralHub() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950/50 to-black">
      <Navigation />
      
      {/* Animated Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-500 bg-clip-text text-transparent mb-4">
            🚀 Viral Marketing Hub
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Turn your network into your net worth! Share CyberHack, invite friends, and earn massive SUDO rewards. 
            The more you spread the hack, the more you stack!
          </p>
        </div>

        <Tabs defaultValue="referrals" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-gray-900/70 backdrop-blur-sm mb-8 h-14">
            <TabsTrigger value="referrals" className="flex items-center space-x-2 text-base">
              <Share className="h-5 w-5" />
              <span>Referrals & Sharing</span>
            </TabsTrigger>
            <TabsTrigger value="social-proof" className="flex items-center space-x-2 text-base">
              <TrendingUp className="h-5 w-5" />
              <span>Live Activity</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="referrals">
            <ViralMarketing />
          </TabsContent>

          <TabsContent value="social-proof">
            <SocialProof />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}