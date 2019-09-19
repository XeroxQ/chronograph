# Chronograph

Adds precise timer- and stopwatch functionality to Homey.

[![Build Status](https://travis-ci.com/fellownet/chronograph.svg?branch=master)](https://travis-ci.com/fellownet/chronograph)
[![Code Climate](https://codeclimate.com/github/fellownet/chronograph/badges/gpa.svg)](https://codeclimate.com/github/fellownet/chronograph)

## Features

* Self-explanatory flow cards for easy integration of timers and stopwatches in your home automation,
* Create timers and stopwatches directly from flow cards, no need for a prior configuration,
* Start timers with a duration in milliseconds (fractional seconds), seconds, minutes, hours or days,
* Start stopwatches without a predefined end time,
* Trigger flows at exact timer- or stopwatch durations with millisecond (fractional seconds) precision,
* Pause and resume timers and stopwatches.

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
* GET /timers/<id> - retrieve a single timer,
* PUT /timers/<id> - pause or resume a timer,
* DELETE /timers/<id> - stops a timer.
* GET /stopwatches - retrieve a list of all active timers,
* GET /stopwatches/<id> - retrieve a single timer,
* PUT /stopwatches/<id> - pause or resume a timer,
* DELETE /stopwatches/<id> - stops a timer.

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
