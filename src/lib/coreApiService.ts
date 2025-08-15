// src/lib/coreApiService.ts
import axios from 'axios';

// Core API configuration
const CORE_API_KEY = import.meta.env.VITE_CORE_API_KEY;
const CORE_MAINNET_API_URL = 'https://api.coredao.org/api';
const CORE_TESTNET_API_URL = 'https://api.test2.btcs.network/api';
const CORE_PRICE_API_URL = 'https://openapi.coredao.org/api';

// Types for Core API responses
export interface CorePriceResponse {
  status: string;
  result: {
    corebtc: string;
    corebtc_timestamp: string;
    coreusd: string;
    coreusd_timestamp: string;
  };
  message: string;
}

// BTC Staking API Types
export interface BTCStakingResponse {
  code: number;
  data: {
    btcStaked: string;
    stakingScore: string;
    power: string;
    totalReward: string;
    validators: number;
    delegators: number;
    validatorStaked: string;
    delegatorStaked: string;
    avgAPY: string;
  };
  msg: string;
}

export interface BTCStakingData {
  btcStaked: number;
  stakingScore: number;
  totalPower: number;
  totalReward: number;
  validatorCount: number;
  delegatorCount: number;
  validatorStaked: number;
  delegatorStaked: number;
  averageAPY: number;
  totalValueUSD: number;
}
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
 * Get latest Core price from official API
 */
export const getCorePrice = async (): Promise<{ usd: number; btc: number; timestamp: number }> => {
  try {
    const requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow"
    };

    const response = await fetch(`${CORE_PRICE_API_URL}/stats/last_core_price`, requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data: CorePriceResponse = await response.json();
    
    if (data.status === "1" && data.result) {
      return {
        usd: parseFloat(data.result.coreusd),
        btc: parseFloat(data.result.corebtc),
        timestamp: parseInt(data.result.coreusd_timestamp)
      };
    } else {
      throw new Error(`API error: ${data.message || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error fetching Core price from official API:', error);
    // Return fallback values
    return {
      usd: 1.20,
      btc: 0.000004,
      timestamp: Date.now()
    };
  }
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
    },
    // BTC Staking Transactions via Satoshi Plus
    {
      hash: '0xbtc1234567890abcdef1234567890abcdef123456',
      from: '0x1A2B3C4D5E6F7890ABCDEF1234567890ABCDEF12',
      to: '0x0000000000000000000000000000000000000001', // Staking contract
      value: '1000000000000000000000', // 1000 BTC worth in CORE equivalent
      valueUSD: 65000000, // ~$65M BTC staking
      timestamp: now - 450000,
      blockNumber: '25123450',
      type: 'contract',
      tokenSymbol: 'BTC',
      tokenName: 'Bitcoin (Staked)',
      gasUsed: '180000',
      gasPrice: '25000000000'
    },
    {
      hash: '0xbtc2abcdef1234567890abcdef1234567890abcdef',
      from: '0x9F8E7D6C5B4A39281726354ABCDEF1234567890A',
      to: '0x0000000000000000000000000000000000000001', // Staking contract
      value: '500000000000000000000', // 500 BTC worth in CORE equivalent
      valueUSD: 32500000, // ~$32.5M BTC staking
      timestamp: now - 750000,
      blockNumber: '25123435',
      type: 'contract',
      tokenSymbol: 'BTC',
      tokenName: 'Bitcoin (Staked)',
      gasUsed: '160000',
      gasPrice: '23000000000'
    },
    {
      hash: '0xbtc3fedcba0987654321fedcba0987654321fedcba',
      from: '0x0000000000000000000000000000000000000001', // Staking rewards
      to: '0x1A2B3C4D5E6F7890ABCDEF1234567890ABCDEF12',
      value: '50000000000000000000', // 50 BTC rewards
      valueUSD: 3250000, // ~$3.25M BTC rewards
      timestamp: now - 1200000,
      blockNumber: '25123420',
      type: 'internal',
      tokenSymbol: 'BTC',
      tokenName: 'Bitcoin (Rewards)',
      gasUsed: '95000',
      gasPrice: '20000000000'
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
 * Get BTC staking summary from Core DAO API
 */
export const getBTCStakingData = async (): Promise<BTCStakingData> => {
  try {
    const requestOptions: RequestInit = {
      method: "GET",
      redirect: "follow"
    };

    const response = await fetch("https://staking-api.coredao.org/staking/summary/overall", requestOptions);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result: BTCStakingResponse = await response.json();
    
    if (result.code === 200 && result.data) {
      const data = result.data;
      
      // Get current BTC price to calculate USD values
      const btcPrice = 65000; // You can integrate with a BTC price API
      
      return {
        btcStaked: parseFloat(data.btcStaked),
        stakingScore: parseFloat(data.stakingScore),
        totalPower: parseFloat(data.power),
        totalReward: parseFloat(data.totalReward),
        validatorCount: data.validators,
        delegatorCount: data.delegators,
        validatorStaked: parseFloat(data.validatorStaked),
        delegatorStaked: parseFloat(data.delegatorStaked),
        averageAPY: parseFloat(data.avgAPY),
        totalValueUSD: parseFloat(data.btcStaked) * btcPrice
      };
    } else {
      throw new Error(`API error: ${result.msg || 'Unknown error'}`);
    }
  } catch (error) {
    console.error('Error fetching BTC staking data:', error);
    // Return mock data as fallback
    return {
      btcStaked: 4250.75,
      stakingScore: 89.5,
      totalPower: 156789.25,
      totalReward: 892.33,
      validatorCount: 45,
      delegatorCount: 2834,
      validatorStaked: 3850.50,
      delegatorStaked: 400.25,
      averageAPY: 12.75,
      totalValueUSD: 4250.75 * 65000
    };
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
