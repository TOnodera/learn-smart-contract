// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract MyToken {
    // トークン名
    string public name = "MyToken";
    // トークンの単位を定義
    string public symbol = "MYT";
    // トークンの最大供給量を定義
    uint256 public totalSupply = 1000000;
    // コントラクトのオーナーを定義
    address public owner;

    // トークンの所有者のアドレスと所有量を管理
    mapping(address => uint256) balances;

    // イベント定義
    event Transfer(address indexed _from, address indexed _to, uint256 _values);

    // コンストラクタ
    constructor() {
        // コントラクトの作成者に最大供給量分のトークンを設定
        balances[msg.sender] = totalSupply;
        // オーナーをコントラクト作成者に設定
        owner = msg.sender;
    }

    // トークンを転送する関数
    function transfer(address to, uint256 amount) external {
        // この関数を実行したアドレスの残高に指定したトークン量があるかチェック(assert的な？)
        require(balances[msg.sender] >= amount, "Not Enogh tokens");

        // この関数を実行したアドレスの残高から指定したトークン量を差し引く
        balances[msg.sender] -= amount;
        // 指定したアドレスの残高に指定したトークン量を加える
        balances[to] += amount;

        // イベント発火
        emit Transfer(msg.sender, to, amount);
    }

    // 指定したアドレスの残高を返す
    function balanceOf(address account) external view returns (uint256) {
        return balances[account];
    }
}
