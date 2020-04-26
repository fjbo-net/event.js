(function(){
	if(!window.FJBO) window.FJBO = {};
	if(window.FJBO.EventJs) return;

	let EventJs = function() {
		if(!EventJs.prototype.instance) EventJs.prototype.instance = this;
		else return EventJs.prototype.instance;

		let _this = this;

		EventJs.prototype.build = (name, target) => {
			if(typeof event === 'function') {
				return (new Event(name));
			} else {
				let ieEvent = window.document.createEvent('UIEvents');
				ieEvent.initUIEvent(name, true, false, target, 0);
				return ieEvent;
			}
		};

		EventJs.prototype.dispatch = (name, target) => {
			let
			eventTarget = typeof target === 'undefined'
				? window
				: target,
			eventDispatcher = window.dispatchEvent || window.triggerEvent;

			return eventDispatcher(_this.build(name, eventTarget));
		};

		_this.dispatch('FJBO.EventJs.ready');
	};

	window.FJBO.EventJs = new EventJs();
})();
