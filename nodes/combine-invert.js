module.exports = function (RED) {
    class CombineInvertNode {
        constructor(config) {
            RED.nodes.createNode(this, config);
            this.on('input', msg => {
                if ((msg.payload === true) ||
                    (msg.payload === 'true') ||
                    (msg.payload === 1) ||
                    (msg.payload === '1')) {
                    msg.payload = false;
                    this.status({fill: 'grey', shape: 'ring', text: 'false'});
                    this.send(msg);
                } else if ((msg.payload === false) ||
                           (msg.payload === 'false') ||
                           (msg.payload === 0) ||
                           (msg.payload === '0')) {
                    msg.payload = true;
                    this.status({fill: 'blue', shape: 'dot', text: 'true'});
                    this.send(msg);
                }
            });
        }
    }
    RED.nodes.registerType('combine-invert', CombineInvertNode);
};
