import { Client as NativeClient, credentials } from "@grpc/grpc-js";
import proto from "@hashgraph/proto";

export default class Channel {
    /**
     * @param {string} address
     */
    constructor(address) {
        /**
         * @type {NativeClient}
         * @private
         */
        this._client = new NativeClient(address, credentials.createInsecure());

        /**
         * @private
         * @type {?proto.CryptoService}
         */
        this._crypto = null;

        /**
         * @private
         * @type {?proto.SmartContractService}
         */
        this._smartContract = null;

        /**
         * @private
         * @type {?proto.FileService}
         */
        this._file = null;

        /**
         * @private
         * @type {?proto.ConsensusService}
         */
        this._consensus = null;
    }

    /**
     * @returns {proto.CryptoService}
     */
    get crypto() {
        if (this._crypto != null) {
            return this._crypto;
        }

        this._crypto = proto.CryptoService.create(
            (method, requestData, callback) => {
                this._client.makeUnaryRequest(
                    `/proto.${proto.CryptoService.name}/${method.name}`,
                    (value) => value,
                    (value) => value,
                    Buffer.from(requestData),
                    callback
                );
            },
            false,
            false
        );

        return this._crypto;
    }

    /**
     * @returns {proto.SmartContractService}
     */
    get smartContract() {
        if (this._smartContract != null) {
            return this._smartContract;
        }

        this._smartContract = proto.SmartContractService.create(
            (method, requestData, callback) => {
                this._client.makeUnaryRequest(
                    `/proto.${proto.SmartContractService.name}/${method.name}`,
                    (value) => value,
                    (value) => value,
                    Buffer.from(requestData),
                    callback
                );
            },
            false,
            false
        );

        return this._smartContract;
    }

    /**
     * @returns {proto.FileService}
     */
    get file() {
        if (this._file != null) {
            return this._file;
        }

        this._file = proto.FileService.create(
            (method, requestData, callback) => {
                this._client.makeUnaryRequest(
                    `/proto.${proto.FileService.name}/${method.name}`,
                    (value) => value,
                    (value) => value,
                    Buffer.from(requestData),
                    callback
                );
            },
            false,
            false
        );

        return this._file;
    }

    /**
     * @returns {proto.ConsensusService}
     */
    get consensus() {
        if (this._consensus != null) {
            return this._consensus;
        }

        this._consensus = proto.ConsensusService.create(
            (method, requestData, callback) => {
                this._client.makeUnaryRequest(
                    `/proto.${proto.ConsensusService.name}/${method.name}`,
                    (value) => value,
                    (value) => value,
                    Buffer.from(requestData),
                    callback
                );
            },
            false,
            false
        );

        return this._consensus;
    }
}