// src/lib/coreDAOService.ts
import { formatEther, formatUnits } from 'ethers';

// Core DAO API configuration
// NOTE: Core DAO API blocks ALL browser requests (CORS policy)
// This affects localhost, Vercel, Netlify, and all frontend deployments
// To use real blockchain data, you would need a backend API proxy
const CORE_DAO_API_KEY = import.meta.env.VITE_CORE_API_KEY;
const CORE_DAO_BASE_URL = 'https://openapi.coredao.org/api';

// Use proxy in development to bypass CORS
const getAPIBaseURL = (): string => {
  if (typeof window !== 'undefined' && 
      (window.location.hostname === 'localhost' || 
       window.location.hostname === '127.0.0.1' ||
       window.location.hostname.includes('localhost'))) {
    return '/api/coredao'; // Use Vite proxy
  }
  return CORE_DAO_BASE_URL;
};

// Types for Core DAO API responses
export interface CoreDAOTransaction {
  blockHash: string;
  blockNumber: string;
  from: string;
  gas: string;
  gasPrice: string;
  gasUsed?: string;
  hash: string;
  input: string;
  nonce: string;
  to: string;
  transactionIndex: string;
  value: string;
  type?: string;
  status?: string;
  timestamp?: number;
}

export interface CoreDAOBlock {
  number: string;
  hash: string;
  parentHash: string;
  timestamp: string;
  transactions: string[];
  gasLimit: string;
  gasUsed: string;
  miner: string;
  difficulty: string;
  totalDifficulty: string;
  size: string;
}

export interface ProcessedWhaleTransaction {
  hash: string;
  from: string;
  to: string;
  value: string;
  valueUSD: number;
  timestamp: number;
  blockNumber: string;
  type: 'transfer' | 'internal' | 'contract';
  tokenSymbol?: string;
  tokenName?: string;
  gasUsed: string;
  gasPrice: string;
  isRealData: boolean;
}

// Helper function to create API requests
/**
 * Create API request URL with parameters
 */
const createAPIRequest = (action: string, params: Record<string, string> = {}, module: string = 'geth'): string => {
  const baseURL = getAPIBaseURL();
  
  // For proxy paths (relative URLs), construct manually
  if (baseURL.startsWith('/')) {
    const urlParams = new URLSearchParams();
    
    // Add API key if available
    if (CORE_DAO_API_KEY) {
      urlParams.set('apikey', CORE_DAO_API_KEY);
    }
    
    urlParams.set('module', module);
    urlParams.set('action', action);
    
    // Add additional parameters
    Object.entries(params).forEach(([key, value]) => {
      urlParams.set(key, value);
    });
    
    return `${baseURL}?${urlParams.toString()}`;
  } else {
    // For full URLs, use URL constructor
    const url = new URL(baseURL);
    
    // Add API key if available
    if (CORE_DAO_API_KEY) {
      url.searchParams.set('apikey', CORE_DAO_API_KEY);
    }
    
    url.searchParams.set('module', module);
    url.searchParams.set('action', action);
    
    // Add additional parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
    
    return url.toString();
  }
};

/**
 * Get the latest block number
 */
export const getLatestBlockNumber = async (): Promise<number> => {
  try {
    const url = createAPIRequest('eth_blockNumber');
    console.log('Fetching latest block number from:', url);
    
    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
    
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.text();
    console.log('Latest block number response:', data);
    
    // Parse the response based on the expected format
    if (data.includes('"result"')) {
      const jsonResponse = JSON.parse(data);
      const blockHex = jsonResponse.result;
      return parseInt(blockHex, 16);
    } else {
      // Direct hex response
      return parseInt(data.replace(/["\s]/g, ''), 16);
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error('Latest block number request timed out');
    } else {
      console.error('Error fetching latest block number:', error);
    }
    throw error;
  }
};

/**
 * Get block by number
 */
export const getBlockByNumber = async (blockNumber: number | string, includeTransactions = true): Promise<CoreDAOBlock | null> => {
  try {
    const hexBlockNumber = typeof blockNumber === 'string' ? blockNumber : ('0x' + blockNumber.toString(16));
    const url = createAPIRequest('geth/eth_getBlockByNumber', {
      tag: hexBlockNumber,
      fullTx: includeTransactions.toString()
    });
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const text = await response.text();
    console.log('Block API Response:', text.substring(0, 200) + '...');
    
    // Check if response is empty
    if (!text.trim()) {
      throw new Error('Empty response from Core DAO API');
    }
    
    // Core DAO API returns JSON-RPC format
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parsing failed. Raw response:', text);
      throw new Error(`Failed to parse API response: ${parseError.message}`);
    }
    
    if (jsonResponse.error) {
      throw new Error(`API Error: ${jsonResponse.error.message || 'Unknown error'}`);
    }
    
    return jsonResponse.result;
  } catch (error) {
    console.error('Error fetching block by number:', error);
    return null;
  }
};

/**
 * Get transaction by hash
 */
export const getTransactionByHash = async (hash: string): Promise<CoreDAOTransaction | null> => {
  try {
    const url = createAPIRequest('geth/eth_getTransactionByHash', { hash });
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const text = await response.text();
    
    // Check if response is empty
    if (!text.trim()) {
      throw new Error('Empty response from Core DAO API');
    }
    
    let jsonResponse;
    try {
      jsonResponse = JSON.parse(text);
    } catch (parseError) {
      console.error('JSON parsing failed for transaction. Raw response:', text);
      throw new Error(`Failed to parse API response: ${parseError.message}`);
    }
    
    if (jsonResponse.error) {
      throw new Error(`API Error: ${jsonResponse.error.message || 'Unknown error'}`);
    }
    
    return jsonResponse.result;
  } catch (error) {
    console.error('Error fetching transaction by hash:', error);
    return null;
  }
};

/**
 * Get transaction receipt
 */
export const getTransactionReceipt = async (hash: string): Promise<any> => {
  try {
    const url = createAPIRequest('geth/eth_getTransactionReceipt', { hash });
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching transaction receipt:', error);
    return null;
  }
};

/**
 * Get recent blocks and extract whale transactions
 * NOTE: Core DAO API blocks ALL browser requests (CORS), so this always returns mock data
 */
export const getRecentWhaleTransactions = async (
  minValueUSD = 50000,
  blocksToScan = 5,
  corePrice = 1.20
): Promise<ProcessedWhaleTransaction[]> => {
  // Core DAO API blocks browser requests with CORS policy
  // This affects both localhost AND production (Vercel)
  console.log('🚨 Core DAO API blocks all browser requests due to CORS policy');
  console.log('📝 Returning empty array to trigger mock data fallback');
  console.log('💡 To use real blockchain data, you would need a backend proxy server');
  
  return []; // Always return empty to trigger mock data fallback
};

/**
 * Get Core price - uses CoinGecko API (CORS-friendly for browsers)
 */
export const getCorePrice = async (): Promise<number> => {
  try {
    // Use CoinGecko API (CORS-friendly, works in all browsers)
    console.log('Fetching Core price from CoinGecko...');
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=coredaoorg&vs_currencies=usd');
    
    if (response.ok) {
      const text = await response.text();
      if (text.trim()) {
        const data = JSON.parse(text);
        const price = data?.coredaoorg?.usd;
        if (typeof price === 'number' && price > 0) {
          console.log('Successfully fetched Core price from CoinGecko:', price);
          return price;
        }
      }
    }
    
    throw new Error('CoinGecko API failed');
    
  } catch (error) {
    console.warn('CoinGecko failed:', error);
    console.log('Using fallback price of $1.20');
    return 1.20; // Fallback price - Core DAO API also blocked by CORS
  }
};

/**
 * Format transaction value for display
 */
export const formatTransactionValue = (value: string, decimals = 18): string => {
  try {
    const formatted = formatUnits(value, decimals);
    const num = parseFloat(formatted);
    
    if (num >= 1000000) {
      return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
      return (num / 1000).toFixed(2) + 'K';
    } else {
      return num.toFixed(4);
    }
  } catch (error) {
    return '0';
  }
};

/**
 * Format USD value for display
 */
export const formatUSDValue = (value: number): string => {
  if (value >= 1000000) {
    return '$' + (value / 1000000).toFixed(2) + 'M';
  } else if (value >= 1000) {
    return '$' + (value / 1000).toFixed(2) + 'K';
  } else {
    return '$' + value.toFixed(2);
  }
};

/**
 * Get time ago string from timestamp
 */
export const getTimeAgo = (timestamp: number): string => {
  const now = Math.floor(Date.now() / 1000);
  const diff = now - timestamp;
  
  if (diff < 60) {
    return `${diff}s ago`;
  } else if (diff < 3600) {
    return `${Math.floor(diff / 60)}m ago`;
  } else if (diff < 86400) {
    return `${Math.floor(diff / 3600)}h ago`;
  } else {
    return `${Math.floor(diff / 86400)}d ago`;
  }
};
