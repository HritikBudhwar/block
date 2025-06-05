//SPDX-License-Identifier: UNLICENSED

// Solidity files have to start with this pragma.
// It will be used by the Solidity compiler to validate its version.
pragma solidity ^0.8.0;

contract Token {
    string public name = "RD HH Token";
    string public symbol = "RDT";

    uint256 public totalSupply = 100000;

    address public owner;

    mapping (address => uint) balances;

    event Transfer(address indexed _from, address indexed_to, uint256 _value);


    constructor() {
        balances[msg.sender] = totalSupply;
        owner = msg.sender;
    }

    function transfer(address to, uint256 amount) external {
        require(balances[msg.sender] >= amount, "Buddy you go not have enough tokens");
        balances[msg.sender] -= amount;
        balances[to] += amount;

        emit Transfer(msg.sender, to, amount);
    }

    function balanceOf(address account) external view returns (uint256){
        return balances[account];
    }
}