import { loadFixture } from '@nomicfoundation/hardhat-network-helpers';
import { expect, assert } from 'chai';
import { ethers } from 'hardhat';
import { Contract, BigNumberish } from 'ethers';
import {
    Proxy__factory,
    Proxy,
    Logic1__factory,
    Logic1,
    Logic2__factory,
    Logic2,
} from '../typechain-types';
const { getContractFactory, getContractAt, provider } = ethers;

interface ProxyFixture {
    proxy: Proxy;
    logic1: Logic1;
    proxyAsLogic1: Contract | Logic1;
    logic2: Logic2;
    proxyAsLogic2: Contract | Logic2;
}

describe('Proxy', function (): void {
    async function deployFixture(): Promise<ProxyFixture> {
        // Proxy contract
        const Proxy: Proxy__factory = await getContractFactory('Proxy'),
            proxy: Proxy = await Proxy.deploy();
        await proxy.deployed();
        // Logic1 contract
        const Logic1: Logic1__factory = await getContractFactory('Logic1'),
            logic1: Logic1 = await Logic1.deploy();
        await logic1.deployed();
        // Logic2 contract
        const Logic2: Logic2__factory = await getContractFactory('Logic2'),
            logic2: Logic2 = await Logic2.deploy();
        await logic2.deployed();
        // Implementations
        const proxyAsLogic1: Contract | Logic1 = await getContractAt(
            'Logic1',
            proxy.address
        );
        const proxyAsLogic2: Contract | Logic2 = await getContractAt(
            'Logic2',
            proxy.address
        );
        // ProxyFixture
        return { proxy, logic1, proxyAsLogic1, logic2, proxyAsLogic2 };
    }

    describe('Deployment', function (): void {
        it('Should deploy the contracts', async function (): Promise<void> {
            const { proxy, logic1, logic2 } = await loadFixture(deployFixture);
            for (const contract of [proxy, logic1, logic2]) {
                expect(contract).to.haveOwnProperty('address');
            }
        });
        it('Should work with Logic1', async function (): Promise<void> {
            const { proxy, proxyAsLogic1, logic1 } = await loadFixture(
                deployFixture
            );
            await proxy.changeImplementation(logic1.address);
            await proxyAsLogic1.changeX(52);
            assert.equal(await lookupUint(proxy.address, '0x0'), 52);
        });
        it('Should work with upgrades', async function (): Promise<void> {
            const { proxy, logic1, proxyAsLogic1, logic2, proxyAsLogic2 } =
                await loadFixture(deployFixture);
            // Upgrade to Logic1
            await proxy.changeImplementation(logic1.address);
            await proxyAsLogic1.changeX(30);
            assert.equal(await lookupUint(proxy.address, '0x0'), 30);
            // Upgrade to Logic2
            await proxy.changeImplementation(logic2.address);
            await proxyAsLogic2.changeX(100);
            assert.equal(await lookupUint(proxy.address, '0x0'), 100);
        });
        it('Should call a function just included in Logic2', async function (): Promise<void> {
            const { proxy, logic2, proxyAsLogic2 }: ProxyFixture =
                await loadFixture(deployFixture);
            await proxy.changeImplementation(logic2.address);
            await proxyAsLogic2.changeX(50);
            await proxyAsLogic2.tripleX();
            assert.equal(await lookupUint(proxy.address, '0x0'), 150);
        });
        it('Should triple x value changed in the first implementation', async function (): Promise<void> {
            const { proxy, logic1, proxyAsLogic1, logic2, proxyAsLogic2 } =
                await loadFixture(deployFixture);
            // Upgrade to Logic1
            await proxy.changeImplementation(logic1.address);
            await proxyAsLogic1.changeX(30);
            assert.equal(await lookupUint(proxy.address, '0x0'), 30);
            // Upgrade to Logic2
            await proxy.changeImplementation(logic2.address);
            await proxyAsLogic2.tripleX();
            assert.equal(await lookupUint(proxy.address, '0x0'), 90);
        });
    });
});

async function lookupUint(addr: string, slot: BigNumberish): Promise<number> {
    return parseInt(await provider.getStorageAt(addr, slot));
}
