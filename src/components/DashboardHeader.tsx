import { Droplets, Plus, Bot, Menu, Crown, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WalletConnect from '@/components/WalletConnect';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { coreTestnet } from '@/lib/chains';
import { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import AIDocumentation from '@/components/AIDocumentation';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

const DashboardHeader = () => {
  const [showAIDocumentation, setShowAIDocumentation] = useState(false);

  const handleFaucetClick = () => {
    window.open('https://scan.test2.btcs.network/faucet', '_blank');
  };

  const handleAddNetwork = async () => {
    // Check if MetaMask is installed
    if (typeof window.ethereum === 'undefined') {
      toast.error('MetaMask Not Found', {
        description: 'Please install MetaMask to add the Core Testnet.'
      });
      return;
    }

    try {
      // Convert chainId to hex format (required by MetaMask)
      const chainIdHex = `0x${coreTestnet.id.toString(16)}`;
      
      // First, try to switch to the network if it already exists
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainIdHex }],
        });
        toast.success('Network Switched', {
          description: 'Successfully switched to Core Blockchain TestNet.'
        });
        return;
      } catch (switchError: any) {
        // This error code indicates that the chain has not been added to MetaMask
        if (switchError.code === 4902) {
          console.log('Network not found, attempting to add it...');
        } else {
          // For other errors, just try to add the network
          console.log('Error switching network:', switchError);
        }
      }
      
      // Prepare the network params
      const networkParams = {
        chainId: chainIdHex,
        chainName: coreTestnet.name,
        nativeCurrency: {
          ...coreTestnet.nativeCurrency,
        },
        rpcUrls: [coreTestnet.rpcUrls.default.http[0]],
        blockExplorerUrls: [coreTestnet.blockExplorers.default.url],
      };
      
      console.log('Adding network with params:', networkParams);
      
      // Add the network to MetaMask
      await window.ethereum.request({
        method: 'wallet_addEthereumChain',
        params: [networkParams],
      });
      
      toast.success('Network Added', {
        description: 'Core Testnet has been added to your wallet.'
      });
    } catch (error: any) {
      console.error('Error adding network:', error);
      
      // Check for specific error about symbol mismatch
      if (error.message && error.message.includes('nativeCurrency.symbol does not match')) {
        toast.info('Network Already Added', {
          description: 'The Core Testnet is already in your wallet. Please switch to it manually.'
        });
      } else {
        toast.error(
          'Failed to Add Network', 
          error.message || 'Please try adding the network manually.'
        );
      }
    }
  };

  return (
    <>
      {/* Golden Header Bar */}
      <div className="relative z-20 bg-charcoal-900/80 backdrop-blur-xl border-b border-golden-border shadow-charcoal-deep">
        {/* Golden accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-golden"></div>
        
        <div className="flex items-center justify-between py-6 px-8">
          {/* Logo Section */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-14 w-14 rounded-2xl bg-gradient-golden flex items-center justify-center shadow-golden-glow animate-golden-pulse">
                <Crown className="h-7 w-7 text-charcoal-900" />
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-gold-400 rounded-full flex items-center justify-center">
                <Zap className="h-2 w-2 text-charcoal-900" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-playfair font-bold golden-text">CoreAI</h1>
              <p className="text-xs font-inter text-gold-300/60 mt-1">Premium DeFi Portfolio Navigator</p>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3">
            {/* AI Documentation Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-charcoal-800/60 backdrop-blur-xl border-golden-border hover:bg-gradient-golden hover:text-charcoal-900 text-gold-200 transition-all duration-300 hover:shadow-golden-glow hover:scale-105 font-inter"
                    onClick={() => setShowAIDocumentation(true)}
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    AI Docs
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-charcoal-800 border-golden-border text-gold-200">
                  <p>Learn about our AI capabilities</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Add Network Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-charcoal-800/60 backdrop-blur-xl border-golden-border hover:bg-gradient-golden hover:text-charcoal-900 text-gold-200 transition-all duration-300 hover:shadow-golden-glow hover:scale-105 font-inter"
                    onClick={handleAddNetwork}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Network
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-charcoal-800 border-golden-border text-gold-200">
                  <p>Add Core Testnet to MetaMask</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Faucet Button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-charcoal-800/60 backdrop-blur-xl border-golden-border hover:bg-gradient-golden hover:text-charcoal-900 text-gold-200 transition-all duration-300 hover:shadow-golden-glow hover:scale-105 font-inter"
                    onClick={handleFaucetClick}
                  >
                    <Droplets className="h-4 w-4 mr-2" />
                    Faucet
                  </Button>
                </TooltipTrigger>
                <TooltipContent className="bg-charcoal-800 border-golden-border text-gold-200">
                  <p>Get testnet tokens for development</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Wallet Connect button */}
            <div className="ml-4">
              <WalletConnect />
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="flex md:hidden items-center space-x-3">
            {/* Wallet Connect button always visible */}
            <div>
              <WalletConnect />
            </div>

            {/* Mobile hamburger menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="lg" 
                  className="p-3 bg-charcoal-800/60 backdrop-blur-xl border border-golden-border hover:bg-gradient-golden hover:text-charcoal-900 text-gold-200 transition-all duration-300"
                  aria-label="Menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-charcoal-900/95 backdrop-blur-xl border-golden-border">
                <div className="flex flex-col space-y-4 mt-8">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-charcoal-800/60 backdrop-blur-xl border-golden-border hover:bg-gradient-golden hover:text-charcoal-900 text-gold-200 transition-all duration-300 font-inter justify-start"
                    onClick={() => setShowAIDocumentation(true)}
                  >
                    <Bot className="h-4 w-4 mr-2" />
                    AI Documentation
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-charcoal-800/60 backdrop-blur-xl border-golden-border hover:bg-gradient-golden hover:text-charcoal-900 text-gold-200 transition-all duration-300 font-inter justify-start"
                    onClick={handleAddNetwork}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Network
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="bg-charcoal-800/60 backdrop-blur-xl border-golden-border hover:bg-gradient-golden hover:text-charcoal-900 text-gold-200 transition-all duration-300 font-inter justify-start"
                    onClick={handleFaucetClick}
                  >
                    <Droplets className="h-4 w-4 mr-2" />
                    Get Faucet Tokens
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>

      {/* AI Documentation Modal */}
      <Dialog open={showAIDocumentation} onOpenChange={setShowAIDocumentation}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-4 md:p-6 bg-charcoal-900/95 backdrop-blur-xl border-golden-border">
          <VisuallyHidden>
            <DialogTitle>AI System Documentation</DialogTitle>
          </VisuallyHidden>
          <div className="text-sm md:text-base leading-relaxed">
            <AIDocumentation />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardHeader;