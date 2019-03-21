/* eslint-disable unicorn/filename-case, no-unused-vars */
/* globals describe, before, after, it, afterEach */

const should = require('should');
const sinon = require('sinon');
const helper = require('node-red-node-test-helper');
const bangbangNode = require('../nodes/combine-bangbang');

helper.init(require.resolve('node-red'));

describe('combine bangbang', () => {
    const flow1 = [
        {
            id: 'n-b-i',
            type: 'combine-bangbang',
            upper: '14',
            lower: '12',
            invert: true,
            name: '12-14 inverted',
            wires: [
                [
                    'nh'
                ]
            ]
        },
        {
            id: 'n-b',
            type: 'combine-bangbang',
            upper: '23.5',
            lower: '21.5',
            invert: false,
            name: '21.5-23.5',
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
    let nb;
    let nbi;

    before(done => {
        helper.startServer(() => {
            helper.load(bangbangNode, flow1, () => {
                nb = helper.getNode('n-b');
                nbi = helper.getNode('n-b-i');
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

    describe('lower=12 upper=14 invert=true', () => {
        it('should not send a message on 13', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nbi.receive({payload: 13});
            callback.notCalled.should.be.true();
        });
        it('should not send a message on invalid payload', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nbi.receive({payload: 'abc'});
            callback.notCalled.should.be.true();
        });
        it('should send payload true on 10', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nbi.receive({payload: 10});
            callback.calledOnce.should.be.true();
            callback.firstCall.args[0].should.have.properties({payload: true});
        });
        it('should not send a message on invalid payload', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nbi.receive({payload: 'abc'});
            callback.notCalled.should.be.true();
        });
        it('should not send a message on 11', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nbi.receive({payload: 11});
            callback.notCalled.should.be.true();
        });
        it('should not send a message on 12', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nbi.receive({payload: 12});
            callback.notCalled.should.be.true();
        });
        it('should not send a message on 13', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nbi.receive({payload: 13});
            callback.notCalled.should.be.true();
        });
        it('should not send a message on 14', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nbi.receive({payload: 14});
            callback.notCalled.should.be.true();
        });
        it('should send payload false on 14.5', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nbi.receive({payload: 14.5});
            callback.calledOnce.should.be.true();
            callback.firstCall.args[0].should.have.properties({payload: false});
        });
        it('should not send a message on 15', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nbi.receive({payload: 15});
            callback.notCalled.should.be.true();
        });
        it('should not send a message on 14', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nbi.receive({payload: 14});
            callback.notCalled.should.be.true();
        });
        it('should not send a message on 13', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nbi.receive({payload: 13});
            callback.notCalled.should.be.true();
        });
        it('should not send a message on 12', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nbi.receive({payload: 12});
            callback.notCalled.should.be.true();
        });
        it('should send payload true on 11', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nbi.receive({payload: 11});
            callback.calledOnce.should.be.true();
            callback.firstCall.args[0].should.have.properties({payload: true});
        });
        it('should not send a message on 10', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nbi.receive({payload: 10});
            callback.notCalled.should.be.true();
        });
    });

    describe('lower=21.5 upper=24.5 invert=false', () => {
        it('should send payload false on 20', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nb.receive({payload: 20});
            callback.calledOnce.should.be.true();
            callback.firstCall.args[0].should.have.properties({payload: false});
        });
        it('should not send a message on 21', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nb.receive({payload: 21});
            callback.notCalled.should.be.true();
        });
        it('should not send a message on 21.5', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nb.receive({payload: 21.5});
            callback.notCalled.should.be.true();
        });
        it('should not send a message on 22.0', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nb.receive({payload: 22});
            callback.notCalled.should.be.true();
        });
        it('should not send a message on 23.0', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nb.receive({payload: 23});
            callback.notCalled.should.be.true();
        });
        it('should not send a message on 23.5', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nb.receive({payload: 23.5});
            callback.notCalled.should.be.true();
        });
        it('should send payload true on 24.0', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nb.receive({payload: 24});
            callback.calledOnce.should.be.true();
            callback.firstCall.args[0].should.have.properties({payload: true});
        });
        it('should not send a message on 25.0', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nb.receive({payload: 25});
            callback.notCalled.should.be.true();
        });
        it('should not send a message on 26.0', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nb.receive({payload: 26});
            callback.notCalled.should.be.true();
        });
        it('should not send a message on 25.0', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nb.receive({payload: 25});
            callback.notCalled.should.be.true();
        });
        it('should not send a message on 24.0', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nb.receive({payload: 24});
            callback.notCalled.should.be.true();
        });
        it('should not send a message on 23.5', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nb.receive({payload: 23.5});
            callback.notCalled.should.be.true();
        });
        it('should not send a message on 23.0', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nb.receive({payload: 23});
            callback.notCalled.should.be.true();
        });
        it('should not send a message on 22.0', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nb.receive({payload: 22});
            callback.notCalled.should.be.true();
        });
        it('should not send a message on 21.5', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nb.receive({payload: 21.5});
            callback.notCalled.should.be.true();
        });
        it('should send payload false on 20', () => {
            const callback = sinon.spy();
            nh.once('input', callback);
            nb.receive({payload: 20});
            callback.calledOnce.should.be.true();
            callback.firstCall.args[0].should.have.properties({payload: false});
        });
    });
});
