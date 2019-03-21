module.exports = function (RED) {
    class CombineListNode {
        constructor(config) {
            RED.nodes.createNode(this, config);

            this.msgs = {};
            this.timeouts = {};

            this.topic = config.topic || '';
            this.columns = config.columns;
            this.payload = config.payload;
            this.falsy = config.falsy !== 'exclude';
            this.sort = config.sort;
            this.order = config.order;
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
                this.msgs[key] = incoming;
            }

            if (this.defer) {
                this.sendDeferred();
            } else {
                this.send(this.combine());
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
                arr.push(this.msgs[key]);
            });

            if (this.sort) {
                arr.sort((a, b) => {
                    return this.order === 'desc' ? a[this.sort] < b[this.sort] : a[this.sort] > b[this.sort];
                });
            }

            const topics = [];
            arr.forEach(item => topics.push(item.topic));

            let payload;
            switch (this.payload) {
                case 'csv':
                    payload = '';
                    arr.forEach(item => {
                        const cols = [];
                        this.columns.forEach(col => {
                            cols.push(this.csvEscape(item[col]));
                        });
                        payload += cols.join(',') + '\n';
                    });
                    break;
                case 'html':
                    payload = '<table class="combine-list">\n';
                    arr.forEach(item => {
                        payload += '    <tr>';
                        this.columns.forEach(col => {
                            payload += `<td class="combine-list-topic">${item[col]}</td>`;
                        });
                        payload += '</tr>\n';
                    });
                    payload += '</table>\n';
                    break;
                case 'ul':
                    payload = '<ul class="combine-list">\n';
                    arr.forEach(item => {
                        payload += '    <li>';
                        const elems = [];
                        this.columns.forEach(col => {
                            elems.push(item[col]);
                        });
                        payload += `${elems.join(', ')}</li>\n`;
                    });
                    payload += '</ul>\n';
                    break;
                default:
                    payload = [];
                    arr.forEach(item => {
                        let cols = [];
                        this.columns.forEach(col => {
                            cols.push(item[col]);
                        });
                        if (cols.length === 1) {
                            [cols] = cols;
                        }

                        payload.push(cols);
                    });
            }

            return {
                topic: this.topic,
                payload,
                topics,
                arr
            };
        }

        sendDeferred() {
            if (!this.sendTimeout) {
                this.sendTimeout = setTimeout(() => {
                    this.send(this.combine());
                    this.sendTimeout = null;
                }, this.defer);
            }
        }
    }

    RED.nodes.registerType('combine-list', CombineListNode);
};
