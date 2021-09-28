import { ethers } from "ethers";
import { Pool } from "@uniswap/v3-sdk";
import { Address } from "cluster";

require('dotenv').config();

const API_ENDPOINT_INFURA_ETH = process.env.API_ENDPOINT_INFURA_ETH;
const API_ENDPOINT_INFURA_OPTI = process.env.API_ENDPOINT_INFURA_OPTI;
const API_ENDPOINT_INFURA_ARBITRUM = process.env.API_ENDPOINT_INFURA_ARBITRUM;

const provider = new ethers.providers.JsonRpcProvider(API_ENDPOINT_INFURA_ARBITRUM);

const USDC_ETH_300_Address_ETH = "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8";
const DAI_ETH_300_Address_ETH = "0xc2e9f25be6257c210d7adf0d4cd6e3e881ba25f8";
const ETH_DAI_300_Address_OPTI = "0x2e9c575206288f2219409289035facac0b670c2f";
const ETH_USDC_300_Address_ARB = '0x17c14d2c404d167802b16c450d3c99f88f2c4f4d';


const poolImmutablesAbi = [
    "function factory() external view returns (address)",
    "function token0() external view returns (address)",
    "function token1() external view returns (address)",
    "function fee() external view returns (uint24)",
    "function tickSpacing() external view returns (int24)",
    "function maxLiquidityPerTick() external view returns (uint128)",
  ];

const poolContract = new ethers.Contract(
  ETH_USDC_300_Address_ARB,
  poolImmutablesAbi,
  provider
);

interface Immutables {
    factory: Address;
    token0: Address;
    token1: Address;
    fee: number;
    tickSpacing: number;
    maxLiquidityPerTick: number;
  }

async function getPoolImmutables() {
    const PoolImmutables: Immutables = {
      factory: await poolContract.factory(),
      token0: await poolContract.token0(),
      token1: await poolContract.token1(),
      fee: await poolContract.fee(),
      tickSpacing: await poolContract.tickSpacing(),
      maxLiquidityPerTick: await poolContract.maxLiquidityPerTick(),
    };
    return PoolImmutables;
  }

getPoolImmutables().then((result) => {
    console.log(result);
  });