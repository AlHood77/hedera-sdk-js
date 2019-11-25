import { TransactionGetRecordQuery } from "../src/exports";
import { mockTransaction } from "./MockClient";

describe("TransactionGetRecordQuery", () => {
    it("serializes and deserializes correctly; TransactionGetRecordQuery", () => {
        const transaction = new TransactionGetRecordQuery()
            .setTransactionId({
                account: {
                    shard: 0,
                    realm: 0,
                    account: 3
                },
                validStartSeconds: 124124,
                validStartNanos: 151515
            })
            .setPayment(mockTransaction.toProto());

        const tx = transaction.toProto().toObject();
        expect(tx).toStrictEqual({
            contractcalllocal: undefined,
            contractgetbytecode: undefined,
            contractgetinfo: undefined,
            contractgetrecords: undefined,
            cryptogetaccountbalance: undefined,
            cryptogetaccountrecords: undefined,
            cryptogetclaim: undefined,
            cryptogetinfo: undefined,
            cryptogetproxystakers: undefined,
            filegetcontents: undefined,
            filegetinfo: undefined,
            getbykey: undefined,
            getbysolidityid: undefined,
            transactiongetfastrecord: undefined,
            transactiongetreceipt: undefined,
            transactiongetrecord: {
                transactionid: {
                    accountid: {
                        accountnum: 3,
                        realmnum: 0,
                        shardnum: 0
                    },
                    transactionvalidstart: {
                        nanos: 151515,
                        seconds: 124124
                    }
                },
                header: {
                    payment: {
                        body: undefined,
                        bodybytes: "Cg4KCAjcyQcQ258JEgIYAxICGAMYwIQ9IgIIeHIUChIKBwoCGAIQxwEKBwoCGAMQyAE=",
                        sigmap: {
                            sigpairList: [{
                                contract: "",
                                ecdsa384: "",
                                ed25519: "1W86WCxMfK1Pv83GbBxXIDzpTLgwsLzOO/Nccs9QEV6ej/kp3QbJGtgO64gTXrdje6lyTdbuaLFYxxHXtje2CgoOCggI3MkHENufCRICGAMSAhgDGMCEPSICCHhyFAoSCgcKAhgCEMcBCgcKAhgDEMgB",
                                pubkeyprefix: "4MjsJ1ilh5/6wiahPAxRa3mecuNRQaDdgo+U03mIpLc=",
                                rsa3072: "",
                            }]
                        },
                        sigs: undefined
                    },
                    responsetype: 0
                }
            }
        });
    });
});
