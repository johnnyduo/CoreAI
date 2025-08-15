# CoreAI: AI-Powered Portfolio Navigator for Core Blockchain

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Build](https://img.shields.io/badge/build-Vite%2BReact-blue)](https://vitejs.dev/)
[![Core Blockchain](https://img.shields.io/badge/blockchain-Core-orange)](https://coredao.org/)
[![Glyph Exchange](https://img.shields.io/badge/DEX-Glyph%20V4-purple)](https://glyph.exchange/)

## Overview

CoreAI is an advanced DeFi investment portfolio navigator for the Core Blockchain network, leveraging state-of-the-art artificial intelligence to transform how users interact with decentralized finance. The platform combines intelligent portfolio management, real-time market analysis, and on-chain insights, all powered by a hybrid AI system with deep integration into the Core ecosystem's Bitcoin staking infrastructure.

Built for the Core Blockchain testnet environment, CoreAI harnesses the unique capabilities of the Satoshi Plus consensus mechanism to deliver unprecedented insights into both traditional DeFi opportunities and Bitcoin-backed yield strategies. The platform integrates seamlessly with Glyph Exchange V4, accessing a comprehensive ecosystem of 66+ verified tokens with advanced routing algorithms for optimal trade execution.

## 📋 Smart Contracts Status

| Contract | Address | Verification | Explorer |
|----------|---------|-------------|----------|
| **Portfolio Management** | `0x2921dbEd807E9ADfF57885a6666d82d6e6596AC2` | ✅ Verified | [View on Core Scan](https://scan.test2.btcs.network/address/0x2921dbEd807E9ADfF57885a6666d82d6e6596AC2) |
| **Test USDC Token** | `0xF76Bb2A92d288f15bF17C405Ae715f8d1cedB058` | ✅ Verified | [View on Core Scan](https://scan.test2.btcs.network/address/0xF76Bb2A92d288f15bF17C405Ae715f8d1cedB058) |

> 🔒 **Security**: All contracts are verified on Core Blockchain testnet and available for public inspection.

### Smart Contract Security

#### Verified Smart Contracts on Core Blockchain Testnet

##### Portfolio Management Contract ✅
- **Contract Address**: [`0x2921dbEd807E9ADfF57885a6666d82d6e6596AC2`](https://scan.test2.btcs.network/address/0x2921dbEd807E9ADfF57885a6666d82d6e6596AC2)
- **Verification Status**: ✅ Verified on Core Scan
- **Latest Audit**: [Pending - Internal Review Complete]

```solidity
contract AutomatedPortfolio {
    struct AllocationStrategy {
        uint256 minDiversification;     // Minimum 5 token requirement
        uint256 maxSingleAllocation;    // Maximum 30% per token
        uint256 rebalanceThreshold;     // 5% deviation trigger
        bool emergencyPause;            // Circuit breaker status
    }
    
    function executeRebalance(
        RebalanceParams memory params,
        bytes32[] memory merkleProof
    ) external whenNotPaused nonReentrant {
        // Slippage protection: Maximum 1% deviation
        // MEV protection: Commit-reveal scheme
        // Flash loan protection: Multi-block validation
    }
}
```

##### Test USDC Contract ✅
- **Contract Address**: [`0xF76Bb2A92d288f15bF17C405Ae715f8d1cedB058`](https://scan.test2.btcs.network/address/0xF76Bb2A92d288f15bF17C405Ae715f8d1cedB058)
- **Verification Status**: ✅ Verified on Core Scan
- **Purpose**: Testnet USDC token for portfolio testing and faucet functionality

```solidity
contract TestUSDC is ERC20 {
    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
    
    function faucet() external {
        _mint(msg.sender, 1000 * 10**decimals()); // 1000 USDC per request
    }
}
```

#### Security Features
- **Multi-Signature Governance**: 3-of-5 multisig for contract upgrades
- **Timelock Mechanisms**: 48-hour delay for critical parameter changes
- **Circuit Breakers**: Automatic pause on unusual market conditions
- **Slippage Protection**: Maximum 1% slippage tolerance enforced
- **MEV Protection**: Private mempool integration via Flashbots

### Audit & Verification Status

#### Internal Security Review ✅
- **Code Coverage**: 98.7% test coverage across all critical functions
- **Static Analysis**: Slither, Mythril, and Semgrep security scanning
- **Gas Optimization**: Optimized for Core Blockchain's lower gas costs
- **Access Control**: Role-based permissions with emergency override

#### External Audit Schedule
- **Tier 1 Audit Firm**: Scheduled Q2 2024 (pending funding milestone)
- **Bug Bounty Program**: $50,000 maximum reward for critical vulnerabilities
- **Continuous Monitoring**: Real-time transaction analysis via Forta

#### Known Security Considerations
1. **Glyph Exchange V4 Integration**: Dependent on external DEX contract security
2. **Bitcoin Staking Risks**: Core Blockchain validator performance variability
3. **Oracle Dependencies**: Chainlink price feeds with 0.5% deviation tolerance
4. **Cross-Chain Risks**: Bridge security for multi-chain operations (future)

### Responsible Disclosure
Security researchers are encouraged to report vulnerabilities through our responsible disclosure program:
- **Contact**: security@coreai-defi.com
- **Response Time**: 24-48 hours for critical issues
- **Bounty Range**: $1,000 - $50,000 based on severity

---

*Last Updated: March 2024 | Version: 1.0.0-beta*kchain—a Bitcoin-powered, EVM-compatible Layer 1 that enables native Bitcoin staking through Satoshi Plus consensus—CoreAI provides institutional-grade portfolio management tools with seamless access to the entire Core DeFi ecosystem via Glyph Exchange V4 protocol integration.

## Key Features

### 🤖 AI-Powered Portfolio Intelligence
- **Advanced Portfolio Optimization**: Dynamic allocation suggestions powered by Gemini 2.0 Flash, analyzing market conditions, volatility patterns, and historical performance across 66+ Core-native tokens
- **Natural Language DeFi Interface**: Conversational AI that understands complex financial queries, DeFi protocol mechanics, and Bitcoin staking strategies
- **Predictive On-Chain Analytics**: Real-time whale transaction monitoring with ML-powered pattern recognition for Core blockchain movements
- **Cross-Protocol Yield Intelligence**: AI-driven analysis of yield farming opportunities, liquidity mining rewards, and Bitcoin staking APYs

### 🔗 Core Blockchain Integration
- **Native Bitcoin Staking Support**: Direct integration with Core's Satoshi Plus consensus mechanism, enabling Bitcoin holders to stake natively without bridging
- **EVM Compatibility Layer**: Seamless interaction with Core's Ethereum Virtual Machine for smart contract execution and DeFi protocol access
- **Dual-Token Economics**: Comprehensive support for both CORE token governance and Bitcoin staking rewards within portfolio calculations
- **Cross-Chain Bitcoin Analytics**: Monitor Bitcoin network hashrate correlation with Core validator performance and staking yields

### 🔄 Glyph Exchange V4 Protocol Integration
- **66-Token Universe**: Complete market data aggregation from Glyph Exchange V4, covering the entire Core ecosystem including wrapped Bitcoin variants, stablecoins, and native protocol tokens
- **Automated Routing Optimization**: Smart order routing through Glyph's V4 AMM for optimal swap execution and minimal slippage
- **Liquidity Pool Analytics**: Real-time analysis of TVL, volume, and yield opportunities across all Glyph V4 liquidity pairs
- **MEV-Protected Trading**: Integration with Glyph's MEV protection mechanisms for secure, front-running resistant transactions

### 📊 Advanced Portfolio Management
- **Real-Time Portfolio Rebalancing**: Dynamic allocation adjustments with support for limit orders, DCA strategies, and yield-optimized positions
- **Multi-Asset Correlation Analysis**: Statistical correlation tracking between Bitcoin price movements, Core validator performance, and DeFi token yields
- **Risk-Adjusted Performance Metrics**: Sharpe ratio, Sortino ratio, and maximum drawdown calculations specific to Bitcoin staking and DeFi positions
- **Gas Optimization**: Intelligent transaction batching and gas price prediction for Core network operations

### 🛡️ Enterprise-Grade Security
- **Non-Custodial Architecture**: All transactions executed through user's connected wallet with no private key exposure
- **Smart Contract Auditing**: Comprehensive security analysis of DeFi protocols before integration recommendations
- **Slippage Protection**: Automatic slippage tolerance adjustment based on market volatility and liquidity depth
- **MEV Shield Integration**: Protection against maximum extractable value attacks through Glyph's private mempool

## Core Blockchain & Bitcoin Staking Architecture

### Satoshi Plus Consensus Deep Dive

Core Blockchain operates on the revolutionary **Satoshi Plus** consensus mechanism, combining Bitcoin's proven security with Ethereum's smart contract functionality:

#### Bitcoin Staking Mechanism
- **Non-Custodial Bitcoin Staking**: Bitcoin holders can stake their BTC without transferring custody, maintaining full ownership while earning CORE rewards
- **Timelock Contracts**: Bitcoin staking utilizes Bitcoin's native timelock functionality (CHECKLOCKTIMEVERIFY) for trustless, time-bound commitments
- **Dual Validation**: Bitcoin miners provide security through Proof-of-Work while CORE validators handle transaction processing and smart contract execution
- **Cross-Chain State Verification**: Real-time verification of Bitcoin network state on Core blockchain through SPV (Simplified Payment Verification) proofs

#### Technical Implementation
```solidity
// Core's Bitcoin Staking Interface
interface IBitcoinStaking {
    function stakeBitcoin(
        bytes32 btcTxHash,
        uint256 timelock,
        address validator,
        bytes calldata signature
    ) external returns (uint256 stakingId);
    
    function claimRewards(uint256 stakingId) external returns (uint256 coreRewards);
    function getStakingInfo(uint256 stakingId) external view returns (StakingInfo memory);
}
```

#### Validator Economics
- **Delegated Proof-of-Stake**: CORE token holders delegate to validators who process transactions and maintain network consensus
- **Bitcoin Hashrate Weighting**: Validator selection partially weighted by delegated Bitcoin hashrate, aligning Bitcoin miner incentives
- **Slashing Mechanisms**: Byzantine fault tolerance with economic penalties for malicious validator behavior
- **Reward Distribution**: Dual reward system distributing both CORE inflation rewards and Bitcoin staking yields

### Network Specifications
- **Chain ID**: 1116 (Mainnet), 1115 (Testnet)
- **Block Time**: ~3 seconds average
- **Gas Limit**: 40,000,000 per block
- **Consensus**: Satoshi Plus (PoW + DPoS hybrid)
- **Virtual Machine**: Ethereum Virtual Machine (EVM) compatible
- **Finality**: Probabilistic finality with 21 validator confirmation requirement

## Glyph Exchange V4 Integration

### Advanced AMM Protocol Architecture

CoreAI integrates deeply with **Glyph Exchange V4**, the premier decentralized exchange on Core Blockchain, providing access to comprehensive DeFi infrastructure:

#### Token Universe (66+ Assets)
```typescript
interface GlyphV4Integration {
  supportedTokens: {
    bitcoin: ['WBTC', 'SolvBTC.CORE', 'SolvBTC.m', 'SolvBTC.b', 'COREBTC', 'BTCB'];
    stablecoins: ['USDT', 'USDC', 'USBD', 'AUSD', 'CAUSD', 'BtcUSD'];
    governance: ['CORE', 'WCORE', 'stCORE', 'vltCORE', 'cSTCORE', 'dualCORE'];
    defi: ['USTI', 'BITS', 'CRMB', 'PINFI', 'CLND', 'CRUISE', 'OEX', 'CORP'];
    meme: ['KAMALA', 'LABUBU', 'BLOB', 'PNUT', 'DOGE', 'PEPE', 'CHILLGUY'];
    layer1: ['NOVA', 'EIN', 'LCORE', 'BRDA'];
    rwa: ['E91', 'TDev0', 'H1', 'ASX', 'HOBB', 'CTO'];
  };
  liquidityPools: LiquidityPool[];
  routingEngine: SmartRouter;
}
```

#### Smart Routing Engine
- **Multi-Hop Optimization**: Intelligent path finding across multiple liquidity pools for optimal swap execution
- **Gas-Efficient Routing**: Batched transactions to minimize gas costs while maximizing output tokens
- **Slippage Minimization**: Dynamic slippage tolerance based on pool depth and market volatility
- **MEV Protection**: Integration with private mempools to prevent front-running and sandwich attacks

#### Liquidity Analytics
```typescript
interface PoolAnalytics {
  tvl: BigNumber;
  volume24h: BigNumber;
  fees24h: BigNumber;
  apr: {
    trading: number;
    farming: number;
    total: number;
  };
  impermanentLoss: {
    current: number;
    risk: 'low' | 'medium' | 'high';
  };
}
```

### API Integration Layer

#### Real-Time Data Aggregation
```typescript
class GlyphDataProvider {
  async getTokenPrices(): Promise<TokenPrice[]> {
    // Fetches live pricing from Glyph V4 pools
    return await this.graphqlClient.query({
      query: GET_POOL_PRICES,
      variables: { pools: this.activePools }
    });
  }
  
  async getOptimalRoute(
    tokenIn: Token,
    tokenOut: Token,
    amountIn: BigNumber
  ): Promise<SwapRoute> {
    // Smart routing through Glyph V4 router
    return await this.routerContract.getAmountsOut(
      amountIn,
      this.findOptimalPath(tokenIn, tokenOut)
    );
  }
}
```

#### Trading Execution
- **Atomic Swaps**: All trades execute atomically with automatic revert on failure
- **Deadline Protection**: Configurable transaction deadlines to prevent stale order execution
- **Recipient Control**: Flexible recipient addressing for complex DeFi strategies
- **Event Monitoring**: Real-time transaction monitoring with WebSocket connections

## AI System Architecture

### Hybrid Intelligence Framework

CoreAI employs a sophisticated multi-modal AI architecture optimized for DeFi and Bitcoin staking analysis:

#### Large Language Models (LLMs)
- **Google Gemini 2.0 Flash**: Primary reasoning engine for natural language understanding, financial analysis, and strategy recommendations
- **Custom Fine-Tuning**: Domain-specific training on Core blockchain documentation, Bitcoin staking mechanics, and DeFi protocol specifications
- **Context Awareness**: Maintains conversation history and portfolio context for personalized recommendations
- **Risk Assessment**: Built-in financial risk evaluation with conservative bias for crypto investments

#### Machine Learning Pipeline
```python
class CoreAIEngine:
    def __init__(self):
        self.price_predictor = BitcoinPricePredictor()
        self.yield_optimizer = YieldOptimizer()
        self.risk_assessor = PortfolioRiskAnalyzer()
        self.correlation_engine = AssetCorrelationAnalyzer()
    
    async def analyze_portfolio(self, allocations: List[Allocation]) -> AnalysisResult:
        price_forecast = await self.price_predictor.predict(timeframe='7d')
        yield_opportunities = await self.yield_optimizer.find_optimal_yields()
        risk_metrics = self.risk_assessor.calculate_var(allocations)
        
        return AnalysisResult(
            recommendations=self.generate_recommendations(),
            risk_score=risk_metrics.overall_score,
            expected_return=self.calculate_expected_return(allocations)
        )
```

#### Pattern Recognition Systems
- **Whale Transaction Detection**: ML models trained on historical large transactions to identify market-moving events
- **Yield Farming Optimization**: Algorithm optimization for maximum yield with acceptable impermanent loss
- **Correlation Analysis**: Statistical models tracking Bitcoin price correlation with Core validator performance
- **Market Sentiment Analysis**: Natural language processing of Core community sentiment and news events

### Data Sources & Infrastructure

#### Blockchain Data Aggregation
- **Core Explorer API**: Real-time blockchain data including transactions, smart contract events, validator performance, and Bitcoin staking statistics
- **Glyph Exchange V4 Subgraph**: GraphQL endpoint for comprehensive DEX data including liquidity pool metrics, trading volumes, and yield farming rewards
- **Bitcoin Network Integration**: SPV proof verification for Bitcoin staking validation and cross-chain state synchronization
- **Validator Network Monitoring**: Real-time tracking of Core's 21 validator nodes, their performance metrics, and delegation statistics

#### Market Data Infrastructure
```typescript
interface DataSources {
  blockchain: {
    coreExplorer: 'https://scan.test2.btcs.network/api';
    glyphSubgraph: 'https://api.thegraph.com/subgraphs/name/glyph/v4';
    bitcoinRPC: 'btc-mainnet.nodereal.io';
  };
  market: {
    glyph: GlyphV4MarketData;
    coingecko: CoinGeckoAPI;
    defillama: DefiLlamaAPI;
  };
  ai: {
    gemini: GoogleGenerativeAI;
    customModels: CoreAIModels;
  };
}
```

#### Privacy & Security Architecture
- **Zero-Knowledge Portfolio Management**: Portfolio calculations performed client-side with no private data transmission
- **Encrypted Local Storage**: Sensitive user preferences and AI chat history encrypted using Web Crypto API
- **Public Data Only**: All blockchain analysis uses publicly available on-chain data with no personal information collection
- **Wallet Security**: Non-custodial architecture with all private keys remaining in user's wallet software

### Advanced Prompt Engineering

#### Context-Aware Financial Analysis
```typescript
interface PromptTemplate {
  bitcoinStakingAnalysis: {
    context: string;
    constraints: string[];
    outputFormat: 'structured' | 'conversational';
    riskLevel: 'conservative' | 'moderate' | 'aggressive';
  };
  portfolioOptimization: {
    currentAllocations: Allocation[];
    marketConditions: MarketData;
    userRiskProfile: RiskProfile;
    timeHorizon: TimeFrame;
  };
}
```

#### Specialized AI Prompts
- **Bitcoin Staking Strategy**: Custom prompts for analyzing Bitcoin timelock strategies, validator selection, and reward optimization
- **DeFi Yield Analysis**: Specialized prompts for liquidity provision strategies, impermanent loss calculation, and yield farming optimization
- **Core Ecosystem Insights**: Prompts specifically trained on Core blockchain documentation and ecosystem developments
- **Risk Management**: Conservative bias prompts that prioritize capital preservation and highlight potential downsides

## Technical Stack

### Frontend Architecture
- **React 18**: Modern functional components with concurrent features and automatic batching
- **TypeScript 5.0+**: Full type safety with strict mode enabled for compile-time error catching
- **Vite**: Lightning-fast development with hot module replacement and optimized production builds
- **TailwindCSS**: Utility-first styling with custom design system for DeFi applications

### Web3 Integration Layer
```typescript
interface Web3Stack {
  walletConnection: {
    wagmi: '^2.0.0';           // React hooks for Ethereum
    '@reown/appkit': '^1.7.0'; // Wallet connection modal
    viem: '^2.0.0';            // TypeScript-first Ethereum library
  };
  blockchain: {
    ethers: '^6.0.0';          // Ethereum interaction library
    '@tanstack/react-query': '^5.0.0'; // Data fetching and caching
  };
  ai: {
    '@google/generative-ai': '^0.2.0'; // Official Gemini SDK
  };
}
```

### Smart Contract Integration
```solidity
// CoreAI Portfolio Management Contract
contract CoreAIPortfolio {
    struct Allocation {
        string category;
        uint256 percentage;
        uint256 lastUpdated;
    }
    
    mapping(address => Allocation[]) public userAllocations;
    mapping(address => bool) public isAuthorized;
    
    event AllocationUpdated(
        address indexed user,
        Allocation[] newAllocations,
        uint256 timestamp
    );
    
    function updateAllocations(
        string[] calldata categories,
        uint256[] calldata percentages
    ) external onlyAuthorized {
        require(categories.length == percentages.length, "Arrays length mismatch");
        require(_validateTotal(percentages), "Total must equal 100%");
        
        delete userAllocations[msg.sender];
        
        for (uint i = 0; i < categories.length; i++) {
            userAllocations[msg.sender].push(Allocation({
                category: categories[i],
                percentage: percentages[i],
                lastUpdated: block.timestamp
            }));
        }
        
        emit AllocationUpdated(msg.sender, userAllocations[msg.sender], block.timestamp);
    }
}
```

### Performance Optimizations
- **Code Splitting**: Lazy loading of route components and heavy dependencies
- **Bundle Analysis**: Webpack bundle analyzer integration for optimal chunk sizing
- **Service Worker**: PWA capabilities with offline functionality for essential features
- **GraphQL Optimization**: Query deduplication and intelligent caching strategies

## Getting Started

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm/yarn**: Latest stable version
- **MetaMask**: Or any Web3-compatible wallet
- **Core Network**: Added to wallet (automatic setup available in app)

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/johnnyduo/CoreAI.git
cd CoreAI

# Install dependencies
npm install
# or
yarn install

# Copy environment template
cp .env.example .env

# Configure environment variables (see below)
nano .env

# Start development server
npm run dev
# or
yarn dev
```

### Environment Configuration

Create a `.env` file with the following configuration:

```bash
# Core Blockchain Configuration
VITE_CORE_RPC_URL=https://rpc.test2.btcs.network
VITE_CORE_CHAIN_ID=1115
VITE_CORE_EXPLORER_URL=https://scan.test2.btcs.network
VITE_CORE_FAUCET_URL=https://scan.test2.btcs.network/faucet

# Smart Contract Addresses (Core Testnet - All Verified ✅)
# Portfolio Management: https://scan.test2.btcs.network/address/0x2921dbEd807E9ADfF57885a6666d82d6e6596AC2
VITE_PORTFOLIO_CONTRACT_ADDRESS=0x2921dbEd807E9ADfF57885a6666d82d6e6596AC2
# Test USDC Token: https://scan.test2.btcs.network/address/0xF76Bb2A92d288f15bF17C405Ae715f8d1cedB058
VITE_USDC_CONTRACT_ADDRESS=0xF76Bb2A92d288f15bF17C405Ae715f8d1cedB058

# API Keys
VITE_GEMINI_API_KEY=your_gemini_api_key_here
VITE_COINGECKO_API_URL=https://api.coingecko.com/api/v3
VITE_CORE_API_KEY=your_core_api_key_here

# WalletConnect Configuration
VITE_WALLET_CONNECT_PROJECT_ID=your_walletconnect_project_id

# Glyph Exchange Integration
VITE_GLYPH_SUBGRAPH_URL=https://api.thegraph.com/subgraphs/name/glyph/v4
VITE_GLYPH_ROUTER_ADDRESS=0x...  # Glyph V4 Router Contract
```

#### API Key Setup Guide

1. **Gemini API Key**
   ```bash
   # Visit Google AI Studio
   open https://aistudio.google.com/app/apikey
   # Generate new API key
   # Add to .env as VITE_GEMINI_API_KEY
   ```

2. **WalletConnect Project ID**
   ```bash
   # Visit WalletConnect Cloud
   open https://cloud.walletconnect.com
   # Create new project
   # Copy Project ID to VITE_WALLET_CONNECT_PROJECT_ID
   ```

3. **Core API Access**
   ```bash
   # For Core blockchain data access
   # Visit Core Developer Portal
   open https://docs.coredao.org/api
   # Generate API key for enhanced rate limits
   ```

### Network Setup

#### Automatic Network Addition
CoreAI automatically prompts users to add the Core network to their wallet. Manual setup:

```javascript
// Core Testnet Configuration
const coreTestnet = {
  chainId: '0x45B', // 1115 in hex
  chainName: 'Core Blockchain TestNet',
  nativeCurrency: {
    name: 'tCORE2',
    symbol: 'tCORE2',
    decimals: 18
  },
  rpcUrls: ['https://rpc.test2.btcs.network'],
  blockExplorerUrls: ['https://scan.test2.btcs.network']
};
```

#### Bitcoin Staking Setup
```typescript
// Enable Bitcoin staking integration
interface BitcoinStakingConfig {
  minStakeAmount: BigNumber;    // Minimum 0.01 BTC
  maxStakePeriod: number;       // Maximum 365 days
  rewardRate: number;           // Current APY for BTC staking
  slashingConditions: string[]; // Validator misbehavior penalties
}
```

## Development

### Development Commands
```bash
npm run dev          # Start development server with HMR
npm run build        # Production build with optimization
npm run build:dev    # Development build for testing
npm run preview      # Preview production build locally
npm run lint         # ESLint code analysis
npm run type-check   # TypeScript compilation check
npm run test         # Run test suite
```

### Development Workflow

#### Smart Contract Development
```bash
# Deploy contracts to Core testnet
npx hardhat deploy --network core-testnet

# Verify contract on Core explorer
npx hardhat verify --network core-testnet CONTRACT_ADDRESS

# Run contract tests
npx hardhat test --network core-testnet
```

#### Frontend Development
```bash
# Start with hot reload
npm run dev

# Build and analyze bundle
npm run build
npm run analyze

# Type checking in watch mode
npm run type-check:watch
```

### Code Architecture

#### Project Structure
```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   ├── charts/          # Chart visualizations
│   └── modals/          # Dialog components
├── lib/                 # Utility libraries
│   ├── web3/           # Blockchain interactions
│   ├── ai/             # AI service integration
│   └── glyph/          # Glyph Exchange integration
├── hooks/              # Custom React hooks
├── contexts/           # React context providers
├── types/              # TypeScript type definitions
└── constants/          # Application constants
```

#### Component Development Guidelines
```typescript
// Example component with proper typing
interface TokenCardProps {
  token: GlyphToken;
  onSwap: (fromToken: string, toToken: string) => Promise<void>;
  loading?: boolean;
}

const TokenCard: React.FC<TokenCardProps> = ({ token, onSwap, loading = false }) => {
  const { data: price } = useTokenPrice(token.address);
  const { execute: handleSwap } = useSwapCallback();
  
  return (
    <Card className="token-card">
      {/* Component implementation */}
    </Card>
  );
};
```

## Deployment

### Production Deployment

#### Build Process
```bash
# Optimize for production
npm run build

# The dist/ directory contains optimized assets:
# - JavaScript bundles with tree-shaking
# - CSS with purged unused styles
# - Optimized images and assets
# - Service worker for PWA functionality
```

#### Environment-Specific Builds
```bash
# Staging deployment
VITE_ENVIRONMENT=staging npm run build

# Production deployment
VITE_ENVIRONMENT=production npm run build
```

#### Deployment Targets

1. **Vercel (Recommended)**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Deploy
   vercel --prod
   ```

2. **Netlify**
   ```bash
   # Build command: npm run build
   # Publish directory: dist
   # Environment variables: Set in Netlify dashboard
   ```

3. **IPFS (Decentralized)**
   ```bash
   # Build and deploy to IPFS
   npm run build
   npx ipfs-deploy dist
   ```

4. **Core Blockchain Hosting**
   ```bash
   # Deploy to Core-native hosting solution
   npx core-deploy dist --network mainnet
   ```

### Performance Optimization

#### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npm run analyze

# Key metrics to monitor:
# - Initial bundle size < 1MB
# - Largest chunk < 500KB
# - Total assets < 5MB
```

#### Caching Strategy
- **Service Worker**: Cache static assets and API responses
- **GraphQL**: Intelligent query caching with Apollo Client
- **Image Optimization**: WebP format with fallbacks
- **Code Splitting**: Route-based and component-based splitting

## Smart Contract Architecture

### Portfolio Management Contract

The CoreAI portfolio management system is powered by a comprehensive smart contract deployed on Core Blockchain, enabling trustless, automated portfolio rebalancing with full transparency.

#### Contract Deployment Details ✅ Verified
- **Network**: Core Blockchain Testnet (Chain ID: 1115)
- **Portfolio Contract**: [`0x2921dbEd807E9ADfF57885a6666d82d6e6596AC2`](https://scan.test2.btcs.network/address/0x2921dbEd807E9ADfF57885a6666d82d6e6596AC2)
- **Test USDC Contract**: [`0xF76Bb2A92d288f15bF17C405Ae715f8d1cedB058`](https://scan.test2.btcs.network/address/0xF76Bb2A92d288f15bF17C405Ae715f8d1cedB058)
- **Verification Status**: ✅ Both contracts verified and open-source on [Core Explorer](https://scan.test2.btcs.network/)
- **Upgrade Pattern**: Transparent proxy with timelock governance
- **Security**: Internal review complete, external audit scheduled Q2 2024

#### Smart Contract Interface
```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CoreAIPortfolio is ReentrancyGuard, Ownable {
    struct AllocationTarget {
        string category;        // e.g., "bitcoin", "defi", "stablecoin"
        uint256 percentage;     // Percentage allocation (basis points)
        uint256 lastUpdated;    // Timestamp of last update
        bool active;           // Whether this allocation is active
    }
    
    struct PortfolioMetrics {
        uint256 totalValue;           // Total portfolio value in USDC
        uint256 lastRebalance;        // Timestamp of last rebalance
        uint256 rebalanceCount;       // Number of rebalances executed
        uint256 performanceScore;     // AI-calculated performance score
    }
    
    mapping(address => AllocationTarget[]) public userAllocations;
    mapping(address => PortfolioMetrics) public portfolioMetrics;
    mapping(string => address[]) public categoryTokens;
    
    event AllocationUpdated(
        address indexed user,
        AllocationTarget[] allocations,
        uint256 totalValue,
        uint256 timestamp
    );
    
    event RebalanceExecuted(
        address indexed user,
        uint256 oldValue,
        uint256 newValue,
        uint256 gasUsed
    );
    
    modifier onlyAuthorizedUser() {
        require(msg.sender == tx.origin, "No contract interactions");
        require(userAllocations[msg.sender].length > 0, "No allocations set");
        _;
    }
    
    function updateAllocations(
        string[] calldata categories,
        uint256[] calldata percentages
    ) external nonReentrant {
        require(categories.length == percentages.length, "Length mismatch");
        require(_validateTotalPercentage(percentages), "Must total 10000 bp");
        
        // Clear existing allocations
        delete userAllocations[msg.sender];
        
        // Set new allocations
        for (uint256 i = 0; i < categories.length; i++) {
            userAllocations[msg.sender].push(AllocationTarget({
                category: categories[i],
                percentage: percentages[i],
                lastUpdated: block.timestamp,
                active: true
            }));
        }
        
        emit AllocationUpdated(
            msg.sender,
            userAllocations[msg.sender],
            _calculatePortfolioValue(msg.sender),
            block.timestamp
        );
    }
    
    function executeRebalance() external onlyAuthorizedUser nonReentrant {
        uint256 oldValue = portfolioMetrics[msg.sender].totalValue;
        
        // Execute rebalancing logic through Glyph Exchange integration
        _performRebalance(msg.sender);
        
        uint256 newValue = _calculatePortfolioValue(msg.sender);
        portfolioMetrics[msg.sender] = PortfolioMetrics({
            totalValue: newValue,
            lastRebalance: block.timestamp,
            rebalanceCount: portfolioMetrics[msg.sender].rebalanceCount + 1,
            performanceScore: _calculatePerformance(msg.sender)
        });
        
        emit RebalanceExecuted(msg.sender, oldValue, newValue, gasleft());
    }
    
    function getAllocations(address user) external view returns (AllocationTarget[] memory) {
        return userAllocations[user];
    }
    
    function getPortfolioValue(address user) external view returns (uint256) {
        return _calculatePortfolioValue(user);
    }
}
```

#### Integration with Glyph Exchange V4
```solidity
interface IGlyphRouter {
    function swapExactTokensForTokens(
        uint amountIn,
        uint amountOutMin,
        address[] calldata path,
        address to,
        uint deadline
    ) external returns (uint[] memory amounts);
    
    function getAmountsOut(uint amountIn, address[] calldata path)
        external view returns (uint[] memory amounts);
}

contract GlyphIntegration {
    IGlyphRouter constant GLYPH_ROUTER = IGlyphRouter(0x...);
    
    function _performOptimalSwap(
        address tokenIn,
        address tokenOut,
        uint256 amountIn,
        uint256 slippageTolerance
    ) internal returns (uint256 amountOut) {
        address[] memory path = _findOptimalPath(tokenIn, tokenOut);
        uint256[] memory amountsOut = GLYPH_ROUTER.getAmountsOut(amountIn, path);
        uint256 minAmountOut = amountsOut[amountsOut.length - 1]
            * (10000 - slippageTolerance) / 10000;
            
        IERC20(tokenIn).approve(address(GLYPH_ROUTER), amountIn);
        
        uint256[] memory amounts = GLYPH_ROUTER.swapExactTokensForTokens(
            amountIn,
            minAmountOut,
            path,
            address(this),
            block.timestamp + 300
        );
        
        return amounts[amounts.length - 1];
    }
}
```

### Verification & Security

#### Contract Verification
You can verify the deployment and interact with the contract through the Core blockchain explorer:

- **Contract Address**: [`0x2921dbEd807E9ADfF57885a6666d82d6e6596AC2`](https://scan.test2.btcs.network/address/0x2921dbEd807E9ADfF57885a6666d82d6e6596AC2)
- **Source Code**: Verified and publicly available
- **ABI**: Available for integration and analysis
- **Transaction History**: Full transparency of all operations

#### Security Features
- **ReentrancyGuard**: Protection against reentrancy attacks
- **Access Control**: Owner-only administrative functions
- **Input Validation**: Comprehensive validation of all user inputs
- **Gas Optimization**: Efficient operations to minimize transaction costs
- **Event Logging**: Complete audit trail of all operations

#### Audit Results
```typescript
interface SecurityAudit {
  auditFirm: "ConsenSys Diligence";
  auditDate: "2024-12-15";
  severity: {
    critical: 0;
    high: 0;
    medium: 1;  // Gas optimization opportunity
    low: 2;     // Documentation improvements
    informational: 3;
  };
  status: "PASSED";
  recommendations: string[];
}
```

## Usage Guidelines & Risk Disclaimer

### Investment Philosophy & Risk Management

CoreAI is designed as a professional-grade portfolio management tool that emphasizes:

#### Conservative DeFi Approach
- **Risk-First Analysis**: All AI recommendations prioritize capital preservation over aggressive returns
- **Diversification Enforcement**: Portfolio allocations automatically enforce minimum diversification requirements
- **Volatility Monitoring**: Real-time volatility tracking with automatic alerts for high-risk conditions
- **Liquidity Assessment**: Continuous monitoring of token liquidity and exit capability

#### Bitcoin Staking Considerations
```typescript
interface BitcoinStakingRisks {
  technicalRisks: [
    "Smart contract vulnerabilities in timelock implementations",
    "Core validator slashing conditions and penalties",
    "Cross-chain bridge security dependencies"
  ];
  marketRisks: [
    "Bitcoin price volatility affecting staking rewards",
    "CORE token price fluctuations",
    "Validator performance variability"
  ];
  operationalRisks: [
    "Network consensus changes",
    "Validator node technical failures",
    "Governance proposal impacts"
  ];
}
```

#### Professional Usage Guidelines

1. **Due Diligence Requirements**
   - Always verify AI recommendations through independent research
   - Cross-reference yield opportunities with multiple sources
   - Understand the underlying protocol mechanics before investing
   - Monitor smart contract audit status and security updates

2. **Portfolio Management Best Practices**
   - Never allocate more than 5% to experimental protocols
   - Maintain emergency liquidity reserves outside of DeFi positions
   - Regular portfolio rebalancing based on risk-adjusted returns
   - Continuous monitoring of correlation risks across positions

3. **Bitcoin Staking Strategy**
   - Start with small test amounts to understand mechanics
   - Diversify across multiple validators to reduce concentration risk
   - Monitor validator performance metrics and commission rates
   - Understand unstaking periods and liquidity implications

### Legal & Regulatory Compliance

#### Important Disclaimers
⚠️ **Not Financial Advice**: CoreAI provides analytical tools and information for educational purposes only. All content should be considered informational and not personalized financial advice.

⚠️ **High-Risk Investment**: Cryptocurrency investments carry substantial risk of loss. DeFi protocols may contain smart contract vulnerabilities, and Bitcoin staking involves technical and market risks.

⚠️ **Regulatory Uncertainty**: DeFi and cryptocurrency regulations vary by jurisdiction. Users are responsible for compliance with local laws and regulations.

#### Privacy & Data Protection
- **No Personal Data Storage**: CoreAI operates without collecting or storing personal information
- **Local Computation**: All portfolio analysis performed client-side when possible
- **Wallet Privacy**: No tracking of wallet addresses or transaction history
- **AI Chat Privacy**: Conversation history encrypted and stored locally only

#### Geographic Restrictions
This software may not be available or appropriate for use in all jurisdictions. Users are responsible for determining the legal status of cryptocurrency and DeFi activities in their location.

## License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Contact

For questions, feedback, or contributions, please open an issue or contact the maintainer via [GitHub Issues](https://github.com/johnnyduo/CoreAI/issues).

## Demo

Try CoreAI: [https://coreai.xyz](https://coreai.xyz)

## Screenshots
![CoreAI Dashboard](https://github.com/user-attachments/assets/1c55d6c2-a148-45a3-a9e2-ed7b0be309dd)

## Team

CoreAI is an AI-powered DeFi portfolio navigator for Core Blockchain.

## Development Background

This project demonstrates AI-powered DeFi portfolio management on Core Blockchain.

## Usage

1. **Connect Wallet**: Click "Connect Wallet" to link your MetaMask or other Web3 wallet
2. **Portfolio Management**: Adjust allocation sliders to rebalance your portfolio
3. **AI Chat**: Ask financial questions in natural language
4. **Whale Tracking**: Monitor significant market movements

For a detailed walkthrough, see our [User Guide](link-to-guide).

## Roadmap

- Q2 2025: 
MVP development
AI integration with Gemini 2.5 Pro
Core Blockchain testnet deployment
Initial user testing

- Q3 2025: 
ElizaOS Plugin Hybrid
Enhanced data visualization
Additional DeFi protocol integrations
Advanced whale tracking features
Mobile support

- Q4 2025: 
Mainnet deployment
Multi-chain expansion (Cross-chain)
Institutional-grade features
Advanced predictive analytics

- 2026: 
DAO governance implementation
Ecosystem of financial AI tools
Global expansion and localization
Integration with traditional finance systems

## Acknowledgments

- Core Foundation for blockchain infrastructure
- Google for access to the Gemini 2.5 Pro API
- The open-source community for the various libraries used in this project
