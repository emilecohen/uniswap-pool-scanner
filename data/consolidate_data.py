"""
This module finds the common pools between the top 50 pools in mainnet and arbitrum.
This is a POC an can be improved.
We are also doubting our results because there are too few common pools.
"""
from typing import Dict, List
import json


def find_arbitrum_pool_address(mainnet_pool: Dict, arbitrum_pools: List[Dict]):
    """
    Given a Uniswap V3 pool on Mainnet, return it and its corresponding pool on Arbitrum
    """
    token0, token1 = mainnet_pool["token0"]["symbol"], mainnet_pool["token1"]["symbol"]

    for pool in arbitrum_pools:
        if pool["token0"]["symbol"] in (token0, token1):
            if pool["token1"]["symbol"] in (token0, token1):
                # Don't check if fee tiers are the same
                return mainnet_pool, pool
    return None, None


with open("top_50_pools_eth.json", "r") as f:
    mainnet_pool_data = json.load(f)["data"]["pools"]
with open("top_50_pools_arbitrum.json", "r") as f:
    arbitrum_pool_data = json.load(f)["data"]["pools"]

corresponding_pools = []
for mainnet_pool in mainnet_pool_data:
    mainnet_pool, arbitrum_pool = find_arbitrum_pool_address(
        mainnet_pool=mainnet_pool, arbitrum_pools=arbitrum_pool_data
    )
    if mainnet_pool is not None:
        if arbitrum_pool is not None:
            pool_pair = {"mainnet": mainnet_pool, "arbitrum": arbitrum_pool}
            corresponding_pools.append(pool_pair)

with open("corresponding_pools_mainnet_arbitrum.json", "w") as f:
    json.dump(corresponding_pools, f)
print(f"Found {len(corresponding_pools)} corresponding pools")
