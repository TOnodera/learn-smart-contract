// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract MyERC20 is ERC20 {
    constructor() ERC20("MyERC20", "ME2") {
        // トークンを作成者に1000000渡す
        _mint(msg.sender, 1000000);
    }
}
