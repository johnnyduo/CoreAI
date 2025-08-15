// src/lib/coreDAOService.ts
import { formatEther, formatUnits } from 'ethers';

// Core DAO configuration
const CORE_RPC_URL = 'https://rpc.coredao.org';
const CORE_DAO_API_BASE = 'https://openapi.coredao.org/api';
const API_KEY = '67fc7eb5d61a497287bccefe15895b04';

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

// Make API calls to Core DAO API using correct endpoint format: /api/{module}/{action}
async function makeCoreDAOAPICall(endpoint: string, params: Record<string, string> = {}) {
  try {
    const url = new URL(`${CORE_DAO_API_BASE}/${endpoint}`);
    url.searchParams.set('apikey', API_KEY);
    
    // Add additional parameters
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });

    console.log('Core DAO API call:', url.toString());
    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`API error: ${data.error.message}`);
    }
    
    return data;
  } catch (error) {
    console.error('Core DAO API call failed:', error);
    throw error;
  }
}

// Make RPC calls directly to Core blockchain
async function makeRPCCall(method: string, params: any[] = []) {
  try {
    const response = await fetch(CORE_RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        method,
        params,
        id: 1,
      }),
    });

    if (!response.ok) {
      throw new Error(`RPC request failed: ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(`RPC error: ${data.error.message}`);
    }
    
    return data.result;
  } catch (error) {
    console.error('RPC call failed:', error);
    throw error;
  }
}

/**
 * Get the latest block number using Core DAO API (preferred) or RPC fallback
 */
export const getLatestBlockNumber = async (): Promise<number> => {
  try {
    // Try Core DAO API first with correct endpoint format
    console.log('Fetching latest block number from Core DAO API...');
    const result = await makeCoreDAOAPICall('geth/eth_blockNumber');
    const blockNumber = parseInt(result.result, 16);
    console.log('Latest block number from API:', blockNumber);
    return blockNumber;
  } catch (apiError) {
    console.warn('Core DAO API failed, trying RPC:', apiError);
    
    try {
      // Fallback to RPC
      const result = await makeRPCCall('eth_blockNumber');
      const blockNumber = parseInt(result, 16);
      console.log('Latest block number from RPC:', blockNumber);
      return blockNumber;
    } catch (rpcError) {
      console.error('Both API and RPC failed:', rpcError);
      throw rpcError;
    }
  }
};

/**
 * Get block by number using Core DAO API (preferred) or RPC fallback
 */
export const getBlockByNumber = async (blockNumber: number | string, includeTransactions = true): Promise<CoreDAOBlock | null> => {
  try {
    const hexBlockNumber = typeof blockNumber === 'string' ? blockNumber : ('0x' + blockNumber.toString(16));
    console.log('Fetching block:', hexBlockNumber);
    
    try {
      // Try Core DAO API first
      const result = await makeCoreDAOAPICall('geth/eth_getBlockByNumber', {
        blockNumber: hexBlockNumber,
        includeTransactions: includeTransactions.toString()
      });
      
      if (!result.result) {
        console.log('Block not found in API:', hexBlockNumber);
        return null;
      }
      
      return result.result;
    } catch (apiError) {
      console.warn('Core DAO API failed, trying RPC:', apiError);
      
      // Fallback to RPC
      const result = await makeRPCCall('eth_getBlockByNumber', [hexBlockNumber, includeTransactions]);
      
      if (!result) {
        console.log('Block not found in RPC:', hexBlockNumber);
        return null;
      }
      
      return result;
    }
  } catch (error) {
    console.error('Error fetching block by number:', error);
    return null;
  }
};

/**
 * Get transaction by hash using Core DAO API (preferred) or RPC fallback
 */
export const getTransactionByHash = async (hash: string): Promise<CoreDAOTransaction | null> => {
  try {
    console.log('Fetching transaction:', hash);
    
    try {
      // Try Core DAO API first
      const result = await makeCoreDAOAPICall('geth/eth_getTransactionByHash', { hash });
      
      if (!result.result) {
        console.log('Transaction not found in API:', hash);
        return null;
      }
      
      return result.result;
    } catch (apiError) {
      console.warn('Core DAO API failed, trying RPC:', apiError);
      
      // Fallback to RPC
      const result = await makeRPCCall('eth_getTransactionByHash', [hash]);
      
      if (!result) {
        console.log('Transaction not found in RPC:', hash);
        return null;
      }
      
      return result;
    }
  } catch (error) {
    console.error('Error fetching transaction by hash:', error);
    return null;
  }
};

/**
 * Get internal transactions by block range using Core DAO API
 */
export const getInternalTransactionsByBlockRange = async (
  startBlock: number,
  endBlock: number,
  page = 1,
  offset = 100,
  sort = 'desc'
): Promise<any[]> => {
  try {
    console.log(`Fetching internal transactions from block ${startBlock} to ${endBlock}...`);
    
    const result = await makeCoreDAOAPICall('accounts/internal_txs_by_block_range', {
      startblock: startBlock.toString(),
      endblock: endBlock.toString(),
      page: page.toString(),
      offset: offset.toString(),
      sort: sort
    });
    
    if (!result.result || !Array.isArray(result.result)) {
      console.log('No internal transactions found in the specified block range');
      return [];
    }
    
    console.log(`Found ${result.result.length} internal transactions`);
    return result.result;
    
  } catch (error) {
    console.error('Error fetching internal transactions by block range:', error);
    return [];
  }
};

/**
 * Get recent whale transactions using Core DAO API block range endpoints
 */
export const getRecentWhaleTransactions = async (
  minValueUSD = 2000, // Even lower threshold to capture more activity
  blocksToScan = 1000000, // 🚀 ULTIMATE: 1 MILLION BLOCKS (30-35 days)
  corePrice = 1.20
): Promise<ProcessedWhaleTransaction[]> => {
  try {
    console.log('Attempting to fetch whale transactions using Core DAO API...');
    
    // Step 1: Get latest block number
    let latestBlockNumber;
    try {
      latestBlockNumber = await getLatestBlockNumber();
      console.log('Latest block number:', latestBlockNumber);
    } catch (blockError) {
      console.error('Failed to get latest block number:', blockError);
      throw new Error('Cannot fetch latest block number');
    }
    
    // Step 2: Calculate block range to scan (scan more blocks to find whale transactions)
    const startBlock = Math.max(latestBlockNumber - blocksToScan, 0);
    const endBlock = latestBlockNumber;
    
    console.log(`Scanning blocks from ${startBlock} to ${endBlock} (${blocksToScan} blocks) for whale transactions...`);
    
    // Step 3: Get internal transactions by block range with pagination
    let allWhaleTransactions: ProcessedWhaleTransaction[] = [];
    let page = 1;
    const maxPages = 5; // Limit to prevent too many API calls
    
    while (page <= maxPages) {
      try {
        console.log(`Fetching page ${page} of internal transactions...`);
        
        const internalTxs = await getInternalTransactionsByBlockRange(
          startBlock, 
          endBlock, 
          page, 
          1000, // Get maximum transactions per page
          'desc' // Sort by newest first
        );
        
        if (!internalTxs.length) {
          console.log(`No more transactions found on page ${page}, stopping pagination`);
          break;
        }
        
        console.log(`Page ${page}: Found ${internalTxs.length} internal transactions`);
        
        // Step 4: Process and filter whale transactions
        const pageWhaleTransactions: ProcessedWhaleTransaction[] = [];
        
        for (const tx of internalTxs) {
          try {
            // Skip transactions without value
            if (!tx.value || tx.value === '0' || tx.value === '0x0') {
              continue;
            }
            
            // Convert value from wei to CORE
            const valueInCore = parseFloat(formatEther(tx.value));
            const valueUSD = valueInCore * corePrice;
            
            // Only include transactions above the minimum USD threshold
            if (valueUSD >= minValueUSD) {
              // Parse timestamp - Core DAO API returns readable date strings
              let timestamp = 0;
              if (tx.timeStamp) {
                try {
                  // Try to parse the timestamp string (e.g., "Fri Aug 15 05:25:44 UTC 2025")
                  timestamp = Math.floor(new Date(tx.timeStamp).getTime() / 1000);
                } catch (timeError) {
                  // Fallback to current time if parsing fails
                  timestamp = Math.floor(Date.now() / 1000);
                }
              }
              
              const processedTx: ProcessedWhaleTransaction = {
                hash: tx.hash || tx.transactionHash || '',
                from: tx.from || '',
                to: tx.to || '',
                value: valueInCore.toFixed(8),
                valueUSD: valueUSD,
                timestamp: timestamp,
                blockNumber: tx.blockNumber || '',
                type: tx.type === 'CALL' ? 'internal' : 'transfer',
                tokenSymbol: 'CORE',
                tokenName: 'Core Token',
                gasUsed: tx.gasUsed || tx.gas || '0',
                gasPrice: '0', // Internal transactions don't have gas price
                isRealData: true
              };
              
              pageWhaleTransactions.push(processedTx);
              console.log(`Found whale transaction: ${valueInCore.toFixed(2)} CORE ($${valueUSD.toFixed(2)})`);
            }
          } catch (txError) {
            console.warn(`Error processing transaction:`, txError);
            continue;
          }
        }
        
        allWhaleTransactions = allWhaleTransactions.concat(pageWhaleTransactions);
        
        // If we found enough whale transactions, we can stop
        if (allWhaleTransactions.length >= 20) {
          console.log(`Found enough whale transactions (${allWhaleTransactions.length}), stopping pagination`);
          break;
        }
        
        // If this page had fewer transactions than requested, probably no more pages
        if (internalTxs.length < 1000) {
          console.log(`Page ${page} had fewer than 1000 transactions, probably last page`);
          break;
        }
        
        page++;
        
        // Add delay between pages to respect API rate limits
        await new Promise(resolve => setTimeout(resolve, 200));
        
      } catch (pageError) {
        console.warn(`Error fetching page ${page}:`, pageError);
        break;
      }
    }
    
    if (!allWhaleTransactions.length) {
      console.log('No whale transactions found, trying with lower threshold...');
      // If no whale transactions found, try with much lower threshold
      const lowerThreshold = 1000; // $1000 USD
      console.log(`Retrying with lower threshold: $${lowerThreshold}`);
      
      // Quick retry with different parameters
      const retryTxs = await getInternalTransactionsByBlockRange(
        startBlock, 
        endBlock, 
        1, 
        100, // Smaller batch
        'desc'
      );
      
      for (const tx of retryTxs) {
        try {
          if (!tx.value || tx.value === '0' || tx.value === '0x0') continue;
          
          const valueInCore = parseFloat(formatEther(tx.value));
          const valueUSD = valueInCore * corePrice;
          
          if (valueUSD >= lowerThreshold) {
            let timestamp = 0;
            if (tx.timeStamp) {
              try {
                timestamp = Math.floor(new Date(tx.timeStamp).getTime() / 1000);
              } catch (timeError) {
                timestamp = Math.floor(Date.now() / 1000);
              }
            }
            
            const processedTx: ProcessedWhaleTransaction = {
              hash: tx.hash || '',
              from: tx.from || '',
              to: tx.to || '',
              value: valueInCore.toFixed(8),
              valueUSD: valueUSD,
              timestamp: timestamp,
              blockNumber: tx.blockNumber || '',
              type: 'internal',
              tokenSymbol: 'CORE',
              tokenName: 'Core Token',
              gasUsed: tx.gasUsed || '0',
              gasPrice: '0',
              isRealData: true
            };
            
            allWhaleTransactions.push(processedTx);
            console.log(`Found transaction with lower threshold: ${valueInCore.toFixed(2)} CORE ($${valueUSD.toFixed(2)})`);
          }
        } catch (error) {
          continue;
        }
      }
    }
    
    // Step 5: Sort by value descending and limit results
    const sortedTransactions = allWhaleTransactions
      .sort((a, b) => b.valueUSD - a.valueUSD)
      .slice(0, 50); // Limit to top 50 whale transactions
    
    console.log(`Successfully fetched ${sortedTransactions.length} whale transactions from Core DAO API`);
    
    return sortedTransactions;
    
  } catch (error) {
    console.error('Core DAO API whale transaction fetching failed:', error);
    console.log('Returning empty array - will fallback to mock data in WhaleTracker');
    // Return empty array to trigger fallback to mock data
    return [];
  }
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
    return 1.20; // Fallback price
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
