module.exports = function (RED) {
    class CombineDeltaNode {
        constructor(config) {
            RED.nodes.createNode(this, config);
            this.topic = config.topic;
            this.status({fill: 'grey', shape: 'ring'});
            this.on('input', msg => {
                if (msg.topic === config.topicA) {
                    const val = parseFloat(msg.payload);
                    if (isNaN(val)) {
                        delete this.valA;
                    } else {
                        this.valA = val;
                    }
                    this.calc();
                } else if (msg.topic === config.topicB) {
                    const val = parseFloat(msg.payload);
                    if (isNaN(val)) {
                        delete this.valB;
                    } else {
                        this.valB = val;
                    }
                    this.calc();
                }
            });
        }

        calc() {
            if (typeof this.valA !== 'undefined' && typeof this.valB !== 'undefined') {
                const delta = this.valA - this.valB;
                this.send({topic: this.topic, payload: delta});
                this.status({fill: 'blue', shape: 'dot', text: 'Δ ' + delta.toFixed(3)});
            } else {
                this.status({fill: 'grey', shape: 'ring'});
            }
        }
    }
    RED.nodes.registerType('combine-delta', CombineDeltaNode);
};
