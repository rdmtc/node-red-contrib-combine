/* eslint-disable unicorn/filename-case, no-unused-vars */
/* globals describe, before, after, it, afterEach */

const should = require('should');
const sinon = require('sinon');
const helper = require('node-red-node-test-helper');
const statisticNode = require('../nodes/combine-statistic');

helper.init(require.resolve('node-red'));

describe('combine statistic', () => {
    const flow1 = [
        {
            id: 'n-s',
            type: 'combine-statistic',
            name: 'statistic',
            operator: 'len',
            falsy: 'include',
            defer: 250,
            timeout: 0,
            distinction: 'topic',
            wires: [
                [
                    'nh'
                ]
            ]
        },
        {
            id: 'n-s-c',
            type: 'combine-statistic',
            name: 'list',
            operator: 'len',
            falsy: 'exclude',
            defer: 250,
            timeout: 0,
            distinction: 'topic',
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
    let ns;
    let nsc;

    before(done => {
        helper.startServer(() => {
            helper.load(statisticNode, flow1, () => {
                ns = helper.getNode('n-s');
                nsc = helper.getNode('n-s-c');
                nh = helper.getNode('nh');
                setTimeout(done, 1000);
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

    describe('count, include falsy', () => {
        it('should send 1 on a:true', done => {
            nh.once('input', msg => {
                msg.payload.should.eql(1);
                msg.topics.should.eql(['a']);
                done();
            });
            ns.receive({topic: 'a', payload: true});
        });
        it('should send 3 on b:true, c:false', done => {
            nh.once('input', msg => {
                msg.payload.should.eql(3);
                msg.topics.should.eql(['a', 'b', 'c']);
                done();
            });
            ns.receive({topic: 'b', payload: true});
            ns.receive({topic: 'c', payload: false});
        });
    });
    describe('count, exclude falsy', () => {
        it('should send 1 on a:true', done => {
            nh.once('input', msg => {
                msg.payload.should.eql(1);
                msg.topics.should.eql(['a']);
                done();
            });
            nsc.receive({topic: 'a', payload: true});
        });
        it('should send 1 on b:true, a:false', done => {
            nh.once('input', msg => {
                msg.payload.should.eql(1);
                msg.topics.should.eql(['b']);
                done();
            });
            nsc.receive({topic: 'a', payload: false});
            nsc.receive({topic: 'b', payload: true});
        });
    });
});
