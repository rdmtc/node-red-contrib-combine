/* eslint-disable unicorn/filename-case, no-unused-vars */
/* globals describe, before, after, it, afterEach */

const should = require('should');
const sinon = require('sinon');
const helper = require('node-red-node-test-helper');
const listNode = require('../nodes/combine-list');

helper.init(require.resolve('node-red'));

describe('combine list', () => {
    const flow1 = [
        {
            id: 'n-l',
            type: 'combine-list',
            name: 'list',
            payload: 'array',
            falsy: 'include',
            columns: ['topic', 'payload'],
            sort: 'topic',
            order: 'desc',
            defer: 250,
            timeout: 0,
            wires: [
                [
                    'nh'
                ]
            ]
        },
        {
            id: 'n-l-c',
            type: 'combine-list',
            name: 'list',
            payload: 'csv',
            falsy: 'exclude',
            columns: ['topic'],
            sort: 'topic',
            order: 'asc',
            defer: 0,
            timeout: 0,
            distinction: 'topic',
            wires: [
                [
                    'nh'
                ]
            ]
        },
        {
            id: 'n-l-u',
            type: 'combine-list',
            name: 'list',
            payload: 'ul',
            falsy: 'include',
            columns: ['topic'],
            sort: 'topic',
            order: 'asc',
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
            id: 'n-l-t',
            type: 'combine-list',
            name: 'list',
            payload: 'html',
            falsy: 'include',
            columns: ['topic'],
            sort: 'topic',
            order: 'asc',
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
            id: 'n-l-m',
            type: 'combine-list',
            name: 'list',
            payload: 'array',
            falsy: 'include',
            columns: ['topic'],
            defer: 250,
            timeout: 1000,
            distinction: '_msgid',
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
    let nl;
    let nlc;
    let nlu;
    let nlt;
    let nlm;

    before(done => {
        helper.startServer(() => {
            helper.load(listNode, flow1, () => {
                nl = helper.getNode('n-l');
                nlc = helper.getNode('n-l-c');
                nlt = helper.getNode('n-l-t');
                nlu = helper.getNode('n-l-u');
                nlm = helper.getNode('n-l-m');
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

    describe('array, include falsy', () => {
        it('should send [["a", true]] on a:true', done => {
            nh.once('input', msg => {
                msg.payload.should.eql([['a', true]]);
                msg.topics.should.eql(['a']);
                done();
            });
            nl.receive({topic: 'a', payload: true});
        });
        it('should send [["c", false], ["b", true], ["a", true]] on b:true, c:false', done => {
            nh.once('input', msg => {
                msg.payload.should.eql([['c', false], ['b', true], ['a', true]]);
                msg.topics.should.eql(['c', 'b', 'a']);
                done();
            });
            nl.receive({topic: 'b', payload: true});
            nl.receive({topic: 'c', payload: false});
        });
    });
    describe('csv, exclude falsy', () => {
        it('should send "a\\n" on a:true', done => {
            nh.once('input', msg => {
                msg.payload.should.eql('a\n');
                msg.topics.should.eql(['a']);
                done();
            });
            nlc.receive({topic: 'a', payload: true});
        });
        it('should send "b b\\n" on "b b":true', done => {
            nh.once('input', msg => {
                msg.payload.should.eql('a\n"b b"\n');
                msg.topics.should.eql(['a', 'b b']);
                done();
            });
            nlc.receive({topic: 'b b', payload: true});
        });
        it('should send "b b\\n" on "b b":true, a:false', done => {
            nh.once('input', msg => {
                msg.payload.should.eql('"b b"\n');
                msg.topics.should.eql(['b b']);
                done();
            });
            nlc.receive({topic: 'a', payload: false});
        });
    });
    describe('html ul', () => {
        it('should send <ul> on a:true', done => {
            nh.once('input', msg => {
                msg.payload.should.eql(
                    `<ul class="combine-list">
    <li>a</li>
</ul>
`);
                msg.topics.should.eql(['a']);
                done();
            });
            nlu.receive({topic: 'a', payload: true});
        });
    });
    describe('html table', () => {
        it('should send <table> on a:true', done => {
            nh.once('input', msg => {
                msg.payload.should.eql(
                    `<table class="combine-list">
    <tr><td class="combine-list-topic">a</td></tr>
</table>
`);
                msg.topics.should.eql(['a']);
                done();
            });
            nlt.receive({topic: 'a', payload: true});
        });
    });
    describe('distinct _msgid', () => {
        it('should send true on d:true', done => {
            nh.once('input', msg => {
                msg.payload.should.eql(['d']);
                done();
            });
            nlm.receive({topic: 'd', payload: true});
        });
        it('should send false after timeout', function (done) {
            this.timeout(5000);
            nh.once('input', msg => {
                msg.payload.should.eql([]);
                done();
            });
        });
    });
});
