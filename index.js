//
// Server side
//
(() => {
	'use strict';

	const fs = require('fs');
	const {URL} = require('url');

	class CPULoad {
		constructor() {
			this._Get = () => {
				return new Promise((resolve, reject) => {
					const stat = fs.readFile(new URL('file:///proc/stat'),
						(error, content) => {
							if (error) {
								reject(error);
							}
							else {
								resolve(content);
							}
						});
				})
				.then((content) => {
					const line = content.toString().split('\n')[0];
					const stamp = new Date().toUTCString();
					const msg = {stamp: stamp, line: line};
					return msg;
				})
				.catch((error) => {
					console.error("File system error: ", error);
				});
			};

			this._messageCenter = {};
			this._messenger = new global.helper.Messenger();
			this._messenger.addRequestListener('cpuload#Get', {scopes: ['public']}, this._Get);
		}

		load(messageCenter) {
			this._messageCenter = messageCenter;
			return Promise.resolve()
			.then(() => {
				this._messenger.load(messageCenter);
			})
			.catch((err) => {
				console.error('Failed to load messenger:', err);
			});
		}

		unload() {
			return Promise.resolve()
			.then(() => this._messenger.unload());
		}
	}

	module.exports = new CPULoad();
})();
