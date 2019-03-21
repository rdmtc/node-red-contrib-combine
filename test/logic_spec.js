/* eslint-disable unicorn/filename-case, no-unused-vars */
/* globals describe, before, after, it, afterEach */

const should = require('should');
const helper = require('node-red-node-test-helper');
const logicNode = require('../nodes/combine-logic');

helper.init(require.resolve('node-red'));

describe('combine logic', () => {
    const flow1 = [
        {
            id: 'n-and',
            type: 'combine-logic',
            name: 'logic and',
            topic: '',
            operator: 'and',
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
            id: 'n-and-d',
            type: 'combine-logic',
            name: 'logic and distinct msgid',
            topic: '',
            operator: 'and',
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
            id: 'n-and-d0',
            type: 'combine-logic',
            name: 'logic and distinct msgid',
            topic: '',
            operator: 'and',
            defer: 0,
            timeout: 1000,
            distinction: '_msgid',
            wires: [
                [
                    'nh'
                ]
            ]
        },
        {
            id: 'n-nand',
            type: 'combine-logic',
            name: 'logic nand',
            topic: '',
            operator: 'nand',
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
            id: 'n-or',
            type: 'combine-logic',
            name: 'logic or',
            topic: '',
            operator: 'or',
            defer: 250,
            timeout: 0,
            wires: [
                [
                    'nh'
                ]
            ]
        },
        {
            id: 'n-nor',
            type: 'combine-logic',
            name: 'logic nor',
            topic: '',
            operator: 'nor',
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
            id: 'n-xor',
            type: 'combine-logic',
            name: 'logic xor',
            topic: '',
            operator: 'xor',
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
            id: 'n-xnor',
            type: 'combine-logic',
            name: 'logic xnor',
            topic: '',
            operator: 'xnor',
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

    let nhelper;
    let nAnd;
    let nAndD;
    let nAndD0;
    let nNand;
    let nOr;
    let nNor;
    let nXor;
    let nXnor;

    before(done => {
        helper.startServer(() => {
            helper.load(logicNode, flow1, () => {
                nAnd = helper.getNode('n-and');
                nNand = helper.getNode('n-nand');
                nOr = helper.getNode('n-or');
                nNor = helper.getNode('n-nor');
                nXor = helper.getNode('n-xor');
                nXnor = helper.getNode('n-xnor');
                nAndD = helper.getNode('n-and-d');
                nAndD0 = helper.getNode('n-and-d0');
                nhelper = helper.getNode('nh');
                done();
            });
        });
    });

    after(done => {
        helper.unload();
        helper.stopServer(done);
    });

    describe('and', () => {
        it('should output true on 1:true', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1']);
                msg.payload.should.be.true();
                done();
            });
            nAnd.receive({topic: '1', payload: true});
        });
        it('should output false on 1:false', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1']);
                msg.payload.should.be.false();
                done();
            });
            nAnd.receive({topic: '1', payload: false});
        });
        it('should output false on 2:true', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.false();
                done();
            });
            nAnd.receive({topic: '2', payload: true});
        });
        it('should output true on 1:true', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.true();
                done();
            });
            nAnd.receive({topic: '1', payload: true});
        });
        it('should output true on 3:true', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2', '3']);
                msg.payload.should.be.true();
                done();
            });
            nAnd.receive({topic: '3', payload: true});
        });
        it('should output false on 3:false', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2', '3']);
                msg.payload.should.be.false();
                done();
            });
            nAnd.receive({topic: '3', payload: false});
        });
        it('should output false deferred on 3:true, 3:false', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2', '3']);
                msg.payload.should.be.false();
                done();
            });
            nAnd.receive({topic: '3', payload: true});
            nAnd.receive({topic: '3', payload: false});
        });
    });
    describe('nand', () => {
        it('should output false on 1:true', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1']);
                msg.payload.should.be.false();
                done();
            });
            nNand.receive({topic: '1', payload: true});
        });
        it('should output true on 1:false', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1']);
                msg.payload.should.be.true();
                done();
            });
            nNand.receive({topic: '1', payload: false});
        });
        it('should output true on 2:true', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.true();
                done();
            });
            nNand.receive({topic: '2', payload: true});
        });
        it('should output false on 1:true', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.false();
                done();
            });
            nNand.receive({topic: '1', payload: true});
        });
        it('should output false on 3:true', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2', '3']);
                msg.payload.should.be.false();
                done();
            });
            nNand.receive({topic: '3', payload: true});
        });
        it('should output true on 3:false', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2', '3']);
                msg.payload.should.be.true();
                done();
            });
            nNand.receive({topic: '3', payload: false});
        });
    });
    describe('or', () => {
        it('should output true on 1:true', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1']);
                msg.payload.should.be.true();
                done();
            });
            nOr.receive({topic: '1', payload: true});
        });
        it('should output false on 1:false', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1']);
                msg.payload.should.be.false();
                done();
            });
            nOr.receive({topic: '1', payload: false});
        });
        it('should output true on 2:true', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.true();
                done();
            });
            nOr.receive({topic: '2', payload: true});
        });
        it('should output true on 1:true', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.true();
                done();
            });
            nOr.receive({topic: '1', payload: true});
        });
        it('should output true on 2:false', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.true();
                done();
            });
            nOr.receive({topic: '2', payload: false});
        });
        it('should output false on 1:false', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.false();
                done();
            });
            nOr.receive({topic: '1', payload: false});
        });
        it('should output false on 3:false', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2', '3']);
                msg.payload.should.be.false();
                done();
            });
            nOr.receive({topic: '3', payload: false});
        });
        it('should output true on 3:true', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2', '3']);
                msg.payload.should.be.true();
                done();
            });
            nOr.receive({topic: '3', payload: true});
        });
    });
    describe('nor', () => {
        it('should output false on 1:true', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1']);
                msg.payload.should.be.false();
                done();
            });
            nNor.receive({topic: '1', payload: true});
        });
        it('should output true on 1:false', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1']);
                msg.payload.should.be.true();
                done();
            });
            nNor.receive({topic: '1', payload: false});
        });
        it('should output false on 2:true', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.false();
                done();
            });
            nNor.receive({topic: '2', payload: true});
        });
        it('should output false on 1:true', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.false();
                done();
            });
            nNor.receive({topic: '1', payload: true});
        });
        it('should output false on 2:false', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.false();
                done();
            });
            nNor.receive({topic: '2', payload: false});
        });
        it('should output true on 1:false', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.true();
                done();
            });
            nNor.receive({topic: '1', payload: false});
        });
        it('should output true on 3:false', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2', '3']);
                msg.payload.should.be.true();
                done();
            });
            nNor.receive({topic: '3', payload: false});
        });
        it('should output false on 3:true', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2', '3']);
                msg.payload.should.be.false();
                done();
            });
            nNor.receive({topic: '3', payload: true});
        });
    });
    describe('xor', () => {
        it('should output false deferred on 1:true, 2:true', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.false();
                done();
            });
            nXor.receive({topic: '1', payload: true});
            nXor.receive({topic: '2', payload: true});
        });
        it('should output true on 1:false', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.true();
                done();
            });
            nXor.receive({topic: '1', payload: false});
        });
        it('should output false on 2:false', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.false();
                done();
            });
            nXor.receive({topic: '2', payload: false});
        });
        it('should output true on 1:true', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.true();
                done();
            });
            nXor.receive({topic: '1', payload: true});
        });
        it('should output false on 2:true', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.false();
                done();
            });
            nXor.receive({topic: '2', payload: true});
        });
        it('should output true on 1:false', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.true();
                done();
            });
            nXor.receive({topic: '1', payload: false});
        });
    });
    describe('xnor', () => {
        it('should output true deferred on 1:true, 2:true', function (done) {
            this.timeout(3000);
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.true();
                setTimeout(done, 2000);
            });
            nXnor.receive({topic: '1', payload: true});
            nXnor.receive({topic: '2', payload: true});
        });
        it('should output false on 1:false', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.false();
                done();
            });
            nXnor.receive({topic: '1', payload: false});
        });
        it('should output true on 2:false', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.true();
                done();
            });
            nXnor.receive({topic: '2', payload: false});
        });
        it('should output false on 1:true', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.false();
                done();
            });
            nXnor.receive({topic: '1', payload: true});
        });
        it('should output true on 2:true', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.true();
                done();
            });
            nXnor.receive({topic: '2', payload: true});
        });
        it('should output false on 1:false', done => {
            nhelper.once('input', msg => {
                should(msg.topics.sort()).be.eql(['1', '2']);
                msg.payload.should.be.false();
                done();
            });
            nXnor.receive({topic: '1', payload: false});
        });
    });
    describe('and distinct _msgid timeout 1000', () => {
        it('should output true on true', done => {
            nhelper.once('input', msg => {
                msg.payload.should.be.true();
                done();
            });
            nAndD.receive({payload: true});
        });
        it('should output false after timeout', function (done) {
            this.timeout(5000);
            nhelper.once('input', msg => {
                msg.payload.should.be.false();
                done();
            });
        });
        it('should output false on false, true', done => {
            nhelper.once('input', msg => {
                msg.payload.should.be.false();
                done();
            });
            nAndD.receive({payload: false});
            setTimeout(() => {
                nAndD.receive({payload: true});
            }, 75);
        });
        it('should output true after timeout', function (done) {
            this.timeout(3000);
            nhelper.once('input', msg => {
                msg.payload.should.be.true();
                done();
            });
        });
        it('should output false after timeout', function (done) {
            this.timeout(3000);
            nhelper.once('input', msg => {
                msg.payload.should.be.false();
                done();
            });
        });
    });
    describe('and distinct _msgid defer 0 timeout 1000', () => {
        it('should output true on true', done => {
            nhelper.once('input', msg => {
                msg.payload.should.be.true();
                done();
            });
            nAndD0.receive({payload: true});
        });
        it('should output false after timeout', function (done) {
            this.timeout(5000);
            nhelper.once('input', msg => {
                msg.payload.should.be.false();
                done();
            });
        });
        it('should output true on true', done => {
            nhelper.once('input', msg => {
                msg.payload.should.be.true();
                done();
            });
            nAndD0.receive({payload: true});
        });
        it('should output false on false', done => {
            nhelper.once('input', msg => {
                msg.payload.should.be.false();
                done();
            });
            nAndD0.receive({payload: false});
        });
    });
});
