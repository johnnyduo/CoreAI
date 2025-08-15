import { Droplets, Plus, Bot, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import WalletConnect from '@/components/WalletConnect';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { toast } from 'sonner';
import { coreTestnet } from '@/lib/chains';
import { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
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
      <div className="flex items-center justify-between py-6 px-8">
        <div className="flex items-center space-x-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center animate-pulse-glow">
            <span className="font-space text-white text-2xl font-bold">C</span>
          </div>
          <h1 className="text-3xl font-bold font-space cosmic-text">CoreAI</h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          {/* AI Documentation Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-gradient-to-r from-nebula-600 to-nebula-400 text-white border-none hover:opacity-90"
                  onClick={() => setShowAIDocumentation(true)}
                >
                  <Bot className="h-4 w-4 mr-2" />
                  AI Docs
                </Button>
              </TooltipTrigger>
              <TooltipContent>
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
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-none hover:opacity-90"
                  onClick={handleAddNetwork}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Network
                </Button>
              </TooltipTrigger>
              <TooltipContent>
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
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-none hover:opacity-90"
                  onClick={handleFaucetClick}
                >
                  <Droplets className="h-4 w-4 mr-2" />
                  Faucet
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Get testnet tokens for development</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Wallet Connect button */}
          <div className="w-auto">
            <WalletConnect />
          </div>
        </div>

        <div className="flex md:hidden items-center space-x-4">
          {/* Wallet Connect button always visible */}
          <div className="w-auto">
            <WalletConnect />
          </div>

          {/* Mobile hamburger menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button 
                variant="ghost" 
                size="lg" 
                className="p-3 bg-gradient-to-r from-gray-700 to-gray-900 text-white border-none hover:opacity-90"
                aria-label="Menu"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <div className="flex flex-col space-y-4 mt-8">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-gradient-to-r from-nebula-600 to-nebula-400 text-white border-none hover:opacity-90"
                  onClick={() => setShowAIDocumentation(true)}
                >
                  <Bot className="h-4 w-4 mr-2" />
                  AI Docs
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-none hover:opacity-90"
                  onClick={handleAddNetwork}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Network
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="bg-gradient-to-r from-blue-500 to-cyan-400 text-white border-none hover:opacity-90"
                  onClick={handleFaucetClick}
                >
                  <Droplets className="h-4 w-4 mr-2" />
                  Faucet
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      {/* AI Documentation Modal */}
      <Dialog open={showAIDocumentation} onOpenChange={setShowAIDocumentation}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-4 md:p-6">
          <div className="text-sm md:text-base leading-relaxed">
            <AIDocumentation />
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DashboardHeader;