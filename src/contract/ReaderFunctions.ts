// @ts-nocheck
/* eslint @typescript-eslint/no-unused-vars: off */
/* eslint @typescript-eslint/no-explicit-any: off */
import { ethers } from "ethers";
import store from "../stores";
import { ABI, GetBFContractAddress } from "./bitfighter_constants";

export class ReaderFunctions {


  provider!: ethers.providers.Web3Provider;
  readOnlyContract!: ethers.Contract;

  constructor() {
    if (window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.readOnlyContract = new ethers.Contract(
        GetBFContractAddress(),
        ABI,
        this.provider
      );
    }
  }

  public async fetchTokenOfUserFromSC() {
    const tokenIds = await this.readOnlyContract.getTokensOfUser(
      store.getState().web3store.userAddress
    );
    // console.log("______debug_tokenIds____",
    //   GetBFContractAddress(),
    //   store.getState().web3store.userAddress,
    //   tokenIds
    // );
    return tokenIds;
  }

}
