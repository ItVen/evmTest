// demo
import { createAlchemyWeb3 } from "@alch/alchemy-web3";
import { BigNumber } from "@ethersproject/bignumber";
import axios from "axios";

// Replace with your Alchemy api key:
const apiKey = "IYTlObjyefig7Avf2SrZ0UnEf1ZCWn0a";
const net = "mainnet";
// Initialize an alchemy-web3 instance:
const web3 = createAlchemyWeb3(
  `https://eth-mainnet.g.alchemy.com/v2/${apiKey}`
);
// The wallet address we want to query for NFTs:
const ownerAddr = "0x53afeb120edce5d778cab7de76d34f5fcd92c7d0";

const EnsHost = `https://metadata.ens.domains/${net}`;
async function parseEnsNFT(address, tokenId) {
  const ensUrl = `${EnsHost}/${address}/${tokenId}`;
  var config = {
    method: "get",
    url: ensUrl,
    headers: {
      "Content-Type": "application/json",
    },
  };
  const data = await axios(config);
  console.log(data.data);
  return data.data;
}

async function allNFTs() {
  const nfts = await web3.alchemy.getNfts({
    owner: ownerAddr,
    withMetadata: true,
  });

  console.time("start");
  // Print owner's wallet address:
  console.log("fetching NFTs for address:", ownerAddr);
  console.log("...");

  // Print total NFT count returned in the response:
  console.log("number of NFTs found:", nfts.totalCount);
  console.log("...");
  console.timeEnd("start");

  console.time("nft");
  // Print contract address and tokenId for each NFT:
  const nftsList = [];
  nfts.ownedNfts.forEach(async (nft) => {
    const tokenId = BigNumber.from(nft.id.tokenId).toString();

    const nftData = {
      title: "",
      description: "",
      image: "",
      avatar: "",
    };
    if (nft.contract.address == "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85") {
      const ensNFTData = await parseEnsNFT(
        nft.contract.address,
        nft.id.tokenId
      );
      nftData.title = ensNFTData.name;
      nftData.description = ensNFTData.description;
      nftData.image = ensNFTData.image_url;
      nftData.avatar = ensNFTData.background_image;
      nftsList.push(nftData);
    } else {
      const response = await web3.alchemy.getNftMetadata({
        contractAddress: nft.contract.address,
        tokenId: tokenId,
      });
      nftData.title = response.title;
      nftData.description = response.description;
      nftData.image = response.image;
      nftsList.push(nftData);
    }
    console.log("...", nftsList.length);
  });

  console.timeEnd("nft");
}

allNFTs();
// parseEnsNFT(
//   '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
//   '0x80d3ddec2574b25ee9237c0ca14095c163b335a4b48ffcc717ad882954eeff97',
// );
