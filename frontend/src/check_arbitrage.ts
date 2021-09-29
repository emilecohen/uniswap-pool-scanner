import * as CSN from "./constants"
import poolCorrespondance from "../../data/mainnet_arbitrum_pools.json"
import {Chain} from "./chains";
import {ethers} from "ethers";
import {getPoolPricesOnChain} from "./pool_prices";

require('dotenv').config();

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;

function build_provider(chain: Chain) {
    let infuraUrl = CSN.HTTPS_PREFIX
    switch (chain) {
        case Chain.Arbitrum:
            infuraUrl += CSN.ARBITRUM_PREFIX
            break
        case Chain.Mainnet:
            infuraUrl += CSN.MAINNET_PREFIX
            break
    }
    const infuraSuffix = CSN.INFURA_SUFFIX + INFURA_PROJECT_ID
    infuraUrl += infuraSuffix
    return new ethers.providers.JsonRpcProvider(infuraUrl)
}


async function getPricesAccrossLayers() {
    for (let pool of poolCorrespondance) {
        let mainnet_pool = pool["mainnet"]
        let mainnet_prices = await getPoolPricesOnChain(mainnet_pool.id, build_provider(Chain.Mainnet))
        let arbitrum_pool = pool["arbitrum"]
        let arbitrum_prices = await getPoolPricesOnChain(arbitrum_pool.id, build_provider(Chain.Arbitrum))
        console.log(mainnet_pool.token0.symbol, mainnet_pool.token1.symbol)
        console.log(mainnet_prices, arbitrum_prices)
    }
}

getPricesAccrossLayers()
