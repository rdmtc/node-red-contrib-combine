module.exports = function (RED) {
    class CombineListNode {
        constructor(config) {
            RED.nodes.createNode(this, config);

            this.msgs = {};
            this.timeouts = {};

            this.topic = config.topic || '';
            this.payload = config.payload;
            this.sort = config.sort;
            this.order = config.order;
            this.distinction = config.distinction || 'topic';
            this.defer = parseInt(config.defer, 10) || 0;
            this.timeout = parseInt(config.timeout, 10) || 0;

            this.on('input', this.handleMsg);
        }

        handleMsg(incoming) {
            const key = incoming[this.distinction];
            this.msgs[key] = incoming.payload;
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

        csvEscape(str) {
            str = String(str);
            if (str.match(/ /)) {
                str = '"' + str + '"';
            }
            return str;
        }

        combine() {
            const arr = [];
            const keys = Object.keys(this.msgs);
            keys.forEach(key => {
                arr.push([key, this.msgs[key]]);
            });

            const topics = [];
            if (this.sort) {
                arr.sort((a, b) => {
                    const idx = this.sort === 'payload' ? 1 : 0;
                    return this.order === 'desc' ? a[idx] < b[idx] : a[idx] > b[idx];
                });
            }
            arr.forEach(key => topics.push(key[0]));

            let payload;
            switch (this.payload) {
                case 'csv':
                    payload = '';
                    arr.forEach(item => {
                        payload += `${this.csvEscape(item[0])},${this.csvEscape(item[1])}\n`;
                    });
                    break;
                case 'html':
                    payload = '<table class="combine-list">\n';
                    arr.forEach(item => {
                        payload += `    <tr><td class="combine-list-topic">${item[0]}</td><td class="combine-list-payload">${item[1]}</td></tr>\n`;
                    });
                    payload += '</table>\n';
                    break;
                default:
                    payload = arr;
            }
            console.log(this.payload, payload);
            return {
                topic: this.topic,
                payload,
                topics
            };
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
    }

    RED.nodes.registerType('combine-list', CombineListNode);
};
