module.exports = function (RED) {
    class CombineIfNode {
        constructor(config) {
            RED.nodes.createNode(this, config);
            this.status({fill: 'grey', shape: 'ring', text: 'false'});
            this.on('input', msg => {
                if (msg.topic === config.topic) {
                    this.state = Boolean(msg.payload);
                    if (this.state) {
                        this.status({fill: 'blue', shape: 'dot', text: 'true'});
                    } else {
                        this.status({fill: 'grey', shape: 'ring', text: 'false'});
                    }
                } else {
                    if (this.state) {
                        this.send([msg, nul]);
                    } else {
                        this.send([null, msg]);
                    }
                }
            });
        }
    }
    RED.nodes.registerType('combine-if', CombineIfNode);
};
