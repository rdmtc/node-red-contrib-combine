/* eslint-disable unicorn/filename-case, no-unused-vars */
/* globals describe, before, after, it, afterEach */

const should = require('should');
const sinon = require('sinon');
const helper = require('node-red-node-test-helper');
const ifNode = require('../nodes/combine-invert');

helper.init(require.resolve('node-red'));

describe('combine invert', () => {
    const flow1 = [
        {
            id: 'n-i',
            type: 'combine-invert',
            name: 'invert',
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
    /* test input 'true', expect output 'false' */
    it('should send "false" payload on input "true" (boolean)', () => {
        const callback = sinon.spy();
        nh.once('input', callback);
        ni.receive({topic: 'a', payload: true});
        callback.calledOnce.should.be.true();
        callback.firstCall.args[0].should.have.properties({topic: 'a', payload: false});
    });
    it('should send "false" payload on input "true" (string)', () => {
        const callback = sinon.spy();
        nh.once('input', callback);
        ni.receive({topic: 'a', payload: 'true'});
        callback.calledOnce.should.be.true();
        callback.firstCall.args[0].should.have.properties({topic: 'a', payload: false});
    });
    it('should send "false" payload on input "1" (string)', () => {
        const callback = sinon.spy();
        nh.once('input', callback);
        ni.receive({topic: 'a', payload: '1'});
        callback.calledOnce.should.be.true();
        callback.firstCall.args[0].should.have.properties({topic: 'a', payload: false});
    });
    it('should send "false" payload on input "1" (number)', () => {
        const callback = sinon.spy();
        nh.once('input', callback);
        ni.receive({topic: 'a', payload: 1});
        callback.calledOnce.should.be.true();
        callback.firstCall.args[0].should.have.properties({topic: 'a', payload: false});
    });
    /* test input 'false', expect output 'true' */
    it('should send "true" payload on input "false" (boolean)', () => {
        const callback = sinon.spy();
        nh.once('input', callback);
        ni.receive({topic: 'a', payload: false});
        callback.calledOnce.should.be.true();
        callback.firstCall.args[0].should.have.properties({topic: 'a', payload: true});
    });
    it('should send "true" payload on input "false" (string)', () => {
        const callback = sinon.spy();
        nh.once('input', callback);
        ni.receive({topic: 'a', payload: 'false'});
        callback.calledOnce.should.be.true();
        callback.firstCall.args[0].should.have.properties({topic: 'a', payload: true});
    });
    it('should send "true" payload on input "0" (string)', () => {
        const callback = sinon.spy();
        nh.once('input', callback);
        ni.receive({topic: 'a', payload: '0'});
        callback.calledOnce.should.be.true();
        callback.firstCall.args[0].should.have.properties({topic: 'a', payload: true});
    });
    it('should send "true" payload on input "0" (number)', () => {
        const callback = sinon.spy();
        nh.once('input', callback);
        ni.receive({topic: 'a', payload: 0});
        callback.calledOnce.should.be.true();
        callback.firstCall.args[0].should.have.properties({topic: 'a', payload: true});
    });
    /* test other input, expect no output */
    it('should not send a message on input "a"', () => {
        const callback = sinon.spy();
        nh.once('input', callback);
        ni.receive({topic: 'a', payload: 'a'});
        callback.notCalled.should.be.true();
    });
    it('should not send a message on input NULL', () => {
        const callback = sinon.spy();
        nh.once('input', callback);
        ni.receive({topic: 'a', payload: null});
        callback.notCalled.should.be.true();
    });
});
