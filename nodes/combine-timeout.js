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
                        }, config.timeout * 1000);
                    }
                } else {
                    clearTimeout(this.timer[msg.topic]);
                    this.timer[msg.topic] = null;
                    this.state[msg.topic] = false;
                }
            });
        }
    }
    RED.nodes.registerType('combine-timeout', CombineTimeoutNode);
};
