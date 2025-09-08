import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useWallet } from "@/hooks/use-wallet";
import { Wallet, ExternalLink, Copy, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

interface WalletConnectProps {
  className?: string;
  showBalance?: boolean;
}

export default function WalletConnect({ className = "", showBalance = true }: WalletConnectProps) {
  const { isConnected, account, connectWallet, disconnectWallet, isConnecting } = useWallet();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  const copyAddress = async () => {
    if (!account) return;
    
    try {
      await navigator.clipboard.writeText(account);
      setCopied(true);
      toast({
        title: "Address Copied",
        description: "Wallet address copied to clipboard",
      });
      
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy address to clipboard",
        variant: "destructive",
      });
    }
  };

  const openInExplorer = () => {
    if (!account) return;
    window.open(`https://polygonscan.com/address/${account}`, '_blank');
  };

  if (!isConnected) {
    return (
      <Card className={`terminal-border ${className}`}>
        <CardContent className="p-6 text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center border border-primary">
              <Wallet className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-mono font-bold text-lg">Connect Wallet</h3>
              <p className="text-muted-foreground font-mono text-sm">
                Connect your MetaMask wallet to start earning POL tokens
              </p>
            </div>
            <Button
              onClick={connectWallet}
              disabled={isConnecting}
              className="bg-primary text-primary-foreground font-mono font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 animate-neon-pulse"
              data-testid="button-connect-wallet-card"
            >
              {isConnecting ? "CONNECTING..." : "CONNECT METAMASK"}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`terminal-border ${className}`}>
      <CardHeader>
        <CardTitle className="font-mono flex items-center justify-between">
          <span className="flex items-center space-x-2">
            <CheckCircle className="h-5 w-5 text-primary" />
            <span>Wallet Connected</span>
          </span>
          <Badge className="bg-primary/20 text-primary font-mono">
            POLYGON
          </Badge>
        </CardTitle>
        <CardDescription className="font-mono">
          Your wallet is connected to the Polygon network
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-muted/30 rounded-lg p-4 border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-mono text-muted-foreground">ADDRESS:</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={copyAddress}
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="button-copy-address"
              >
                {copied ? (
                  <CheckCircle className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </button>
              <button
                onClick={openInExplorer}
                className="text-muted-foreground hover:text-primary transition-colors"
                data-testid="button-view-explorer"
              >
                <ExternalLink className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="font-mono text-sm">
            {account.slice(0, 6)}...{account.slice(-4)}
          </div>
        </div>

        {showBalance && (
          <div className="bg-muted/30 rounded-lg p-4 border border-border">
            <div className="text-sm font-mono text-muted-foreground mb-1">POL BALANCE:</div>
            <div className="font-mono font-bold text-xl text-primary" data-testid="text-pol-balance">
              -- POL
            </div>
            <div className="text-sm font-mono text-muted-foreground">
              Connect to view balance
            </div>
          </div>
        )}

        <div className="flex space-x-2">
          <Button
            onClick={disconnectWallet}
            variant="outline"
            className="flex-1 font-mono"
            data-testid="button-disconnect-wallet-card"
          >
            DISCONNECT
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
