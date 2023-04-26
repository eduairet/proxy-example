# Proxy Contract Example

-   This [contract](./contracts/Proxy.sol) is for educational purposes and it’s not recommended to use it in real life projects
-   Go to [tests](./test/Proxy.ts) to check the way the contract can be updated and how you can use the implemented contracts
    -   It checks that uses `Logic1` to update `x`
    -   It checks that makes an upgrade from `Logic1` to `Logic2` and changes `x` with `Logic2.changeX()`
    -   It checks that `Logic2.tripleX()` can be called
    -   It checks that `x` value set in the first implementation is updated in the second implementation with `Logic2.tripleX()`
-   Try the tests with `npm run test` or `npx hardhat test`
