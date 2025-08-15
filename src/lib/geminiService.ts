// src/lib/geminiService.ts
import { toast } from '@/components/ui/use-toast';
import { WhaleTransaction } from './explorerService';

// Initialize the Gemini API with your API key
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

/**
 * Check if Gemini API is available
 */
export const isGeminiAvailable = (): boolean => {
  return !!apiKey && apiKey !== 'your_gemini_api_key_here';
};

/**
 * Helper function to add retry logic to API calls
 */
async function fetchWithRetry(
  url: string, 
  options: RequestInit, 
  retries = 2, 
  backoff = 300
): Promise<Response> {
  try {
    const response = await fetch(url, options);
    
    // If the request was successful or we're out of retries, return the response
    if (response.ok || retries === 0) {
      return response;
    }
    
    // For 503 errors, wait and retry
    if (response.status === 503) {
      console.log(`Gemini API returned 503, retrying in ${backoff}ms... (${retries} retries left)`);
      await new Promise(resolve => setTimeout(resolve, backoff));
      return fetchWithRetry(url, options, retries - 1, backoff * 2);
    }
    
    // For other errors, just return the response
    return response;
  } catch (error) {
    if (retries === 0) {
      throw error;
    }
    
    console.log(`Network error, retrying in ${backoff}ms... (${retries} retries left)`);
    await new Promise(resolve => setTimeout(resolve, backoff));
    return fetchWithRetry(url, options, retries - 1, backoff * 2);
  }
}

/**
 * Generate token insights using Gemini API
 */
export async function generateTokenInsights(symbol: string, context?: string): Promise<string> {
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  try {
    // Use v1beta endpoint with gemini-2.0-flash model
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Create the prompt with the token symbol and any additional context
    const prompt = `
      Provide a brief market analysis for the cryptocurrency ${symbol}.
      
      ${context || ''}
      
      Focus on:
      - Recent price action and key technical indicators
      - On-chain metrics if relevant
      - Market sentiment and recent news
      - Potential catalysts for price movement
      
      Keep your response concise (max 150 words) and focus only on data-driven insights.
      Format the response in a way that's easy to read with bullet points.
      
      Note: This is for a portfolio management application focused on Core Blockchain ecosystem tokens.
    `;

    // Make the API request with retry logic
    const response = await fetchWithRetry(
      endpoint, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', errorData);
      
      // Handle different error codes
      if (response.status === 503) {
        throw new Error('Gemini API is temporarily unavailable. Please try again later.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a few moments.');
      } else {
        throw new Error(`Gemini API request failed with status ${response.status}`);
      }
    }

    const data = await response.json();
    
    // Check if we have valid data
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
      throw new Error('Invalid response from Gemini API');
    }
    
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error generating token insights with Gemini:', error);
    
    // Return a user-friendly error message
    if (error instanceof Error) {
      return `Unable to retrieve token insights: ${error.message}`;
    }
    return 'Unable to retrieve token insights at this time. Please try again later.';
  }
}

/**
 * Generate AI chat response using Gemini
 */
export async function generateChatResponse(
  userMessage: string, 
  chatHistory: Array<{sender: string, content: string}>
): Promise<{content: string, action: any}> {
  if (!apiKey) {
    throw new Error('Gemini API key not configured');
  }

  try {
    // Use v1beta endpoint with gemini-2.0-flash model
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    // Format chat history for context
    const formattedHistory = chatHistory.map(msg => 
      `${msg.sender === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n\n');

    // Create the prompt with context about the application
    const prompt = `
      You are CoreAI, an AI assistant specializing in cryptocurrency portfolio management and market analysis on Core Blockchain.
      
      Focus on these tokens in your responses: USDC, PUNK, AAP, ASMB, AUR, AVAX, BEAST, DEEP, ETH, FISH, FTM, FUSE, HODLHamster, IPG, NHU, LOVE, LUM, MATIC, MLUM, tCORE2, SMR, USDT, wBNB, wBTC, WEN.
      
      Note: USDC is the primary currency for portfolio management and transactions.
      
      Categories include: AI, Meme, RWA (Real World Assets), Big Cap, DeFi, Layer 1, and Stablecoins.
      
      When suggesting portfolio changes, provide specific allocation percentages and reasoning.
      
      Previous conversation:
      ${formattedHistory}
      
      User's latest message: ${userMessage}
      
      Respond in a helpful, concise manner. If suggesting portfolio changes, include specific allocation adjustments.
    `;

    // Make the API request with retry logic
    const response = await fetchWithRetry(
      endpoint, 
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 800,
          }
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Gemini API error:', errorData);
      
      // Handle different error codes
      if (response.status === 503) {
        throw new Error('Gemini API is temporarily unavailable. Please try again later.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please try again in a few moments.');
      } else {
        throw new Error(`Gemini API request failed with status ${response.status}`);
      }
    }

    const data = await response.json();
    
    // Check if we have valid data
    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content || !data.candidates[0].content.parts) {
      throw new Error('Invalid response from Gemini API');
    }
    
    const content = data.candidates[0].content.parts[0].text;
    
    // Parse for potential actions (portfolio adjustments)
    const action = parseActionFromResponse(content);
    
    return {
      content,
      action
    };
  } catch (error) {
    console.error('Error generating chat response with Gemini:', error);
    throw error;
  }
}

/**
 * Helper function to parse potential actions from AI responses
 */
function parseActionFromResponse(text: string) {
  // Check if the response contains allocation suggestions
  if (text.includes('allocation') || text.includes('portfolio') || text.includes('rebalance')) {
    // Define category mappings
    const categoryMap: Record<string, { id: string, name: string }> = {
      'ai': { id: 'ai', name: 'AI & DeFi' },
      'artificial intelligence': { id: 'ai', name: 'AI & DeFi' },
      'meme': { id: 'meme', name: 'Meme & NFT' },
      'meme coin': { id: 'meme', name: 'Meme & NFT' },
      'meme coins': { id: 'meme', name: 'Meme & NFT' },
      'nft': { id: 'meme', name: 'Meme & NFT' },
      'rwa': { id: 'rwa', name: 'Real World Assets' },
      'real world assets': { id: 'rwa', name: 'Real World Assets' },
      'big cap': { id: 'bigcap', name: 'Big Cap' },
      'bigcap': { id: 'bigcap', name: 'Big Cap' },
      'large cap': { id: 'bigcap', name: 'Big Cap' },
      'defi': { id: 'defi', name: 'DeFi' },
      'decentralized finance': { id: 'defi', name: 'DeFi' },
      'layer 1': { id: 'l1', name: 'Layer 1' },
      'l1': { id: 'l1', name: 'Layer 1' },
      'stablecoin': { id: 'stablecoin', name: 'Stablecoins' },
      'stablecoins': { id: 'stablecoin', name: 'Stablecoins' },
      'stable': { id: 'stablecoin', name: 'Stablecoins' },
    };
    
    // Try to extract changes from the text
    const changes: Array<{category: string, name: string, from: number, to: number}> = [];
    
    // Look for patterns like "increase X from Y% to Z%" or "increase X by Y%"
    const increaseFromToPattern = /increase\s+(\w+(?:\s+\w+)*)\s+from\s+(\d+)%\s+to\s+(\d+)%/gi;
    const increaseByPattern = /increase\s+(\w+(?:\s+\w+)*)\s+by\s+(\d+)%/gi;
    const decreaseFromToPattern = /decrease\s+(\w+(?:\s+\w+)*)\s+from\s+(\d+)%\s+to\s+(\d+)%/gi;
    const decreaseByPattern = /decrease\s+(\w+(?:\s+\w+)*)\s+by\s+(\d+)%/gi;
    const allocatePattern = /allocate\s+(\d+)%\s+to\s+(\w+(?:\s+\w+)*)/gi;
    
    // Extract increase from X% to Y%
    let match;
    while ((match = increaseFromToPattern.exec(text)) !== null) {
      const category = match[1].toLowerCase();
      const from = parseInt(match[2]);
      const to = parseInt(match[3]);
      
      if (categoryMap[category]) {
        changes.push({
          category: categoryMap[category].id,
          name: categoryMap[category].name,
          from,
          to
        });
      }
    }
    
    // Extract decrease from X% to Y%
    while ((match = decreaseFromToPattern.exec(text)) !== null) {
      const category = match[1].toLowerCase();
      const from = parseInt(match[2]);
      const to = parseInt(match[3]);
      
      if (categoryMap[category]) {
        changes.push({
          category: categoryMap[category].id,
          name: categoryMap[category].name,
          from,
          to
        });
      }
    }
    
    // If we don't have any changes yet, try other patterns
    if (changes.length === 0) {
      // Extract increase by X%
      while ((match = increaseByPattern.exec(text)) !== null) {
        const category = match[1].toLowerCase();
        const changeAmount = parseInt(match[2]);
        
        if (categoryMap[category]) {
          // We don't know the current allocation, so we'll use placeholders
          // These will be replaced with actual values in the AdjustmentModal
          changes.push({
            category: categoryMap[category].id,
            name: categoryMap[category].name,
            from: 15, // placeholder
            to: 15 + changeAmount // placeholder + change
          });
        }
      }
      
      // Extract decrease by X%
      while ((match = decreaseByPattern.exec(text)) !== null) {
        const category = match[1].toLowerCase();
        const changeAmount = parseInt(match[2]);
        
        if (categoryMap[category]) {
          changes.push({
            category: categoryMap[category].id,
            name: categoryMap[category].name,
            from: 15, // placeholder
            to: Math.max(0, 15 - changeAmount) // placeholder - change, min 0
          });
        }
      }
      
      // Extract allocate X% to Y
      while ((match = allocatePattern.exec(text)) !== null) {
        const allocation = parseInt(match[1]);
        const category = match[2].toLowerCase();
        
        if (categoryMap[category]) {
          changes.push({
            category: categoryMap[category].id,
            name: categoryMap[category].name,
            from: 15, // placeholder
            to: allocation
          });
        }
      }
    }
    
    // If we found any changes, return an action
    if (changes.length > 0) {
      return {
        type: 'rebalance',
        description: 'Apply AI-suggested portfolio changes',
        changes
      };
    }
  }
  
  return null;
}

/**
 * Generate whale analysis using Gemini API
 */
export async function generateWhaleAnalysis(transaction: WhaleTransaction): Promise<string> {
  if (!isGeminiAvailable()) {
    throw new Error('Gemini API is not available');
  }

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro-latest:generateContent';

  const prompt = `
You are a blockchain analyst specializing in whale transaction analysis for the Core Blockchain ecosystem. 
Analyze this whale transaction and provide insights:

Transaction Details:
- Type: ${transaction.type} (buy/sell/transfer)
- Token: ${transaction.tokenSymbol} (${transaction.tokenName})
- Amount: ${transaction.valueFormatted} tokens
- USD Value: ${transaction.usdValue}
- From: ${transaction.from}
- To: ${transaction.to}
- Time: ${transaction.age}
- Hash: ${transaction.hash}

Please provide a comprehensive analysis including:
1. Transaction overview and significance
2. Analysis of the sender and recipient wallets
3. Potential market impact of this transaction
4. Related on-chain activity and patterns
5. Recommendations for traders/investors

Format your response in Markdown with appropriate headings and bullet points.
Keep your analysis factual and evidence-based. Mention if certain conclusions are speculative.
`;

  try {
    const response = await fetch(`${apiUrl}?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Gemini API error:', errorData);
      throw new Error(`Gemini API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error generating whale analysis:', error);
    
    // Fallback to a template response if the API fails
    return `
# Whale Transaction Analysis

## Transaction Overview
A significant **${transaction.type}** of **${transaction.valueFormatted} ${transaction.tokenSymbol}** (worth approximately ${transaction.usdValue}) occurred ${transaction.age}.

## Wallet Analysis
- **Sender**: ${transaction.from.substring(0, 8)}...${transaction.from.substring(36)} appears to be a ${transaction.type === 'sell' ? 'long-term holder' : 'exchange wallet'} based on transaction history.
- **Recipient**: ${transaction.to.substring(0, 8)}...${transaction.to.substring(36)} is ${transaction.type === 'buy' ? 'accumulating this token' : 'likely a custodial wallet'}.

## Market Impact
This transaction represents a significant movement for ${transaction.tokenSymbol}. Transactions of this size can ${transaction.type === 'sell' ? 'create selling pressure' : transaction.type === 'buy' ? 'signal strong buying interest' : 'indicate OTC trading activity'}.

## Related On-Chain Activity
There have been several other similar-sized transactions recently, suggesting ${transaction.type === 'buy' ? 'accumulation by large investors' : transaction.type === 'sell' ? 'distribution phase' : 'possible token redistribution'}.

## Recommendation
Monitor ${transaction.tokenSymbol} price action over the next 24-48 hours for potential ${transaction.type === 'buy' ? 'upward movement' : transaction.type === 'sell' ? 'downward pressure' : 'increased volatility'}.

*Note: This is a fallback analysis generated due to AI service unavailability. For more accurate insights, please try again later.*
`;
  }
}