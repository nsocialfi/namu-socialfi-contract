var Namu SocialFiCoin = artifacts.require("./contracts/Namu SocialFiCoin.sol");
var Namu SocialFiCoinMultiSigWallet = artifacts.require("./contracts/Namu SocialFiCoinMultiSigWallet.sol");
var Namu SocialFiCoinMultiSigWalletWithMint = artifacts.require("./contracts/Namu SocialFiCoinMultiSigWalletWithMint.sol");

module.exports = function(deployer, network, accounts) {
  deployer.deploy(Namu SocialFiCoin, 'Namu SocialFi', 'Namu SocialFiCoin', accounts[0], accounts[1], accounts[2]).then( () => {
    console.log(`Namu SocialFiCoin deployed: address = ${Namu SocialFiCoin.address}`);

    deployer.
      deploy(Namu SocialFiCoinMultiSigWallet, [accounts[0], accounts[1], accounts[2]], 2, Namu SocialFiCoin.address,
          "vault multisig wallet");

      deployer.
      deploy(Namu SocialFiCoinMultiSigWalletWithMint, [accounts[0], accounts[1], accounts[2]], 2, Namu SocialFiCoin.address,
          "vault multisig wallet with mint");

  });
};
