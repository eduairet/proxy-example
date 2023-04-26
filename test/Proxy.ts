import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect } from 'chai';
import { ethers } from 'hardhat';
import { Contract, ContractFactory } from 'ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers.js';
const { getContractFactory } = ethers;

interface ProxyFixture {
    proxy: Contract;
    owner: SignerWithAddress;
}

describe('Lock', function (): void {
    async function deployProxyFixture(): Promise<ProxyFixture> {
        const [owner]: SignerWithAddress[] = await ethers.getSigners();

        const Proxy: ContractFactory = await getContractFactory('Proxy'),
            proxy: Contract = await Proxy.deploy();

        return { proxy, owner };
    }

    describe('Deployment', function (): void {
        it('Should deploy the contract', async function (): Promise<void> {
            const { proxy }: ProxyFixture = await loadFixture(
                deployProxyFixture
            );
            expect(proxy).to.haveOwnProperty('address');
        });
    });
});
