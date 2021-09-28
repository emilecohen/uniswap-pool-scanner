import { createClient } from 'urql';
import 'isomorphic-unfetch';

require('dotenv').config();

const API_KEYPOINT_GRT = process.env.API_KEYPOINT_GRT;

const APIURL = `https://gateway.thegraph.com/api/${API_KEYPOINT_GRT}/subgraphs/id/0x9bde7bf4d5b13ef94373ced7c8ee0be59735a298-2`;

const tokensQuery = `
{
    pools(first: 1000, orderBy: volumeUSD, orderDirection: desc) {
      id
     feeTier
     volumeUSD
     totalValueLockedETH
     totalValueLockedUSD
     token0 {
          id
          symbol
          name
          derivedETH
        }
        token1 {
          id
          symbol
          name
          derivedETH
        }
     
    }
   }
`

const client = createClient({
    url: APIURL
  });

async function getPoolsEth() {
    const data = await client.query(tokensQuery).toPromise();
    return data;
}

getPoolsEth().then((result) => {
    console.log(result);
  });