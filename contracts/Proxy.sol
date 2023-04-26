// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;
import "./StorageSlot.sol";

/**
 * EOE -> Proxy -> Logic1
 *              -> Logic2
 */
contract Proxy {
    // Implementation is the contract with the logic
    function changeImplementation(address _implementation) external {
        /**
         * This will store our implementation address on a slot
         * that doesn't collide with the data stored in our proxy contract,
         * it will also make easier to access our data by slot
         */
        StorageSlot.getAddressSlot(keccak256("impl")).value = _implementation;
    }

    // This function will call any method from the implemented contract
    fallback() external {
        (bool success, ) = StorageSlot
            .getAddressSlot(keccak256("impl"))
            .value
            .delegatecall(msg.data);
        require(success);
    }
}

contract Logic1 {
    uint public x = 0; // 0x0

    function changeX(uint _x) external {
        x = _x;
    }
}

contract Logic2 {
    uint public x = 0; // 0x0

    function changeX(uint _x) external {
        x = _x;
    }

    function tripleX() external {
        x *= 3;
    }
}
