/* eslint-disable unicorn/filename-case, no-unused-vars */
/* globals describe, before, after, it, afterEach */

const should = require('should');
const sinon = require('sinon');
const helper = require('node-red-node-test-helper');
const ifNode = require('../nodes/combine-defer');

helper.init(require.resolve('node-red'));

describe('combine defer', () => {
    const flow1 = [
        {
            id: 'n-d',
            type: 'combine-defer',
            timeout: 0.25,
            name: 'defer',
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
            helper.load(ifNode, flow1, () => {
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

    it('should send a:true on a:true', done => {
        nh.once('input', msg => {
            done();
        });
        nd.receive({topic: 'a', payload: true});
    });
    it('should not send a message on b:true, b:false', done => {
        const callback = sinon.spy();
        nh.once('input', callback);
        nd.receive({topic: 'b', payload: true});
        setTimeout(() => {
            nd.receive({topic: 'b', payload: false});
        }, 50);
        setTimeout(() => {
            callback.notCalled.should.be.true();
            done();
        }, 500);
    });
});
