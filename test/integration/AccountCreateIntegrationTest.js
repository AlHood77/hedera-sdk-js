import AccountCreateTransaction from "../src/account/AccountCreateTransaction.js";
import AccountDeleteTransaction from "../src/account/AccountDeleteTransaction.js";
import AccountInfoQuery from "../src/account/AccountInfoQuery.js";
import Hbar from "../src/Hbar.js";
import Status from "../src/Status.js";
import TransactionId from "../../src/transaction/TransactionId.js";
import newClient from "./client/index.js";
import { PrivateKey } from "../src/index.js";

describe("AccountCreate", function () {
    it("should be executable", async function () {
        this.timeout(15000);

        const client = await newClient();
        const operatorId = client.operatorAccountId;
        const key = PrivateKey.generate();

        const response = await new AccountCreateTransaction()
            .setKey(key.publicKey)
            .setInitialBalance(new Hbar(2))
            .execute(client);

        const receipt = await response.getReceipt(client);

        expect(receipt.accountId).to.not.be.null;
        const account = receipt.accountId;

        const info = await new AccountInfoQuery()
            .setNodeAccountIds([response.nodeId])
            .setAccountId(account)
            .execute(client);

        expect(info.accountId.toString()).to.be.equal(account.toString());
        expect(info.isDeleted).to.be.false;
        expect(info.key.toString()).to.be.equal(key.publicKey.toString());
        expect(info.balance.toTinybars().toNumber()).to.be.equal(
            new Hbar(2).toTinybars().toNumber()
        );
        expect(info.autoRenewPeriod.seconds.toNumber()).to.be.equal(7776000);
        expect(info.proxyAccountId).to.be.null;
        expect(info.proxyReceived.toTinybars().toNumber()).to.be.equal(0);

        await (
            await (
                await new AccountDeleteTransaction()
                    .setAccountId(account)
                    .setNodeAccountIds([response.nodeId])
                    .setTransferAccountId(operatorId)
                    .setTransactionId(TransactionId.generate(account))
                    .freezeWith(client)
                    .sign(key)
            ).execute(client)
        ).getReceipt(client);
    });

    it("should be executable with only key set", async function () {
        this.timeout(15000);

        const client = await newClient();
        const operatorId = client.operatorAccountId;
        const key = PrivateKey.generate();

        const response = await new AccountCreateTransaction()
            .setKey(key.publicKey)
            .execute(client);

        const receipt = await response.getReceipt(client);

        expect(receipt.accountId).to.not.be.null;
        const account = receipt.accountId;

        const info = await new AccountInfoQuery()
            .setNodeAccountIds([response.nodeId])
            .setAccountId(account)
            .execute(client);

        expect(info.accountId.toString()).to.be.equal(account.toString());
        expect(info.isDeleted).to.be.false;
        expect(info.key.toString()).to.be.equal(key.publicKey.toString());
        expect(info.balance.toTinybars().toNumber()).to.be.equal(0);
        expect(info.autoRenewPeriod.seconds.toNumber()).to.be.equal(7776000);
        expect(info.proxyAccountId).to.be.null;
        expect(info.proxyReceived.toTinybars().toNumber()).to.be.equal(0);

        await (
            await (
                await new AccountDeleteTransaction()
                    .setAccountId(account)
                    .setNodeAccountIds([response.nodeId])
                    .setTransferAccountId(operatorId)
                    .freezeWith(client)
                    .sign(key)
            ).execute(client)
        ).getReceipt(client);
    });

    it("should error when key is not set", async function () {
        this.timeout(15000);

        const client = await newClient();
        let err = false;

        try {
            const response = await new AccountCreateTransaction()
                .setInitialBalance(new Hbar(2))
                .execute(client);

            await response.getReceipt(client);
        } catch (error) {
            err = error.toString().includes(Status.KeyRequired.toString());
        }

        if (!err) {
            throw new Error("account creation did not error");
        }
    });

    it("should be able to sign transaction and verify transaction signtatures", async function () {
        this.timeout(15000);

        const client = await newClient();
        const operatorKey = client.operatorPublicKey;
        const operatorId = client.operatorAccountId;
        const key = PrivateKey.generate();

        const response = await new AccountCreateTransaction()
            .setKey(key.publicKey)
            .execute(client);

        const receipt = await response.getReceipt(client);

        expect(receipt.accountId).to.not.be.null;
        const account = receipt.accountId;

        const info = await new AccountInfoQuery()
            .setNodeAccountIds([response.nodeId])
            .setAccountId(account)
            .execute(client);

        expect(info.accountId.toString()).to.be.equal(account.toString());
        expect(info.isDeleted).to.be.false;
        expect(info.key.toString()).to.be.equal(key.publicKey.toString());
        expect(info.balance.toTinybars().toNumber()).to.be.equal(0);
        expect(info.autoRenewPeriod.seconds.toNumber()).to.be.equal(7776000);
        expect(info.proxyAccountId).to.be.null;
        expect(info.proxyReceived.toTinybars().toNumber()).to.be.equal(0);

        const transaction = new AccountDeleteTransaction()
            .setAccountId(account)
            .setNodeAccountIds([response.nodeId])
            .setTransferAccountId(operatorId)
            .freezeWith(client);

        key.signTransaction(transaction);

        expect(key.publicKey.verifyTransaction(transaction)).to.be.true;
        expect(operatorKey.verifyTransaction(transaction)).to.be.false;

        await (await transaction.execute(client)).getReceipt(client);
    });
});
