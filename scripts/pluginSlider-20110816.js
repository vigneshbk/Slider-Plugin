/*
=-=-=-=-=-=-=-=-=-=-=-=-=
pluginSlider-20110816.js

Author : Jeffrey D. Stein
Title : Slider Plugin
Date Created : 2011-May-24
Last Updated : 2011-Aug-16
Version : 3.8

Notes
=-=-=-=-=-=-=-=-=-=-=-=-=
2011-Aug-16
v/3.8
 - Comment out console logging.
-------------------------
2011-Aug-11
v/3.7
 - Added CSS notches to single, lower and upper range inputs.
 - Consolidated some styles using LESS.
-------------------------
2011-Aug-11
v/3.6
 - Optimization help from Kirin Murphy:
 -- Added "parseInt" to lower and upper range input value getters.
 -- General optimization.
-------------------------
2011-Aug-09
v/3.5
 - Added code that inserts min and max inputs if they aren't hard-coded, or sets values of existing min and max inputs.
-------------------------
2011-Aug-09
v/3.4
 - Added code to put all inputs inside a fieldset.
 - Added settings for min and max classes.
-------------------------
2011-Aug-04
v/3.3
 - Never mind.  Seems to already work fine with unique fieldsets.
 - Need to tweak code so it accepts min and max inputs with unique fieldsets.
-------------------------
2011-July-28
v/3.2
 - Playing around with min and max inputs.  These should exist in the code so they don't need to be generated dynamically.
-------------------------
2011-July-26
v/3.1
 - Added code that creates and appends value input(s) to handle(s).
-------------------------
2011-July-12
v/3.0
 - Optimized by Kirin Murphy.
-------------------------
2011-July-12
v/2.0
 - Need to optimize so that data is grabbed from hard coded inputs (if they exist) before the create function runs.
 - Trying to make it a plugin.
-------------------------
2011-June-20
v/1.0
 - Some improvements.
-------------------------
2011-May-24
v/Beta
 - Starting out.  Not a plugin yet.
-------------------------
=-=-=-=-=-=-=-=-=-=-=-=-=
*/

(function($) {

	$.fn.doUniSlider = function(options) {
	
		var settings = {
		
			// our plugin settings
			getDataFromInputs : false,
			inputMinClass : 'inputMin',
			inputMaxClass : 'inputMax',
			inputLowerClass : 'inputLower',
			inputUpperClass : 'inputUpper',
			inputSingleClass : 'inputSingle',
			sliderUnits : 'mile',
			theme : 'default', // potential setting for applying a unique style theme
			readOnly : true, // potential setting for making the inputs read only
			
			// slider specific settings
            range : true,
			value : null,
			values : null,
			disabled : false,
			animate : true,
			max : 100,
			min : 0, 
			orientation : 'horizontal', 
			step : 1

		};

		return this.each(function() {
			
			if (options) { $.extend(settings, options) }
		
			var $mySlider = $(this);


			// Add slider class to $mySlider.
			$mySlider.addClass('slider');

			// Tell us which slider instance we are working with.
//			console.log('::::::::::::::::::');
//			console.log('$mySlider: ', $mySlider.attr('id'));

			// Fieldset Checker - Make sure all inputs are in a fieldset.
			// Find out if a fieldset exists within the slider already.
			if ( $mySlider.find('fieldset').length > 0 ) {

				// Yes, we already have a fieldset, so...
                // Find all inputs so they can be gathered into my fieldset.
				var $inputAll = $mySlider.find('input');
				var $myFieldset = $mySlider.find('fieldset');

                // Append all inputs to my fieldset.
				$inputAll.appendTo($myFieldset);

			} else {

                // Making a fieldset if it does not exist.
				var $myFieldset = $('<fieldset />');

                // Append fieldset to my slider.
				$myFieldset.appendTo($mySlider);

			};
			
			// Get data from inputs and is a range slider.
			if ( settings.getDataFromInputs === true && settings.range === true ) {
//				console.log('range, from inputs...');

				// Reset all settings
				settings.values = [];  // resets in case array already has values
//				settings.min = null;
//				settings.max = null;

				settings.values.push( parseInt($mySlider.find('.' + settings.inputLowerClass).val()) );
				settings.values.push( parseInt($mySlider.find('.' + settings.inputUpperClass).val()) );
				settings.min = $mySlider.find('.' + settings.inputMinClass).val();
				settings.max = $mySlider.find('.' + settings.inputMaxClass).val();

//				console.log('min:', settings.min, ' - ', settings.values, '- ', settings.max, ':max');

				// Get data from inputs and is NOT a range slider.
			} else if ( settings.getDataFromInputs === true && settings.range != true ) {
//				console.log('NOT range, from inputs...');

				// Reset all settings
//				settings.value = null;  // resets in case array already has values
//				settings.min = null;
//				settings.max = null;

				settings.value = parseInt($mySlider.find('.' + settings.inputSingleClass).val());
				settings.min = $mySlider.find('.' + settings.inputMinClass).val();
				settings.max = $mySlider.find('.' + settings.inputMaxClass).val();

//				console.log('min:', settings.min, ' - ', settings.value, ' - ', settings.max, ':max');

			// Do nothing here if we are NOT getting data from inputs.
			} else {
				// Value or values will be passed in.  Do nothing.
//				console.log('passed in...');
			};
			
			var createSlider = function( $mySlider, ui ) {

				// Create CSS-based notches for the handle inputs.
				var $notchDown = $('<div />').addClass('sliderNotchDown');
				var $notchUp = $('<div />').addClass('sliderNotchUp');

				// Conditions for range:true, (getDataFromInputs:true, getDataFromInputs:false).
				// If it's a range slider...
				if ( settings.range === true ) {
					var $myHandleMany = $mySlider.find('.ui-slider-handle');
//						console.log('handles : ', $myHandleMany);

					// Find the lower and upper value inputs & min and max inputs if we are getting data from inputs.
					if ( settings.getDataFromInputs === true ) {

						var $myInputMin = $mySlider.find('.' + settings.inputMinClass);
						var $myInputMax = $mySlider.find('.' + settings.inputMaxClass);
						var $myInputLower = $mySlider.find('.' + settings.inputLowerClass);
						var $myInputUpper = $mySlider.find('.' + settings.inputUpperClass);

					// Create lower and upper value inputs & min and max inputs if we are passing in data.
					} else {

						var $myInputLower = $('<input />').addClass(settings.inputLowerClass).attr('type','text').attr('value',settings.values[0]);
						var $myInputUpper = $('<input />').addClass(settings.inputUpperClass).attr('type','text').attr('value',settings.values[1]);
						var $myInputMin = $('<input />').addClass(settings.inputMinClass).attr('type','text').attr('value',settings.min);
						var $myInputMax = $('<input />').addClass(settings.inputMaxClass).attr('type','text').attr('value',settings.max);

					};

					// Append lower and upper inputs to the handles.
					$myInputLower.appendTo($myHandleMany[0]);
					$myInputUpper.appendTo($myHandleMany[1]);
					$notchDown.appendTo($myHandleMany[0]);
					$notchDown.clone().appendTo($myHandleMany[1]);

					// Append min and max inputs to the fieldset.
					$myInputMin.attr('disabled', 'disabled').appendTo($myFieldset);
					$myInputMax.attr('disabled', 'disabled').appendTo($myFieldset);

				// Conditions for range:false||'min'||'max', (getDataFromInputs:true, getDataFromInputs:false).
				// If it's a min or max only slider...
				} else {
					var $myHandleSingle = $mySlider.find('.ui-slider-handle');

					// Find the value input & min and max inputs if we are getting data from inputs.
					if ( settings.getDataFromInputs === true ) {

						var $myInputSingle = $mySlider.find('.' + settings.inputSingleClass);
						var $myInputMin = $mySlider.find('.' + settings.inputMinClass);
						var $myInputMax = $mySlider.find('.' + settings.inputMaxClass);

//						console.log('min:', settings.min, ' - ', settings.values, '- ', settings.max, ':max');

					// Create the value input & min and max inputs if we are passing in data.
					} else {

						var $myInputSingle = $('<input />').addClass(settings.inputSingleClass).attr('type','text').attr('value',settings.value);
						var $myInputMin = $('<input />').addClass(settings.inputMinClass).attr('type','text').attr('value',settings.min);
						var $myInputMax = $('<input />').addClass(settings.inputMaxClass).attr('type','text').attr('value',settings.max);
						
//						console.log('min:', settings.min, ' - ', settings.values, '- ', settings.max, ':max');

					};

					// Append input to the handle.
					$myInputSingle.appendTo($myHandleSingle);
					$notchDown.appendTo($myHandleSingle);

					// Append min and max inputs to the fieldset.
					$myInputMin.attr('disabled', 'disabled').appendTo($myFieldset);
					$myInputMax.attr('disabled', 'disabled').appendTo($myFieldset);

				};
//						console.log('ui : ', ui);
//						console.log('ui.handle : ', ui.handle);
//						console.log('ui.value : ', ui.value);
				// Reduce opacity to normal.
				$mySlider.find('.ui-slider-handle').children().css({'opacity':'0.75','filter':'Alpha(Opacity=75)'});
			};
			
			var startSlider = function( $mySlider, ui ) {
				// Increase opacity to full while sliding to highlight the handle.
				$(ui.handle).children().css({'opacity':'1','filter':'Alpha(Opacity=100)'}); //setter
//						console.log('ui.handle : ', ui.value);
			};

			var slideSlider = function( $mySlider, ui ) {
				// Update handle with value of input box as it slides.
//				ui.value = $(ui.handle).find('input').attr('value'); //setter
				// Update input box with value of handle as it slides.
//				console.log('ui.handle : ', ui.handle);
//				console.log('ui.value : ', ui.value);
//				console.log('$(ui.handle) : ', $(ui.handle));
//				console.log('mySlider.find ui.handle : ', $mySlider.find(ui.handle));
				$mySlider.find(ui.handle).find('input').val( ui.value );


//						console.log('ui.handle : ', ui.value);
			};

			var stopSlider = function( $mySlider, ui ) {
				// Return opacity to normal.
				$(ui.handle).children().css({'opacity':'0.75','filter':'Alpha(Opacity=75)'}); //setter
//						console.log('ui.handle : ', ui.value);
			};

			var changeSlider = function( $mySlider, ui ) {
				// Update handle with value of input box as it slides.
//				ui.value = $(ui.handle).find('input').attr('value'); //setter
				// Update input box with value of handle as it slides.
				$mySlider.find(ui.handle).find('input').val( ui.value );
//						console.log('ui.handle : ', ui.value);
			};

			$mySlider.slider({
				disabled: settings.disabled,
				animate: settings.animate,
				max: settings.max,
				min: settings.min, 
				orientation: settings.orientation,
				range: settings.range,
				step: settings.step,
				value: settings.value,
				values: settings.values,
				create: function( event, ui ) {
//					console.log('-CREATE event triggered');
					createSlider( $mySlider, ui );
				},
				start: function( event, ui ) {
//					console.log('-START event triggered');
					startSlider( $mySlider, ui );
				},
				stop: function( event, ui ) {
//		            console.log('-STOP event triggered');
					stopSlider( $mySlider, ui );
				},
				slide: function( event, ui ) {
//		            console.log('-SLIDE event triggered');
					slideSlider( $mySlider, ui );
				},
				change: function( event, ui ) {
//		            console.log('-CHANGE event triggered');
					changeSlider( $mySlider, ui );
				}				
		
			});

		});
	
	};

})(jQuery)

//$(document).ready(function() {

//});