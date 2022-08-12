import { useState } from "react";
import { tokenAbi, tokenAddress } from "../constants";
import { NFTStorage, File } from "nft.storage";
import { getDatabase, ref, set } from "firebase/database";
import Web3 from "web3";

export default function MintNft() {
  const web3 = new Web3(window.ethereum);
  const account = "0x39a475635b9D73e7dD8336B035781d0C51Ec367a";
  const tokenAddr = tokenAddress[0];

  const [tokenId, setTokenId] = useState();
  const [tokenName, setTokenName] = useState("");
  const [tokenUri, setTokenUri] = useState("");
  const [file, setFile] = useState(null);

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);

    reader.onloadend = () => {
      setFile(Buffer(reader.result));
    };

    e.preventDefault();
  };

  const setMetadata = async () => {
    try {
      const NFT_STORAGE_TOKEN = "";
      const client = new NFTStorage({ token: NFT_STORAGE_TOKEN });
      const metadata = await client.store({
        name: tokenName,
        image: new File(file, tokenName),
      });
      setTokenUri(metadata.url.slice(7));
    } catch (err) {
      console.error(err);
    }
  };

  const dbUpload = () => {
    try {
      const db = getDatabase();
      set(ref(db, `Dummy/Tokenlist/${tokenId}`), {
        nftAddress: tokenAddr,
        tokenId: tokenId,
        tokenName: tokenName,
        price: null,
        sell: false,
        owner: account,
        tokenUri: tokenUri,
      });
    } catch (err) {
      console.log(err);
    }
  };

  const mintToken = async () => {
    setMetadata();

    try {
      const tokenContract = new web3.eth.Contract(tokenAbi, tokenAddr, {
        from: account,
        to: tokenAddr,
        gasLimit: 3000000,
      });

      tokenContract.once("NftMinted", async function (err, evt) {
        setTokenId(await evt.returnValues.tokenId);
      });
      await tokenContract.methods.mintNft(tokenUri).send();
      console.log("Token Minted!");
    } catch (err) {
      console.error(err);
    }

    dbUpload();
  };

  return (
    <div>
      <form>
        <input type="file" name="data" onChange={retrieveFile} />
        <input type="text" onChange={setTokenName(this.data)} />
        <button
          onClick={() => {
            mintToken();
          }}
        >
          mint
        </button>
      </form>
    </div>
  );
}
