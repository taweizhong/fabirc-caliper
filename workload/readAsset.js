'use strict';

const { WorkloadModuleBase } = require('@hyperledger/caliper-core');

class MyWorkload extends WorkloadModuleBase {
    constructor() {
        super();
    }

    async initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext) {
        await super.initializeWorkloadModule(workerIndex, totalWorkers, roundIndex, roundArguments, sutAdapter, sutContext);

        for (let i=0; i<this.roundArguments.assets; i++) {
            const assetID = `${this.workerIndex}-${i}`;
            console.log(`Worker ${this.workerIndex}: Creating asset ${assetID}`);
            const request = {
                contractId: this.roundArguments.contractId,
                contractFunction: 'Create',
                invokerIdentity: 'User1',
                contractArguments: [assetID,"榆中肉牛养殖场", "甘肃省兰州市", "446523465768", "刘", "2022.2.1", "2022.10.23"],
                // contractArguments: [assetID,"兰州肉多多有限责任公司", "true", "true", "2022.2.1", "true", "酮体"],
                // contractArguments: [assetID,"兰州01街", "2022.2.1", "冰柜", "12/8", "2022.1.1", "-3", "2RH"],
                // contractArguments: [assetID,"c3467", "true", "兰州/西安", "1.22/1.28", "王武", "50"],
                // contractArguments: [assetID,"海外", "true", "兰州饿了有限公司", "兰州不饿有限公司", "2022.3.4", "2022.5.6", "-6"],
                readOnly: false
            };

            await this.sutAdapter.sendRequests(request);
        }
    }

    async submitTransaction() {
        const randomId = Math.floor(Math.random()*this.roundArguments.assets);
        const myArgs = {
            contractId: this.roundArguments.contractId,
            contractFunction: 'Query',
            invokerIdentity: 'User1',
            contractArguments: [`${this.workerIndex}-${randomId}`],
            readOnly: true
        };

        await this.sutAdapter.sendRequests(myArgs);
    }

    async cleanupWorkloadModule() {
        for (let i=0; i<this.roundArguments.assets; i++) {
            const assetID = `${this.workerIndex}-${i}`;
            console.log(`Worker ${this.workerIndex}: Deleting asset ${assetID}`);
            const request = {   
                contractId: this.roundArguments.contractId,
                contractFunction: 'Delete',
                invokerIdentity: 'User1',
                contractArguments: [assetID],
                readOnly: false
            };

            await this.sutAdapter.sendRequests(request);
        }
    }
}

function createWorkloadModule() {
    return new MyWorkload();
}

module.exports.createWorkloadModule = createWorkloadModule;