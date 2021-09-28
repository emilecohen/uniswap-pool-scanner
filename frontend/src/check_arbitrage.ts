import * as CSN from "./constants"

require('dotenv').config();

const INFURA_PROJECT_ID = process.env.INFURA_PROJECT_ID;

const infuraBaseUrl = CSN.HTTPS_PREFIX + CSN.MAINNET_PREFIX + CSN.INFURA_SUFFIX
const infuraEndpointUrl = infuraBaseUrl + INFURA_PROJECT_ID


const USDC_ETH_300_Address_ETH = "0x8ad599c3a0ff1de082011efddc58f1908eb6e6d8";
const ETH_USDC_300_Address_ARB = '0x17c14d2c404d167802b16c450d3c99f88f2c4f4d';

const DAI_ETH_300_Address_ETH = "0xc2e9f25be6257c210d7adf0d4cd6e3e881ba25f8";
const ETH_DAI_300_Address_OPTI = "0x2e9c575206288f2219409289035facac0b670c2f";

async function main() {
    // Do something regarding arbitrage here, but first need to find  a way to have
    // the chain IDs

}

main()
