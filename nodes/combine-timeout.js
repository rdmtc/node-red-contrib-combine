module.exports = function (RED) {
    class CombineTimeoutNode {
        constructor(config) {
            RED.nodes.createNode(this, config);

            this.state = {};
            this.timer = {};
            this.on('input', msg => {
                if (msg.payload) {
                    if (!this.timer[msg.topic] && !this.state[msg.topic]) {
                        this.state[msg.topic] = true;
                        this.timer[msg.topic] = setTimeout(() => {
                            this.timer[msg.topic] = null;
                            this.send(msg);
                            this.status({fill: 'blue', shape: 'ring'});
                        }, config.timeout * 1000);
                        this.status({fill: 'blue', shape: 'dot'});
                    }
                } else {
                    clearTimeout(this.timer[msg.topic]);
                    this.timer[msg.topic] = null;
                    this.state[msg.topic] = false;
                    this.status({});
                }
            });
        }
    }
    RED.nodes.registerType('combine-timeout', CombineTimeoutNode);
};
