/* eslint-disable unicorn/filename-case, no-unused-vars */
/* globals describe, before, after, it, afterEach */

const should = require('should');
const sinon = require('sinon');
const helper = require('node-red-node-test-helper');
const deltaNode = require('../nodes/combine-delta');

helper.init(require.resolve('node-red'));

describe('combine delta', () => {
    const flow1 = [
        {
            id: 'n-d',
            type: 'combine-delta',
            name: 'delta',
            topicA: 'A',
            topicB: 'B',
            wires: [
                [
                    'nh'
                ]
            ]
        },
        {
            id: 'nh',
            type: 'helper'
        }
    ];

    let nh;
    let nd;

    before(done => {
        helper.startServer(() => {
            helper.load(deltaNode, flow1, () => {
                nd = helper.getNode('n-d');
                nh = helper.getNode('nh');
                done();
            });
        });
    });

    after(done => {
        helper.unload();
        helper.stopServer(done);
    });

    afterEach(() => {
        sinon.restore();
    });

    it('should not send a message on B:7', () => {
        const callback = sinon.spy();
        nh.once('input', callback);
        nd.receive({topic: 'B', payload: 7});
        callback.notCalled.should.be.true();
    });
    it('should send payload 3 on A:10', () => {
        const callback = sinon.spy();
        nh.once('input', callback);
        nd.receive({topic: 'A', payload: 10});
        callback.calledOnce.should.be.true();
        callback.firstCall.args[0].should.have.properties({payload: 3});
    });
    it('should send payload 12 on B:-2', () => {
        const callback = sinon.spy();
        nh.once('input', callback);
        nd.receive({topic: 'B', payload: 12});
        callback.calledOnce.should.be.true();
        callback.firstCall.args[0].should.have.properties({payload: -2});
    });
    it('should not send a message on B:null', () => {
        const callback = sinon.spy();
        nh.once('input', callback);
        nd.receive({topic: 'B', payload: null});
        callback.notCalled.should.be.true();
    });
    it('should not send a message on A:""', () => {
        const callback = sinon.spy();
        nh.once('input', callback);
        nd.receive({topic: 'A', payload: ''});
        callback.notCalled.should.be.true();
    });
    it('should not send a message on C:3', () => {
        const callback = sinon.spy();
        nh.once('input', callback);
        nd.receive({topic: 'C', payload: 3});
        callback.notCalled.should.be.true();
    });
});
