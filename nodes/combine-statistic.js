module.exports = function (RED) {
    class CombineStatisticNode {
        constructor(config) {
            RED.nodes.createNode(this, config);

            this.msgs = {};
            this.timeouts = {};

            this.topic = config.topic || '';
            this.operator = config.operator;
            this.falsy = config.falsy !== 'exclude';
            this.distinction = config.distinction || 'topic';
            this.defer = parseInt(config.defer, 10) || 0;
            this.timeout = parseInt(config.timeout, 10) || 0;

            this.on('input', this.handleMsg);
        }

        handleMsg(incoming) {
            const key = incoming[this.distinction];

            if (!this.falsy && !incoming.payload) {
                delete this.msgs[key];
            } else {
                this.msgs[key] = incoming.payload;
            }

            const outgoing = this.combine();

            if (this.defer) {
                this.sendDeferred(outgoing);
            } else {
                this.send(outgoing);
            }

            if (this.timeout) {
                clearTimeout(this.timeouts[key]);
                this.timeouts[key] = setTimeout(() => {
                    this.remove(key);
                }, this.timeout);
            }
        }

        remove(key) {
            delete this.msgs[key];
            const msg = this.combine();

            this.send(msg);
        }

        sendDeferred(msg) {
            this.msgDeferred = msg;
            if (!this.sendTimeout) {
                this.sendTimeout = setTimeout(() => {
                    this.send(this.msgDeferred);
                    this.sendTimeout = null;
                }, this.defer);
            }
        }

        combine() {
            const topics = Object.keys(this.msgs);
            const payloads = Object.values(this.msgs);

            const len = payloads.length;

            for (let i = 0; i < len; i++) {
                payloads[i] = Number(payloads[i]) || 0;
            }

            const min = (len > 0 ? Math.min.apply(null, payloads) : null); // prevent "-Infinity" result
            const max = (len > 0 ? Math.max.apply(null, payloads) : null); // prevent "Infinity" result
            const range = max - min;
            const midrange = min + ((max - min) / 2);
            const sum = this.sum(payloads);
            const mean = sum / len;
            const median = this.median(payloads);
            const modes = this.modes(payloads);
            const variance = this.mean(payloads.map(num => num - (mean ** 2)));
            const standardDeviation = Math.sqrt(variance);
            const meanAbsoluteDeviation = this.mean(payloads.map(num => Math.abs(num - mean)));
            const zScores = payloads.map(num => (num - mean) / standardDeviation);

            const combine = {
                topics: this.distinction === 'topic' ? topics : undefined,
                messages: this.distinction === '_msgid' ? topics : undefined,
                len,
                sum,
                min,
                max,
                range,
                midrange,
                mean,
                median,
                modes,
                variance,
                standardDeviation,
                meanAbsoluteDeviation,
                zScores
            };

            const result = combine[this.operator];

            // guard against unwanted results
            if (isNaN(parseInt(result, 10))) {
                return null;
            }

            // return proper results
            return Object.assign({
                topic: this.topic,
                payload: result
            }, combine);
        }

        sum(array) {
            return array.reduce((pv, cv) => pv + cv, 0);
        }

        mean(array) {
            return this.sum(array) / array.length;
        }

        median(array) {
            array.sort((a, b) => a - b);
            const mid = array.length / 2;
            if (mid % 1) {
                return array[mid - 0.5];
            }

            return (array[mid - 1] + array[mid]) / 2;
        }

        modes(array) {
            if (array.length === 0) {
                return array;
            }

            const modeMap = {};
            let maxCount = 1;
            let modes = [array[0]];

            array.forEach(val => {
                if (modeMap[val]) {
                    modeMap[val] += 1;
                } else {
                    modeMap[val] = 1;
                }

                if (modeMap[val] > maxCount) {
                    modes = [val];
                    maxCount = modeMap[val];
                } else if (modeMap[val] === maxCount) {
                    modes.push(val);
                    maxCount = modeMap[val];
                }
            });
            return modes;
        }
    }

    RED.nodes.registerType('combine-statistic', CombineStatisticNode);
};
