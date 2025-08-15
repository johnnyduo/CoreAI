// src/lib/coreApiService.ts
import axios from 'axios';

// Core API configuration
const CORE_API_KEY = import.meta.env.VITE_CORE_API_KEY;
const CORE_MAINNET_API_URL = 'https://api.coredao.org/api';
const CORE_TESTNET_API_URL = 'https://api.test2.btcs.network/api';

// Types for Core API responses
export interface CoreTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  gas: string;
  gasPrice: string;
  gasUsed: string;
  isError: string;
  txreceipt_status: string;
  input: string;
  contractAddress: string;
  cumulativeGasUsed: string;
  confirmations: string;
}

export interface CoreInternalTransaction {
  blockNumber: string;
  timeStamp: string;
  hash: string;
  from: string;
  to: string;
  value: string;
  contractAddress: string;
  input: string;
  type: string;
  gas: string;
  gasUsed: string;
  traceId: string;
  isError: string;
  errCode: string;
}

export interface WhaleTransaction {
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
}

// Helper function to format API requests
const createApiRequest = (endpoint: string, params: Record<string, any> = {}, useMainnet = true) => {
  const baseUrl = useMainnet ? CORE_MAINNET_API_URL : CORE_TESTNET_API_URL;
  const searchParams = new URLSearchParams({
    ...params,
    ...(CORE_API_KEY && { apikey: CORE_API_KEY })
  });
  
  return `${baseUrl}/${endpoint}?${searchParams.toString()}`;
};

/**
 * Get internal transactions by block range for whale tracking
 * This uses Core mainnet for better data availability
 */
export const getInternalTransactionsByBlockRange = async (
  startBlock?: number,
  endBlock?: number,
  limit = 50
): Promise<CoreInternalTransaction[]> => {
  try {
    const params: Record<string, any> = {};
    
    if (startBlock) params.startblock = startBlock.toString();
    if (endBlock) params.endblock = endBlock.toString();
    if (limit) params.limit = limit.toString();
    
    const url = createApiRequest('accounts/internal_txs_by_block_range', params, true);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }
    
    const data = await response.json();
    
    // Handle different response formats
    if (data.status === '1' && Array.isArray(data.result)) {
      return data.result;
    } else if (Array.isArray(data)) {
      return data;
    } else {
      console.warn('Unexpected API response format:', data);
      return [];
    }
  } catch (error) {
    console.error('Error fetching internal transactions:', error);
    return [];
  }
};

/**
 * Get recent whale transactions (large value transfers)
 */
export const getWhaleTransactions = async (
  minValueUSD = 50000,
  limit = 20
): Promise<WhaleTransaction[]> => {
  try {
    // Get recent block range (last 100 blocks)
    const latestBlock = await getLatestBlockNumber();
    const startBlock = Math.max(0, latestBlock - 100);
    
    const internalTxs = await getInternalTransactionsByBlockRange(startBlock, latestBlock, limit * 2);
    
    // Filter for whale transactions and convert to our format
    const whaleTransactions: WhaleTransaction[] = [];
    
    for (const tx of internalTxs) {
      const valueWei = BigInt(tx.value || '0');
      const valueETH = Number(valueWei) / 1e18;
      const valueUSD = valueETH * 1.2; // Assume 1 CORE ≈ $1.2 for estimation
      
      // Only include transactions above the minimum USD threshold
      if (valueUSD >= minValueUSD && tx.value !== '0') {
        whaleTransactions.push({
          hash: tx.hash,
          from: tx.from,
          to: tx.to,
          value: tx.value,
          valueUSD,
          timestamp: parseInt(tx.timeStamp) * 1000,
          blockNumber: tx.blockNumber,
          type: 'internal',
          tokenSymbol: 'CORE',
          tokenName: 'Core Token',
          gasUsed: tx.gasUsed || '0',
          gasPrice: '0' // Internal transactions don't have gas price
        });
      }
    }
    
    // Sort by value (descending) and return top results
    return whaleTransactions
      .sort((a, b) => b.valueUSD - a.valueUSD)
      .slice(0, limit);
      
  } catch (error) {
    console.error('Error fetching whale transactions:', error);
    return [];
  }
};

/**
 * Get latest block number
 */
export const getLatestBlockNumber = async (): Promise<number> => {
  try {
    const url = createApiRequest('proxy/eth_blockNumber', {}, true);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get latest block number: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (data.result) {
      return parseInt(data.result, 16); // Convert hex to decimal
    }
    
    // Fallback to a recent block number if API fails
    return 25000000;
  } catch (error) {
    console.error('Error getting latest block number:', error);
    // Return a reasonable fallback block number
    return 25000000;
  }
};

/**
 * Get account balance
 */
export const getCoreBalance = async (address: string): Promise<string> => {
  try {
    const url = createApiRequest('accounts/balance', { address }, true);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`Failed to get balance: ${response.status}`);
    }
    
    const data = await response.json();
    return data.result || '0';
  } catch (error) {
    console.error('Error getting Core balance:', error);
    return '0';
  }
};

/**
 * Mock whale transactions for development/testing
 */
export const getMockWhaleTransactions = (): WhaleTransaction[] => {
  const now = Date.now();
  
  return [
    {
      hash: '0x1234567890abcdef1234567890abcdef12345678',
      from: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      to: '0x742DfA5aa70a8212857966D491D67B09ce7D6ec7',
      value: '1500000000000000000000000', // 1.5M CORE
      valueUSD: 1800000,
      timestamp: now - 300000,
      blockNumber: '25123456',
      type: 'internal',
      tokenSymbol: 'CORE',
      tokenName: 'Core Token',
      gasUsed: '21000',
      gasPrice: '20000000000'
    },
    {
      hash: '0xabcdef1234567890abcdef1234567890abcdef12',
      from: '0x742DfA5aa70a8212857966D491D67B09ce7D6ec7',
      to: '0x8888888888888888888888888888888888888888',
      value: '800000000000000000000000', // 800K CORE
      valueUSD: 960000,
      timestamp: now - 600000,
      blockNumber: '25123445',
      type: 'transfer',
      tokenSymbol: 'CORE',
      tokenName: 'Core Token',
      gasUsed: '21000',
      gasPrice: '18000000000'
    },
    {
      hash: '0x9876543210fedcba9876543210fedcba98765432',
      from: '0x0000000000000000000000000000000000000000',
      to: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
      value: '500000000000000000000000', // 500K CORE
      valueUSD: 600000,
      timestamp: now - 900000,
      blockNumber: '25123430',
      type: 'contract',
      tokenSymbol: 'CORE',
      tokenName: 'Core Token',
      gasUsed: '150000',
      gasPrice: '22000000000'
    }
  ];
};

/**
 * Format value for display
 */
export const formatCoreValue = (valueWei: string): string => {
  const value = BigInt(valueWei);
  const valueETH = Number(value) / 1e18;
  
  if (valueETH >= 1000000) {
    return `${(valueETH / 1000000).toFixed(2)}M CORE`;
  } else if (valueETH >= 1000) {
    return `${(valueETH / 1000).toFixed(2)}K CORE`;
  } else {
    return `${valueETH.toFixed(4)} CORE`;
  }
};

/**
 * Format USD value for display
 */
export const formatUSDValue = (valueUSD: number): string => {
  if (valueUSD >= 1000000) {
    return `$${(valueUSD / 1000000).toFixed(2)}M`;
  } else if (valueUSD >= 1000) {
    return `$${(valueUSD / 1000).toFixed(0)}K`;
  } else {
    return `$${valueUSD.toFixed(2)}`;
  }
};
