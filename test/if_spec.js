/* eslint-disable unicorn/filename-case, no-unused-vars */
/* globals describe, before, after, it, afterEach */

const should = require('should');
const sinon = require('sinon');
const helper = require('node-red-node-test-helper');
const ifNode = require('../nodes/combine-if');

helper.init(require.resolve('node-red'));

describe('combine delta', () => {
    const flow1 = [
        {
            id: 'n-i',
            type: 'combine-if',
            name: 'if',
            topic: 'cond',
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
    let ni;

    before(done => {
        helper.startServer(() => {
            helper.load(ifNode, flow1, () => {
                ni = helper.getNode('n-i');
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

    it('should not send a message on a:true', () => {
        const callback = sinon.spy();
        nh.once('input', callback);
        ni.receive({topic: 'a', payload: true});
        callback.notCalled.should.be.true();
    });
    it('should not send a message on cond:true', () => {
        const callback = sinon.spy();
        nh.once('input', callback);
        ni.receive({topic: 'cond', payload: true});
        callback.notCalled.should.be.true();
    });
    it('should send b:true on b:true', () => {
        const callback = sinon.spy();
        nh.once('input', callback);
        ni.receive({topic: 'b', payload: true});
        callback.calledOnce.should.be.true();
        callback.firstCall.args[0].should.have.properties({topic: 'b', payload: true});
    });
    it('should not send a message on cond:false', () => {
        const callback = sinon.spy();
        nh.once('input', callback);
        ni.receive({topic: 'cond', payload: false});
        callback.notCalled.should.be.true();
    });
    it('should not send a message on c:true', () => {
        const callback = sinon.spy();
        nh.once('input', callback);
        ni.receive({topic: 'c', payload: true});
        callback.notCalled.should.be.true();
    });
});
