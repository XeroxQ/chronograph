# Chronograph

Adds precise timer, stopwatch and transition functionality to Homey.

[![Build Status](https://travis-ci.com/fellownet/chronograph.svg?branch=master)](https://travis-ci.com/fellownet/chronograph)
[![Code Climate](https://codeclimate.com/github/fellownet/chronograph/badges/gpa.svg)](https://codeclimate.com/github/fellownet/chronograph)
[![Donate](https://img.shields.io/badge/paypal-donate-blue.svg)](https://www.paypal.me/bobkersten)

## Features

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

**Simple math expressions**

The start, resume and adjust action cards have built-in support for simple math expressions. This allows
for random or computed timer and stopwatch durations, including calculations based on token values.

For example:

```javascript
ceil(99.5) / 5
pick(1, 3, 5, 9) * 2
random(10, 30)
abs(-10)
```

In addition to basic math expressions, the following functions are supported:

* abs(x) - calculate the absolute value of a number,
* ceil(x) - rounds a number up to the next whole number,
* floor(x) - rounds a number down to the previous whole number,
* round(x) - rounds a number towards the nearest whole number,
* random(min, max) - a random number larger or equal to min and smaller than max,
* min(x, y) - the lowest number from the supplied list,
* max(x, y) - the largest number from the supplied list,
* pick(x, y[, n]) - pick a random value from the supplied list.

**HomeyScript**

In addition to the available flow cards, timers and stopwatches can also be controlled using [HomeyScript](https://homeyscript.homey.app).
For example, this script will stop all running timers:

```javascript
let app = await Homey.apps.getApp({id:'nl.fellownet.chronograph'});
app.apiGet('/timers').then(result => {
	let timers = JSON.parse(result);
	timers.forEach(timer => {
		app.apiDelete('/timers/' + timer.id);
	});
});
```

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

## Contributing

To submit a bug report or feature request, please create an [issue at GitHub](https://github.com/fellownet/chronograph/issues/new).

If you'd like to contribute code to this project, please read the
[CONTRIBUTING.md](https://github.com/fellownet/chronograph/blob/master/CONTRIBUTING.md) document.

## Support

If you like this project, perhaps you can support us by making a donation?
- Paypal: [Donate](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=VQNGE3N5L6MKS)
- Bitcoin: 3KU2PbVyB1cVh7n6uNuNYbhuZopC9GP2hp

## Credits

Application image by [Agê Barros](https://unsplash.com/@agebarros?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/search/photos/time?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText).

## Changelog

### v1.1.1

* Ability to delay the execution of flows.
* Additional tokens for transition cards.
* Simplified monitoring of timers, stopwatches and transitions.

### v1.1.0

* Support for the new Homey App Store.
* Prevent stale chronographs after restart.

### v1.0.8

* Added the ability to use wildcards in various action and trigger cards.

### v1.0.7

* Added pause trigger cards.

### v1.0.6

* Added transitions to gradually change a value over time.
* Support for simple math expressions in timer, stopwatch and transition durations.

### v1.0.3

* German translation, thanks to [Copiis](https://github.com/copiis).

### v1.0.2

* Timers and stopwatches are now persistent across application restarts and Homey reboots.
* Pause and resume timers and stopwatches from flow cards.
* Fine-tuning of the settings page.
* Pause and resume timers and stopwatches from settings.
* Support for timers longer than 24.855 days.
* Unit testing.

### v1.0.1

* Added settings screen for overview and stop actions.
* Updated several flow descriptions.
* Fixed a missing import bug.
* Added stop trigger cards and duration tokens.

### v1.0.0

* First public release.
