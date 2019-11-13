FEATURES

* Self-explanatory flow cards for easy integration of timers, stopwatches and transitions in your home automation,
* Create timers, stopwatches and transitions directly from flow cards, no need for a prior configuration,
* Start timers with a duration in milliseconds (fractional seconds), seconds, minutes, hours or days,
* Start stopwatches without a predefined end time,
* Start transitions to gradually change a device parameter over time,
* Trigger flows at exact timer- or stopwatch durations with millisecond (fractional seconds) precision,
* Pause and resume timers, stopwatches and transitions with action cards or from within settings,
* Support for random or computed durations or adjustments using simple math expressions,
* All timers, stopwatches and transitions are persistent across Homey restarts,
* Target multiple timers, stopwatches and transitions at once using wildcards in supported cards.

SIMPLE MATH EXPRESSIONS

The start, resume and adjust action cards have built-in support for simple math expressions. This allows
for random or computed timer and stopwatch durations, including calculations based on token values.

For example:

	ceil(99.5) / 5
	pick(1, 3, 5, 9) * 2
	random(10, 30)
	abs(-10)

In addition to basic math expressions, the following functions are supported:

* abs(x) - calculate the absolute value of a number,
* ceil(x) - rounds a number up to the next whole number,
* floor(x) - rounds a number down to the previous whole number,
* round(x) - rounds a number towards the nearest whole number,
* random(min, max) - a random number larger or equal to min and smaller than max,
* min(x, y) - the lowest number from the supplied list,
* max(x, y) - the largest number from the supplied list,
* pick(x, y[, n]) - pick a random value from the supplied list.

HOMEYSCRIPT

In addition to the available flow cards, timers and stopwatches can also be controlled using [HomeyScript](https://homeyscript.homey.app).
For example, this script will stop all running timers:

	let app = await Homey.apps.getApp({id:'nl.fellownet.chronograph'});
	app.apiGet('/timers').then(result => {
		let timers = JSON.parse(result);
		timers.forEach(timer => {
			app.apiDelete('/timers/' + timer.id);
		});
	});

* GET /timers - retrieve a list of all active timers,
* GET /timers/:id - retrieve a single timer,
* PUT /timers/:id - pause or resume a timer,
* DELETE /timers/:id - stops a timer.
* GET /stopwatches - retrieve a list of all active timers,
* GET /stopwatches/:id - retrieve a single timer,
* PUT /stopwatches/:id - pause or resume a timer,
* DELETE /stopwatches/:id - stops a timer.
* GET /transitions - retrieve a list of all active transitions,
* GET /transitions/:id - retrieve a single transition,
* PUT /transitions/:id - pause or resume a transition,
* DELETE /transitions/:id - stops a transition.
