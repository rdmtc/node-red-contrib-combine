module.exports = function (RED) {
    class CombineDeferNode {
        constructor(config) {
            RED.nodes.createNode(this, config);

            this.state = {};
            this.timer = {};
            this.on('input', msg => {
                /*
                let match;
                switch (config.condition) {
                    case 'eq':
                        match = msg.payload === config.tPayload;
                        break;
                    case 'neq':
                        match = msg.payload !== config.tPayload;
                        break;
                    case 'gt':
                        match = msg.payload > config.payload;
                        break;
                    case 'lt':
                        match = msg.payload < config.payload;
                        break;
                    case 'gte':
                        match = msg.payload <= config.payload;
                        break;
                    case 'lte':
                        match = msg.payload >= config.payload;
                        break;
                    case 'btwn':
                        match = (msg.payload >= config.lower) && (msg.payload <= config.upper);
                        break;
                    default:
                }
                */
                if (msg.payload) {
                    if (!this.timer[msg.topic] && !this.state[msg.topic]) {
                        this.state[msg.topic] = true;
                        this.timer[msg.topic] = setTimeout(() => {
                            this.timer[msg.topic] = null;
                            this.send(msg);
                            this.status({fill: 'blue', shape: 'dot'});
                        }, config.timeout * 1000);
                        this.status({fill: 'blue', shape: 'ring'});
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
    RED.nodes.registerType('combine-defer', CombineDeferNode);
};
