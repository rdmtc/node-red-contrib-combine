module.exports = function (RED) {
    class CombineDeferNode {
        constructor(config) {
            RED.nodes.createNode(this, config);

            if (config.invert === 'false') {
                config.invert = false;
            } else {
                config.invert = Boolean(config.invert);
            }

            this.config = config;

            this.state = {};
            this.timer = {};

            this.on('input', msg => {
                if (Boolean(msg.payload) === config.invert) {
                    clearTimeout(this.timer[msg.topic]);
                    this.timer[msg.topic] = null;
                    this.state[msg.topic] = false;
                    this.status({});
                } else if (!this.timer[msg.topic] && !this.state[msg.topic]) {
                    this.state[msg.topic] = true;

                    this.getTimeout(msg).then(timeout => {
                        this.timer[msg.topic] = setTimeout(() => {
                            this.timer[msg.topic] = null;
                            this.send(msg);
                            this.status({fill: 'blue', shape: 'dot'});
                        }, timeout * 1000);
                        this.status({fill: 'blue', shape: 'ring'});
                    });
                }
            });
        }

        getTimeout(msg) {
            return new Promise((resolve, reject) => {
                const type = this.config.timeoutType;
                const val = this.config.timeout;

                switch (type) {
                    case 'msg':
                        resolve(RED.util.getMessageProperty(msg, val));
                        break;

                    case 'flow':
                    case 'global': {
                        const contextKey = RED.util.parseContextStore(val);
                        this.context()[type].get(contextKey.key, contextKey.store, (err, res) => {
                            if (err) {
                                reject(err);
                            } else {
                                resolve(res);
                            }
                        });
                        break;
                    }

                    case 'env':
                        resolve(RED.util.evaluateNodeProperty(val, 'env', this));
                        break;

                    default:
                        resolve(val);
                }
            });
        }
    }
    RED.nodes.registerType('combine-defer', CombineDeferNode);
};
