import {Contract, ethers} from "ethers";
import {Pool} from "@uniswap/v3-sdk";
import {Token} from "@uniswap/sdk-core";
import {abi as IUniswapV3PoolABI} from "@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json";
import {Provider} from "@ethersproject/abstract-provider";
import {PoolImmutables, PoolState} from "./pool_interfaces";

async function getPoolImmutables(poolContract: Contract) {
    const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] =
        await Promise.all([
            poolContract.factory(),
            poolContract.token0(),
            poolContract.token1(),
            poolContract.fee(),
            poolContract.tickSpacing(),
            poolContract.maxLiquidityPerTick(),
        ]);

    const immutables: PoolImmutables = {
        factory,
        token0,
        token1,
        fee,
        tickSpacing,
        maxLiquidityPerTick,
    };
    return immutables;
}

async function getPoolState(poolContract: Contract) {
    const [liquidity, slot] = await Promise.all([
        poolContract.liquidity(),
        poolContract.slot0(),
    ]);

    const PoolState: PoolState = {
        liquidity,
        sqrtPriceX96: slot[0],
        tick: slot[1],
        observationIndex: slot[2],
        observationCardinality: slot[3],
        observationCardinalityNext: slot[4],
        feeProtocol: slot[5],
        unlocked: slot[6],
    };

    return PoolState;
}

async function getTokenDecimal(tokenAddress: string, provider: Provider) {
    const abi = [
        "function decimals() view returns (uint256)"
    ];
    const tokenContract = new ethers.Contract(tokenAddress, abi, provider);
    const decimals = await tokenContract.decimals()
    return parseInt(decimals)
}

async function buildPool(poolAddress: string, provider: Provider) {
    const poolContract = new ethers.Contract(
        poolAddress,
        IUniswapV3PoolABI,
        provider
    );
    const [immutables, state] = await Promise.all([
        getPoolImmutables(poolContract),
        getPoolState(poolContract),
    ]);
    const token0Decimals = await getTokenDecimal(immutables.token0, provider)
    const token1Decimals = await getTokenDecimal(immutables.token1, provider)
    const Token0 = new Token(3, immutables.token0, token0Decimals);
    const Token1 = new Token(3, immutables.token1, token1Decimals);

    return new Pool(
        Token0,
        Token1,
        immutables.fee,
        state.sqrtPriceX96.toString(),
        state.liquidity.toString(),
        state.tick
    )

}

export async function getPoolPricesOnChain(poolAddress: string, provider: Provider) {
    const pool = await buildPool(poolAddress, provider)
    const priceToken0 = parseFloat(pool.token0Price.toSignificant())
    const priceToken1 = parseFloat(pool.token1Price.toSignificant())
    return [priceToken0, priceToken1]
}
