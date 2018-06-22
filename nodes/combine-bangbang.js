module.exports = function (RED) {
    class CombineBangbangNode {
        constructor(config) {
            RED.nodes.createNode(this, config);
            this.upper = parseFloat(config.upper);
            this.lower = parseFloat(config.lower);
            this.invert = Boolean(config.invert);
            this.status({fill: 'grey', shape: 'ring'});
            this.on('input', msg => {
                const val = parseFloat(msg.payload);
                if (isNaN(val)) {
                    const text = typeof this.state === 'undefined' ? ' ' : String(Boolean(this.state ^ this.invert));
                    this.status({fill: 'red', shape: 'dot', text});
                } else if (val > this.upper && !this.state) {
                    this.setState(true, msg);
                } else if (val < this.lower && (this.state || typeof this.state === 'undefined')) {
                    this.setState(false, msg);
                } else {
                    const text = typeof this.state === 'undefined' ? ' ' : String(Boolean(this.state ^ this.invert));
                    this.status({fill: 'green', shape: 'dot', text});
                }
            });
        }

        setState(state, msg) {
            this.state = Boolean(state);
            msg.payload = Boolean(this.state ^ this.invert);
            this.send(msg);
            this.status({fill: 'green', shape: 'dot', text: msg.payload});
        }
    }
    RED.nodes.registerType('combine-bangbang', CombineBangbangNode);
};
