"use strict"

var Namu SocialFiCoin = artifacts.require("./Namu SocialFiCoin.sol");
const theBN = require("bn.js")

/**
 * Namu SocialFiCoin contract tests 2
 */
contract('Namu SocialFiCoin2', function(accounts) {
  const BIG = (v) => new theBN.BN(v)

  const owner = accounts[0];
  const admin = accounts[1];
  const vault = accounts[2];
  const minter = accounts[0];

  const user1 = accounts[4];
  const user2 = accounts[5];
  const user3 = accounts[6];
  const user4 = accounts[7];
  const user5 = accounts[8];

  let coin, OneNamu SocialFiCoinInMinunit, NoOfTokens, NoOfTokensInMinunit;

  const bnBalanceOf = async addr => await coin.balanceOf(addr);
  const bnReserveOf = async addr => await coin.reserveOf(addr);
  const bnAllowanceOf = async (owner, spender) => await coin.allowance(owner, spender);

  const balanceOf = async addr => (await coin.balanceOf(addr)).toString();
  const reserveOf = async addr => (await coin.reserveOf(addr)).toString();
  const allowanceOf = async (owner, spender) => (await coin.allowance(owner,spender)).toString();


  before(async () => {
    coin = await Namu SocialFiCoin.deployed();
    NoOfTokensInMinunit = await coin.totalSupply();
    OneNamu SocialFiCoinInMinunit = await coin.getOneNamu SocialFiCoin();
    NoOfTokens = NoOfTokensInMinunit.div(OneNamu SocialFiCoinInMinunit)
  });

  const clearUser = async user => {
    await coin.setReserve(user, 0, {from: admin});
    await coin.transfer(vault, await bnBalanceOf(user), {from: user});
  };

  beforeEach(async () => {
    await clearUser(user1);
    await clearUser(user2);
    await clearUser(user3);
    await clearUser(user4);
    await clearUser(user5);
  });

  it("reserve and then approve", async() => {
    assert.equal(await balanceOf(user4), "0");

    const OneNamu SocialFiTimesTwoInMinunit = OneNamu SocialFiCoinInMinunit.mul(BIG(2))
    const OneNamu SocialFiTimesTwoInMinunitStr = OneNamu SocialFiTimesTwoInMinunit.toString()

    const OneNamu SocialFiTimesOneInMinunit = OneNamu SocialFiCoinInMinunit.mul(BIG(1))
    const OneNamu SocialFiTimesOneInMinunitStr = OneNamu SocialFiTimesOneInMinunit.toString()

    // send 2 Namu SocialFi to user4 and set 1 Namu SocialFi reserve
    coin.transfer(user4, OneNamu SocialFiTimesTwoInMinunit, {from: vault});
    coin.setReserve(user4, OneNamu SocialFiCoinInMinunit, {from: admin});
    assert.equal(await balanceOf(user4), OneNamu SocialFiTimesTwoInMinunitStr);
    assert.equal(await reserveOf(user4), OneNamu SocialFiCoinInMinunit.toString());

    // approve 2 Namu SocialFi to user5
    await coin.approve(user5, OneNamu SocialFiTimesTwoInMinunit, {from:user4});
    assert.equal(await allowanceOf(user4, user5), OneNamu SocialFiTimesTwoInMinunitStr);

    // transfer 2 Namu SocialFi from user4 to user5 SHOULD NOT BE POSSIBLE
    try {
      await coin.transferFrom(user4, user5, OneNamu SocialFiTimesTwoInMinunit, {from: user5});
      assert.fail();
    } catch(exception) {
      assert.isTrue(exception.message.includes("revert"));
    }

    // transfer 1 Namu SocialFi from user4 to user5 SHOULD BE POSSIBLE
    await coin.transferFrom(user4, user5, OneNamu SocialFiTimesOneInMinunit, {from: user5});
    assert.equal(await balanceOf(user4), OneNamu SocialFiTimesOneInMinunitStr);
    assert.equal(await reserveOf(user4), OneNamu SocialFiTimesOneInMinunitStr); // reserve will not change
    assert.equal(await allowanceOf(user4, user5), OneNamu SocialFiTimesOneInMinunitStr); // allowance will be reduced
    assert.equal(await balanceOf(user5), OneNamu SocialFiTimesOneInMinunitStr);
    assert.equal(await reserveOf(user5), "0");

    // transfer .5 Namu SocialFi from user4 to user5 SHOULD NOT BE POSSIBLE if balance <= reserve
    const halfNamu SocialFiInMinunit = OneNamu SocialFiCoinInMinunit.div(BIG(2));
    try {
      await coin.transferFrom(user4, user5, halfNamu SocialFiInMinunit, {from: user5});
      assert.fail();
    } catch(exception) {
      assert.isTrue(exception.message.includes("revert"));
    }
  })

  it("only minter can call mint", async() => {
      const OneNamu SocialFiTimesTenInMinunit = OneNamu SocialFiCoinInMinunit.mul(BIG(10))
      const OneNamu SocialFiTimesTenInMinunitStr = OneNamu SocialFiTimesTenInMinunit.toString()

      assert.equal(await balanceOf(user4), "0");

      await coin.mint(user4, OneNamu SocialFiTimesTenInMinunit, {from: minter})

      const totalSupplyAfterMintStr = (await coin.totalSupply()).toString()
      assert.equal(totalSupplyAfterMintStr, OneNamu SocialFiTimesTenInMinunit.add(NoOfTokensInMinunit).toString())
      assert.equal(await balanceOf(user4), OneNamu SocialFiTimesTenInMinunitStr);

      try {
          await coin.mint(user4, OneNamu SocialFiTimesTenInMinunit, {from: user4})
          assert.fail();
      } catch(exception) {
          assert.equal(totalSupplyAfterMintStr, OneNamu SocialFiTimesTenInMinunit.add(NoOfTokensInMinunit).toString())
          assert.isTrue(exception.message.includes("revert"));
      }
  })

  it("cannot mint above the mint cap", async() => {
      const OneNamu SocialFiTimes100BilInMinunit = 
              OneNamu SocialFiCoinInMinunit.mul(BIG(100000000000))

      assert.equal(await balanceOf(user4), "0");


      try {
          await coin.mint(user4, OneNamu SocialFiTimes100BilInMinunit, {from: minter})
          assert.fail();
      } catch(exception) {
          assert.isTrue(exception.message.includes("revert"));
      }
  })
});
