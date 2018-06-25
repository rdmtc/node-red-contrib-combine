# node-red-contrib-combine

[![NPM version](https://badge.fury.io/js/node-red-contrib-combine.svg)](http://badge.fury.io/js/node-red-contrib-combine)
[![dependencies Status](https://david-dm.org/hobbyquaker/node-red-contrib-combine/status.svg)](https://david-dm.org/hobbyquaker/node-red-contrib-combine)
[![Build Status](https://travis-ci.org/hobbyquaker/node-red-contrib-combine.svg?branch=master)](https://travis-ci.org/hobbyquaker/node-red-contrib-combine)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![License][mit-badge]][mit-url]

> Node-RED Nodes that output combinations of consecutive incoming messages

These nodes aim to solve typical use cases where multi-input nodes (something that doesn't exist in Node-RED's conecpt)
would be convenient. Incoming messages are stored internally by the nodes so combinations of multiple messages can be
provided. Distinction of these messages is based on their `topic` property.


## Nodes

#### If

Forwards messages to the first output when previously received a truthy payload on "Condition Topic", otherwise messages 
will be routed to the second output.

#### Logic

Logic combination of incoming messages (And, Or, Xor, Nand, Nor, Xnor).

#### Delta

Simple subtraction of the values received on two configured topics.

#### Bangbang

Bang-bang (2 step / on-off) Controller. Emits `true` when the the payload value exceeds the upper bound, emits
`false` when the payload goes below the lower bound. You could e.g. use this as a simple thermostat for a
climate control, feed in the actual temperature and use the output to control a cooling device. For a heating
device you would have to use the "invert" option, so you receive `false` when exceeding the upper bound and
`true` when going below the lower bound.


#### Statistic

Calculate statistic samples like e.g. min, max, mean, median, ... from incoming payloads. Message distinction can be
configured to `msg.topic` or `msg._id`. A timeout can be configured that removes messages from the internal cache. 
The statistics are re-composed when a message times out.
 
#### List

Compose a table of consecutive incoming topics and payloads. Output as array, csv, html table or html list. Columns and 
sort order can be configured. Message distinction can be configured to `msg.topic` or `msg._id`. A timeout can be 
configured that removes messages from the internal cache. The tables are re-composed when a message times out.

#### Defer

Defer a message with truthy payload for given time.
If another message arrives with falsy payload the timer is cancelled.
Keeps track on each topics state, only one message per topic will be sent until resetted by a falsy payload.


## License

MIT (c) Sebastian Raff

[mit-badge]: https://img.shields.io/badge/License-MIT-blue.svg?style=flat
[mit-url]: LICENSE
