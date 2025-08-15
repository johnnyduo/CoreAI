import { useState, useEffect, useMemo } from 'react';
import { ArrowUpRight, ArrowDownRight, MoveVertical, RefreshCw, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationNext, 
  PaginationPrevious,
  PaginationLink
} from '@/components/ui/pagination';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { fetchTokenPrices, cacheTokenData, getCachedTokenData, TokenPrice, fetchTokenInsights } from '@/lib/tokenService';
import { isGeminiAvailable } from '@/lib/geminiService';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/components/ui/use-toast';

interface Token {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  volume: number;
  allocation: number;
  category: string;
}

const categoryColors: { [key: string]: string } = {
  meme: '#EC4899',     // Pink
  rwa: '#0EA5E9',      // Blue
  bigcap: '#10B981',   // Green
  defi: '#F97316',     // Orange
  l1: '#8B5CF6',       // Purple
  stablecoin: '#14B8A6', // Teal
  ai: '#D946EF'        // Magenta
};

// Updated token data based on the provided list - USDC prioritized for portfolio management
const mockTokens: Token[] = [
  { id: '1', name: 'Core', symbol: 'CORE', price: 1.23, change24h: 2.45, marketCap: 1200000000, volume: 45000000, allocation: 8, category: 'bigcap' },
  { id: '2', name: 'AUSD', symbol: 'AUSD', price: 1.00, change24h: 0.05, marketCap: 85000000, volume: 2300000, allocation: 3, category: 'stablecoin' },
  { id: '3', name: 'KAMALA', symbol: 'KAMALA', price: 0.0034, change24h: -15.6, marketCap: 3400000, volume: 890000, allocation: 2, category: 'meme' },
  { id: '4', name: 'USTI', symbol: 'USTI', price: 0.87, change24h: 4.2, marketCap: 23000000, volume: 5600000, allocation: 4, category: 'defi' },
  { id: '5', name: 'BITS', symbol: 'BITS', price: 0.0156, change24h: 18.7, marketCap: 12000000, volume: 3400000, allocation: 3, category: 'defi' },
  { id: '6', name: 'E91', symbol: 'E91', price: 0.42, change24h: -2.1, marketCap: 8900000, volume: 1200000, allocation: 2, category: 'defi' },
  { id: '7', name: 'LABUBU', symbol: 'LABUBU', price: 0.0089, change24h: 34.5, marketCap: 5600000, volume: 2100000, allocation: 3, category: 'meme' },
  { id: '8', name: 'CRMB', symbol: 'CRMB', price: 0.0231, change24h: -8.3, marketCap: 15000000, volume: 4200000, allocation: 4, category: 'defi' },
  { id: '9', name: 'Bored Ape Yacht Club', symbol: 'BAYC', price: 12.45, change24h: 5.8, marketCap: 124500000, volume: 8900000, allocation: 6, category: 'meme' },
  { id: '10', name: 'WCORE', symbol: 'WCORE', price: 1.24, change24h: 2.3, marketCap: 456000000, volume: 23000000, allocation: 7, category: 'bigcap' },
  { id: '11', name: 'SolvBTC.G', symbol: 'SolvBTC.G', price: 64234.56, change24h: 1.2, marketCap: 890000000, volume: 45000000, allocation: 9, category: 'bigcap' },
  { id: '12', name: 'BLOB', symbol: 'BLOB', price: 0.0067, change24h: 22.4, marketCap: 4500000, volume: 1800000, allocation: 2, category: 'meme' },
  { id: '13', name: 'PINFI', symbol: 'PINFI', price: 0.34, change24h: 6.7, marketCap: 18000000, volume: 3200000, allocation: 4, category: 'defi' },
  { id: '14', name: 'vltCORE', symbol: 'vltCORE', price: 1.15, change24h: 3.1, marketCap: 67000000, volume: 12000000, allocation: 5, category: 'defi' },
  { id: '15', name: 'CLND', symbol: 'CLND', price: 0.0145, change24h: -4.2, marketCap: 8900000, volume: 2100000, allocation: 3, category: 'defi' },
  { id: '16', name: 'NOVA', symbol: 'NOVA', price: 0.76, change24h: 8.9, marketCap: 34000000, volume: 6700000, allocation: 5, category: 'l1' },
  { id: '17', name: 'CRUISE', symbol: 'CRUISE', price: 0.0234, change24h: 15.6, marketCap: 12000000, volume: 3400000, allocation: 3, category: 'defi' },
  { id: '18', name: 'TDev0', symbol: 'TDev0', price: 0.0089, change24h: -12.3, marketCap: 2300000, volume: 890000, allocation: 2, category: 'defi' },
  { id: '19', name: 'OEX', symbol: 'OEX', price: 0.45, change24h: 4.5, marketCap: 23000000, volume: 5600000, allocation: 4, category: 'defi' },
  { id: '20', name: 'Peanut the Squirrel', symbol: 'PNUT', price: 0.6523, change24h: -8.4, marketCap: 652300000, volume: 89000000, allocation: 8, category: 'meme' },
  { id: '21', name: 'Dogecoin', symbol: 'DOGE', price: 0.2237, change24h: 2.1, marketCap: 32800000000, volume: 5143000000, allocation: 10, category: 'meme' },
  { id: '22', name: 'CORP', symbol: 'CORP', price: 0.0156, change24h: -6.7, marketCap: 8900000, volume: 2100000, allocation: 3, category: 'defi' },
  { id: '23', name: 'Chill Guy', symbol: 'CHILLGUY', price: 0.1845, change24h: 12.3, marketCap: 184500000, volume: 23000000, allocation: 6, category: 'meme' },
  { id: '24', name: 'Wrapped Bitcoin', symbol: 'WBTC', price: 64234.56, change24h: 1.2, marketCap: 15600000000, volume: 890000000, allocation: 12, category: 'bigcap' },
  { id: '25', name: 'SolvBTC.b', symbol: 'SolvBTC.b', price: 64189.23, change24h: 1.1, marketCap: 234000000, volume: 12000000, allocation: 7, category: 'bigcap' },
  { id: '26', name: 'AMCL', symbol: 'AMCL', price: 0.0345, change24h: 5.6, marketCap: 15000000, volume: 3200000, allocation: 4, category: 'defi' },
  { id: '27', name: 'USBD', symbol: 'USBD', price: 1.00, change24h: 0.02, marketCap: 45000000, volume: 8900000, allocation: 4, category: 'stablecoin' },
  { id: '28', name: 'satoshi', symbol: 'satoshi', price: 0.0000045, change24h: 23.5, marketCap: 2300000, volume: 560000, allocation: 2, category: 'meme' },
  { id: '29', name: 'HOBB', symbol: 'HOBB', price: 0.0234, change24h: -3.4, marketCap: 8900000, volume: 1800000, allocation: 3, category: 'defi' },
  { id: '30', name: 'CTO', symbol: 'CTO', price: 0.56, change24h: 7.8, marketCap: 34000000, volume: 6700000, allocation: 5, category: 'defi' },
  { id: '31', name: 'BTCB', symbol: 'BTCB', price: 64156.78, change24h: 1.0, marketCap: 890000000, volume: 45000000, allocation: 9, category: 'bigcap' },
  { id: '32', name: 'COREBTC', symbol: 'COREBTC', price: 1.234, change24h: 2.1, marketCap: 67000000, volume: 12000000, allocation: 5, category: 'bigcap' },
  { id: '33', name: 'Tether USD', symbol: 'USDT', price: 1.00, change24h: 0.01, marketCap: 89700000000, volume: 52300000000, allocation: 15, category: 'stablecoin' },
  { id: '34', name: 'SolvBTC.CORE', symbol: 'SolvBTC.CORE', price: 64123.45, change24h: 1.1, marketCap: 345000000, volume: 23000000, allocation: 8, category: 'bigcap' },
  { id: '35', name: 'EIN', symbol: 'EIN', price: 0.0456, change24h: 8.9, marketCap: 23000000, volume: 4500000, allocation: 4, category: 'defi' },
  { id: '36', name: '3', symbol: '3', price: 0.0123, change24h: -2.3, marketCap: 5600000, volume: 1200000, allocation: 2, category: 'defi' },
  { id: '37', name: 'cSTCORE', symbol: 'cSTCORE', price: 1.18, change24h: 3.4, marketCap: 45000000, volume: 8900000, allocation: 5, category: 'defi' },
  { id: '38', name: 'GM', symbol: 'GM', price: 0.0089, change24h: 15.6, marketCap: 3400000, volume: 890000, allocation: 2, category: 'meme' },
  { id: '39', name: 'USD Coin', symbol: 'USDC', price: 1.00, change24h: 0.01, marketCap: 28500000000, volume: 3700000000, allocation: 12, category: 'stablecoin' },
  { id: '40', name: 'JUC', symbol: 'JUC', price: 0.0234, change24h: -5.6, marketCap: 8900000, volume: 1800000, allocation: 3, category: 'defi' },
  { id: '41', name: 'CPOX', symbol: 'CPOX', price: 0.0145, change24h: 12.3, marketCap: 6700000, volume: 2100000, allocation: 3, category: 'defi' },
  { id: '42', name: 'variableDebtCoreWCORE', symbol: 'variableDebtCoreWCORE', price: 1.12, change24h: 2.8, marketCap: 23000000, volume: 4500000, allocation: 4, category: 'defi' },
  { id: '43', name: 'BtcUSD', symbol: 'BtcUSD', price: 1.00, change24h: 0.03, marketCap: 12000000, volume: 2300000, allocation: 3, category: 'stablecoin' },
  { id: '44', name: 'ASX', symbol: 'ASX', price: 0.0345, change24h: 6.7, marketCap: 15000000, volume: 3200000, allocation: 4, category: 'defi' },
  { id: '45', name: 'stCORE', symbol: 'stCORE', price: 1.26, change24h: 2.9, marketCap: 89000000, volume: 18000000, allocation: 6, category: 'defi' },
  { id: '46', name: 'CAUSD', symbol: 'CAUSD', price: 1.00, change24h: 0.02, marketCap: 34000000, volume: 6700000, allocation: 4, category: 'stablecoin' },
  { id: '47', name: 'XXX', symbol: 'XXX', price: 0.0156, change24h: -8.9, marketCap: 2300000, volume: 560000, allocation: 2, category: 'defi' },
  { id: '48', name: 'Pepe', symbol: 'PEPE', price: 0.00001093, change24h: -2.4, marketCap: 4600000000, volume: 1593000000, allocation: 9, category: 'meme' },
  { id: '49', name: 'dualCORE', symbol: 'dualCORE', price: 1.21, change24h: 3.2, marketCap: 67000000, volume: 12000000, allocation: 5, category: 'defi' },
  { id: '50', name: 'symbol', symbol: 'symbol', price: 0.0001, change24h: 0.0, marketCap: 100000, volume: 10000, allocation: 1, category: 'defi' },
  { id: '51', name: 'TLND', symbol: 'TLND', price: 0.0234, change24h: 4.5, marketCap: 8900000, volume: 2100000, allocation: 3, category: 'defi' },
  { id: '52', name: 'H1', symbol: 'H1', price: 0.0456, change24h: -3.4, marketCap: 12000000, volume: 2300000, allocation: 3, category: 'defi' },
  { id: '53', name: 'Grayscale Bitcoin Trust', symbol: 'GBTC', price: 56.78, change24h: 0.8, marketCap: 12500000000, volume: 234000000, allocation: 10, category: 'bigcap' },
  { id: '54', name: 'vltCORE', symbol: 'vltCORE', price: 1.15, change24h: 3.1, marketCap: 67000000, volume: 12000000, allocation: 5, category: 'defi' },
  { id: '55', name: 'PT-dualBTC', symbol: 'PT-dualBTC', price: 64098.45, change24h: 0.9, marketCap: 123000000, volume: 8900000, allocation: 6, category: 'bigcap' },
  { id: '56', name: 'SolvBTC.m', symbol: 'SolvBTC.m', price: 64067.89, change24h: 1.0, marketCap: 234000000, volume: 15000000, allocation: 7, category: 'bigcap' },
  { id: '57', name: 'THERE V3', symbol: 'THERE V3', price: 0.0345, change24h: 8.9, marketCap: 23000000, volume: 4500000, allocation: 4, category: 'defi' },
  { id: '58', name: 'BITCOIN', symbol: 'BITCOIN', price: 0.00034, change24h: 45.6, marketCap: 5600000, volume: 1800000, allocation: 3, category: 'meme' },
  { id: '59', name: 'PVE', symbol: 'PVE', price: 0.0234, change24h: -6.7, marketCap: 8900000, volume: 2100000, allocation: 3, category: 'defi' },
  { id: '60', name: 'RAI', symbol: 'RAI', price: 3.05, change24h: 0.5, marketCap: 45000000, volume: 8900000, allocation: 4, category: 'stablecoin' },
  { id: '61', name: 'Wrapped Ethereum', symbol: 'WETH', price: 3245.78, change24h: 0.8, marketCap: 389000000000, volume: 15700000000, allocation: 13, category: 'bigcap' },
  { id: '62', name: 'moonpig', symbol: 'moonpig', price: 0.0089, change24h: 23.4, marketCap: 3400000, volume: 890000, allocation: 2, category: 'meme' },
  { id: '63', name: 'LCORE', symbol: 'LCORE', price: 1.18, change24h: 2.7, marketCap: 56000000, volume: 11000000, allocation: 5, category: 'defi' },
  { id: '64', name: 'BRDA', symbol: 'BRDA', price: 0.0145, change24h: -4.5, marketCap: 6700000, volume: 1800000, allocation: 3, category: 'defi' },
  { id: '65', name: 'Moodeng', symbol: 'MOODENG', price: 0.2845, change24h: 8.9, marketCap: 284500000, volume: 34000000, allocation: 7, category: 'meme' },
  { id: '66', name: 'Dogwifhat', symbol: 'WIF', price: 1.89, change24h: -3.4, marketCap: 1890000000, volume: 234000000, allocation: 8, category: 'meme' }
];

const ITEMS_PER_PAGE = 10;
const REFRESH_INTERVALS = {
  AUTO: 300000, // 5 minutes auto-refresh
  MANUAL: null  // Manual refresh only
};

const TokenTable = ({ category = "all" }: { category?: string }) => {
  const [sortField, setSortField] = useState<keyof Token>('allocation');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [liveTokenData, setLiveTokenData] = useState<TokenPrice[]>([]);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number | null>(REFRESH_INTERVALS.AUTO);
  const [autoRefreshEnabled, setAutoRefreshEnabled] = useState(true);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [tokenInsight, setTokenInsight] = useState<string | null>(null);
  const [isInsightLoading, setIsInsightLoading] = useState(false);
  const [isGeminiEnabled, setIsGeminiEnabled] = useState(false);
  const { toast } = useToast();
  
  // Auto-refresh effect
  useEffect(() => {
    if (!refreshInterval) return;
    
    const intervalId = setInterval(() => {
      refreshTokenData();
    }, refreshInterval);
    
    return () => clearInterval(intervalId);
  }, [refreshInterval]);
  
  // Toggle auto-refresh
  const toggleAutoRefresh = () => {
    const newState = !autoRefreshEnabled;
    setAutoRefreshEnabled(newState);
    setRefreshInterval(newState ? REFRESH_INTERVALS.AUTO : REFRESH_INTERVALS.MANUAL);
    
    toast({
      title: newState ? 'Auto-refresh enabled' : 'Auto-refresh disabled',
      description: newState 
        ? 'Prices will update every 5 minutes' 
        : 'Prices will only update when you click refresh',
    });
  };
  
  // Fetch token prices on component mount
  useEffect(() => {
    const loadTokenData = async () => {
      // Check if we have cached data that's less than 5 minutes old
      const { data: cachedData, timestamp } = getCachedTokenData();
      const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
      
      if (cachedData.length > 0) {
        setLiveTokenData(cachedData);
        setLastUpdated(new Date(timestamp));
        
        // Only fetch new data if cached data is older than 5 minutes
        if (timestamp < fiveMinutesAgo) {
          await refreshTokenData(false); // Silent refresh
        }
        return;
      }
      
      // Otherwise fetch fresh data
      await refreshTokenData(false); // Silent refresh
    };
    
    loadTokenData();
  }, []);
  
  // Check if Gemini API is available
  useEffect(() => {
    setIsGeminiEnabled(typeof isGeminiAvailable === 'function' ? isGeminiAvailable() : false);
  }, []);

  // Function to fetch token insights
  const getTokenInsights = async (token: Token) => {
    if (!isGeminiEnabled) {
      toast({
        title: "AI Insights Unavailable",
        description: "Gemini API key is not configured. Please add it to your environment variables.",
        variant: "destructive"
      });
      return;
    }
    setSelectedToken(token);
    setTokenInsight(null);
    setIsInsightLoading(true);
    try {
      const insights = await fetchTokenInsights(token.symbol);
      setTokenInsight(insights);
    } catch (error) {
      console.error('Error fetching token insights:', error);
      toast({
        title: "Failed to Load Insights",
        description: error instanceof Error ? error.message : "Could not fetch AI insights for this token. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsInsightLoading(false);
    }
  };

  // Function to refresh token data manually
  const refreshTokenData = async (showToast = true) => {
    setIsLoading(true);
    try {
      const data = await fetchTokenPrices();
      if (data.length > 0) {
        setLiveTokenData(data);
        cacheTokenData(data);
        setLastUpdated(new Date());
        
        if (showToast) {
          toast({
            title: 'Token prices updated',
            description: 'Latest market data has been loaded successfully.',
          });
        }
      }
    } catch (error: any) {
      console.error('Error refreshing token data:', error);
      
      // Handle rate limiting specifically
      if (error.response && error.response.status === 429) {
        toast({
          title: 'Rate limit exceeded',
          description: 'Please wait a moment before refreshing again.',
          variant: 'destructive',
        });
      } else if (showToast) {
        toast({
          title: 'Update failed',
          description: 'Could not refresh token prices. Please try again later.',
          variant: 'destructive',
        });
      }
      
      // If fetch fails but we have cached data, keep using it
      const { data: cachedData, timestamp } = getCachedTokenData();
      if (cachedData.length > 0 && !liveTokenData.length) {
        setLiveTokenData(cachedData);
        setLastUpdated(new Date(timestamp));
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  // Merge live token data with mock data
  const mergedTokenData = () => {
    if (liveTokenData.length === 0) return mockTokens;
    
    // Create a map of symbols to live data
    const liveDataMap = new Map(liveTokenData.map(token => [
      token.symbol.toUpperCase(),
      token
    ]));
    
    // Update mock tokens with live data where available
    return mockTokens.map(token => {
      const liveToken = liveDataMap.get(token.symbol.toUpperCase());
      if (liveToken) {
        return {
          ...token,
          price: liveToken.current_price,
          change24h: liveToken.price_change_percentage_24h,
          marketCap: liveToken.market_cap,
          volume: liveToken.total_volume
        };
      }
      return token;
    });
  };
  
  // Filter tokens based on category
  const filteredTokens = useMemo(() => {
    return category === 'all' 
      ? mergedTokenData() 
      : mergedTokenData().filter(token => {
          const tokenCategories = token.category.split('/');
          return tokenCategories.some(cat => cat.toLowerCase() === category.toLowerCase());
        });
  }, [category, liveTokenData]);
  
  // Sort tokens based on current sort field and direction
  const sortedTokens = useMemo(() => {
    return [...filteredTokens].sort((a, b) => {
      if (sortDirection === 'asc') {
        return a[sortField] > b[sortField] ? 1 : -1;
      } else {
        return a[sortField] < b[sortField] ? 1 : -1;
      }
    });
  }, [filteredTokens, sortField, sortDirection]);

  const totalPages = Math.ceil(sortedTokens.length / ITEMS_PER_PAGE);
  const paginatedTokens = sortedTokens.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (field: keyof Token) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  const formatNumber = (num: number) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(1)}B`;
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(1)}M`;
    } else {
      return `$${num.toLocaleString()}`;
    }
  };

  const getCategoryTitle = () => {
    switch(category) {
      case 'ai': return 'AI & DeFi Tokens';
      case 'meme': return 'Meme & NFT Tokens';
      case 'rwa': return 'Real World Assets';
      case 'bigcap': return 'Big Cap Tokens';
      case 'defi': return 'DeFi Protocols';
      case 'l1': return 'Layer 1 Protocols';
      case 'stablecoin': return 'Stablecoins';
      default: return 'All Tokens';
    }
  };

  const goToPreviousPage = () => {
    setCurrentPage(p => Math.max(1, p - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(p => Math.min(totalPages, p + 1));
  };
  
    // Format the last updated time
    const getLastUpdatedText = () => {
      if (!lastUpdated) return 'Never updated';
      
      // If updated less than a minute ago, show "Just now"
      const secondsAgo = Math.floor((Date.now() - lastUpdated.getTime()) / 1000);
      if (secondsAgo < 60) return 'Just now';
      
      // If updated less than an hour ago, show minutes
      const minutesAgo = Math.floor(secondsAgo / 60);
      if (minutesAgo < 60) return `${minutesAgo} minute${minutesAgo === 1 ? '' : 's'} ago`;
      
      // Otherwise show the time
      return lastUpdated.toLocaleTimeString();
    };
    
    return (
      <>
        <Card className="card-glass">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{getCategoryTitle()}</CardTitle>
              {isGeminiEnabled && (
                <p className="text-xs text-muted-foreground mt-1">
                  Click on any token to view AI-powered insights
                </p>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        <span>{getLastUpdatedText()}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Last updated: {lastUpdated?.toLocaleString() || 'Never'}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              
              <div className="flex items-center space-x-2">
                <span className="text-xs">Auto</span>
                <Switch 
                  checked={autoRefreshEnabled} 
                  onCheckedChange={toggleAutoRefresh} 
                  aria-label="Toggle auto-refresh"
                />
              </div>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => refreshTokenData(true)} 
                disabled={isLoading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                {isLoading ? 'Updating...' : 'Refresh'}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="rounded-md overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[150px]">Name</TableHead>
                    <TableHead className="text-right">Price</TableHead>
                    <TableHead className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="font-medium p-0" 
                        onClick={() => handleSort('change24h')}
                        aria-sort={sortField === 'change24h' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                      >
                        24h Change 
                        <MoveVertical className="ml-1 h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Market Cap</TableHead>
                    <TableHead className="text-right">Volume (24h)</TableHead>
                    <TableHead className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="font-medium p-0" 
                        onClick={() => handleSort('allocation')}
                        aria-sort={sortField === 'allocation' ? (sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'}
                      >
                        Allocation
                        <MoveVertical className="ml-1 h-3 w-3" />
                      </Button>
                    </TableHead>
                  </TableRow>
                </TableHeader>
  
                <TableBody>
                  {paginatedTokens.map((token) => (
                    <TableRow 
                      key={token.id} 
                      className="cursor-pointer hover:bg-white/5"
                      onClick={() => getTokenInsights(token)}
                    >
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 rounded-full bg-gradient-nebula flex items-center justify-center">
                            <span className="font-medium text-xs">{token.symbol.substring(0, 2)}</span>
                          </div>
                          <div>
                            <div className="font-medium">{token.name}</div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs text-muted-foreground font-roboto-mono">{token.symbol}</span>
                              <span 
                                className="text-xs px-2 py-0.5 rounded-full font-medium"
                                style={{ 
                                  backgroundColor: `${categoryColors[token.category]}20`,
                                  color: categoryColors[token.category]
                                }}
                              >
                                {token.category.toUpperCase()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-roboto-mono">
                        ${token.price < 0.01 ? token.price.toFixed(6) : token.price.toFixed(2)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className={`inline-flex items-center ${token.change24h > 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {token.change24h > 0 ? <ArrowUpRight className="h-3 w-3 mr-1" /> : <ArrowDownRight className="h-3 w-3 mr-1" />}
                          <span className="font-roboto-mono">{token.change24h > 0 ? '+' : ''}{token.change24h.toFixed(2)}%</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right font-roboto-mono">
                        {formatNumber(token.marketCap)}
                      </TableCell>
                      <TableCell className="text-right font-roboto-mono">
                        {formatNumber(token.volume)}
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge className="bg-gradient-button">{token.allocation}%</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {paginatedTokens.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No tokens found for this category
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
  
              {totalPages > 1 && (
                <div className="mt-4 flex justify-center">
                  <Pagination>
                    <PaginationContent>
                      <PaginationItem>
                        {currentPage === 1 ? (
                          <PaginationLink
                            aria-disabled="true"
                            className="opacity-50 pointer-events-none"
                          >
                            Previous
                          </PaginationLink>
                        ) : (
                          <PaginationPrevious onClick={goToPreviousPage} />
                        )}
                      </PaginationItem>
                      <PaginationItem>
                        <span className="px-4 py-2">
                          Page {currentPage} of {totalPages}
                        </span>
                      </PaginationItem>
                      <PaginationItem>
                        {currentPage === totalPages ? (
                          <PaginationLink
                            aria-disabled="true"
                            className="opacity-50 pointer-events-none"
                          >
                            Next
                          </PaginationLink>
                        ) : (
                          <PaginationNext onClick={goToNextPage} />
                        )}
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        {/* Token Insights Dialog */}
        <Dialog open={!!selectedToken} onOpenChange={(open) => !open && setSelectedToken(null)}>
          <DialogContent className="sm:max-w-[600px] bg-cosmic-900 border-cosmic-700">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                {selectedToken && (
                  <>
                    <div className="h-8 w-8 rounded-full bg-gradient-nebula flex items-center justify-center mr-2">
                      <span className="font-medium text-xs">{selectedToken.symbol.substring(0, 2)}</span>
                    </div>
                    {selectedToken.name} ({selectedToken.symbol}) Insights
                  </>
                )}
              </DialogTitle>
            </DialogHeader>
            <div className="py-4 px-2">
              {isInsightLoading ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <RefreshCw className="h-8 w-8 animate-spin mb-4 text-nebula-400" />
                  <p className="text-muted-foreground">Generating AI insights...</p>
                </div>
              ) : tokenInsight ? (
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap">{tokenInsight}</div>
                </div>
              ) : (
                <p className="text-center text-muted-foreground">No insights available</p>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  };
  
  export default TokenTable;