/**
 *  CLock.js
 *  @Author: Cailei
 *  @Email: o@cailei.net
 *  @Version: 0.1
 */
 (function($) {

	var weekdays = new Array();
	var week = new Array('Sunday','Monday','Tuesday','Wensday','Thursday','Freiday','Saturday');

    $.fn.CLock = function(options) {

        if (options) {
            $opt = $.extend($.fn.CLock.defaults, options);
        }
		
		var month_days, first_weekday, cur_date, hour, min, sec, month;
		var offset = $opt.country[0][1];

		getData();
		
		var fd = first_weekday;
		for(var o=1; o<month_days+parseInt(1); o++) {
			weekdays[o-1] = fd;
			fd++;
			if(fd == 7) fd = 0;
		};
		var clbody = '<div id="cl-ock">';
		if($opt.showDate == true){
	        clbody += '<div class="cl-panel" id="cl-month" cl-data-w="' + ($opt.outerSize-parseInt(40)) + '" cl-data-z="1005"></div>';
	        clbody += '<div class="cl-panel" id="cl-date" cl-data-w="' + ($opt.outerSize-parseInt(40)) * 0.86 + '" cl-data-z="1006"></div>';
	        clbody += '<div class="cl-panel" id="cl-s" cl-data-w="' + ($opt.outerSize-parseInt(40)) * 0.72 + '" cl-data-z="1007"></div>';
	        clbody += '<div class="cl-panel" id="cl-m" cl-data-w="' + ($opt.outerSize-parseInt(40)) * 0.55 + '" cl-data-z="1008"></div>';
	        clbody += '<div class="cl-panel" id="cl-h" cl-data-w="' + ($opt.outerSize-parseInt(40)) * 0.35 + '" cl-data-z="1009"></div>';
	        clbody += '<div class="cl-panel" id="cl-country" cl-data-w="' + ($opt.outerSize-parseInt(40)) * 0.16 + '" cl-data-z="1010"></div>';
		}else{
	        clbody += '<div class="cl-panel" id="cl-s" cl-data-w="' + ($opt.outerSize-parseInt(40)) + '" cl-data-z="1007"></div>';
	        clbody += '<div class="cl-panel" id="cl-m" cl-data-w="' + ($opt.outerSize-parseInt(40)) * 0.70 + '" cl-data-z="1008"></div>';
	        clbody += '<div class="cl-panel" id="cl-h" cl-data-w="' + ($opt.outerSize-parseInt(40)) * 0.44 + '" cl-data-z="1009"></div>';
	        clbody += '<div class="cl-panel" id="cl-country" cl-data-w="' + ($opt.outerSize-parseInt(40)) * 0.21 + '" cl-data-z="1010"></div>';
		}
        clbody += '</div>';
        var $clockbody = $(clbody);
        $(this).append($clockbody);
		
        $('.cl-panel').each(function() {
            var w = $(this).attr('cl-data-w'),
            	z = $(this).attr('cl-data-z');
            $(this).setCSS(w, z);
        });

        var $clock = $('#cl-ock'),
        $seconds = $('#cl-s'),
        $minutes = $('#cl-m'),
        $hours = $('#cl-h'),
        $dates = $('#cl-date'),
        $months = $('#cl-month'),
        $country = $('#cl-country');

        $seconds.setRound(60, 'time');
        $minutes.setRound(60, 'time');
        $hours.setRound(24, 'time');
        $dates.setRound(month_days, 'date');
        $months.setRound(12, 'month');
        $country.setRound($opt.country.length, 'country');
        $clock.width($opt.outerSize + parseInt($('.box').height())).height($opt.outerSize + parseInt($('.box').height())).mousedown(function() {
    	return false;
    });

		$('.country').each(function() {
			$(this).click(function() {
				offset = $(this).attr('cl-data-timezone');
			});
		});
		
        showClock();

        var cl_refresch = setInterval(function() {
            showClock();
        },
        1000);

        function showClock() {
			getData();
            $hours.active(24, hour, '33', '14', '#333', '#ccc');
            $minutes.active(60, min, '28', '11', '#444', '#ccc');
            $seconds.active(60, sec, '22', '9', '#555', '#ccc');
            $dates.active(month_days, cur_date, '20', '9', '#666', '#ccc');
            $months.active(12, month, '26', '9', '#777', '#ccc');
        }

		function getData() {
			var date = new Date(),
            	UTC = date.getTime() + (date.getTimezoneOffset() * 60000),
            	newDate = new Date(UTC + (3600000 * offset)),
            	weekday = newDate.getDay().toString(),
            	fullYear = date.getFullYear();

			month = parseInt(newDate.getMonth().toString()) + 1;
           	min = parseInt(newDate.getMinutes().toString());
           	sec = parseInt(newDate.getSeconds().toString());
           	hour = parseInt(newDate.getHours().toString());
            cur_date = newDate.getDate();
            first_weekday = new Date(fullYear, month - 1, 1).getDay();  //求出当月的第一天是星期几
            month_days = new Date(fullYear, month, 0).getDate();  //上月的第0天就是今月的最后一天
			//alert(month_days);
            if (min == 0) min = 60;
            if (sec == 0) sec = 60;
            if (hour == 0) hour = 24;
		}
    };

    $.fn.setCSS = function(w, z) {
        $(this).css({
            'width': w + 'px',
            'height': w + 'px',
            'position': 'absolute',
            'top': '50%',
            'left': '50%',
            'margin-top': '-' + w / 2 + 'px',
            'margin-left': '-' + w / 2 + 'px',
            'z-index': z
        });
    };

    $.fn.setRound = function(num, type) {
        var holder = this;
        for (var i = 1; i < (num + 1); i++) {
            if (type == 'country') {
                var $box = '<span class="box country" cl-data-country="'+$.fn.CLock.defaults.country[i-1][0]+'" cl-data-timezone="'+$.fn.CLock.defaults.country[i-1][1]+'"><a title="'+$.fn.CLock.defaults.country[i-1][0]+'">&bull;</a></span>';
            } else if(type == 'date') {
				if(weekdays[i-parseInt(1)] == 6 || weekdays[i-parseInt(1)] == 0) {
					var $box = '<span class="box weekend" title="'+ week[weekdays[i-parseInt(1)]] +'">' + i + '</span>';
				} else {
					var $box = '<span class="box" title="'+ week[weekdays[i-parseInt(1)]] +'">' + i + '</span>';
				};
			} else {
                if (i == num) {
                    if (type == 'month') {
                        var $box = '<span class="box">' + i + '</span>';
                    } else {
                        var $box = '<span class="box">0</span>';
                    }
                } else {
                    var $box = '<span class="box">' + i + '</span>';
                }
            };
            holder.append($box);
            var b = 360 / num * i / 2 * (Math.PI / 180);
            var x = 2 * (holder.height() / 2) * Math.cos(b) * Math.sin(b) - parseInt($('.box').height() / 2) + parseInt((holder.height() / 2));
            var y = (holder.height() / 2) * (parseInt(1) + 2 * Math.sin(b) * Math.sin(b)) - parseInt($('.box').height() / 2) - parseInt((holder.height() / 2));
            holder.children('span:last').css({
                'top': y + 'px',
                'left': x + 'px'
            });
        }
    };

    $.fn.active = function(size, num, fontsize_up, fontsize_down, color_up, color_down) {
        var itm = $(this);
        //itm.css({
        //	'-webkit-transform' : 'rotate(-'+ 360/size*num +'deg)'
        //});
        itm.find('span:nth-child(' + num + ')')
        .animate({
            fontSize: fontsize_up + 'px'
        },
        200)
        .css({
            'color': color_up,
            'z-index': '1111',
            'font-weight': 'bold'
            //'-webkit-transform' : 'rotate('+ 360/size*num +'deg)'
        })
        .siblings()
        .animate({
            fontSize: fontsize_down + 'px'
        },
        50)
        .css({
            'color': color_down,
            'z-index': '1110',
            'font-weight': 'normal'
            //'-webkit-transform' : 'rotate('+ 360/size*num +'deg)'
        });
    }
    
	// default options
	$.fn.CLock.defaults = {
        outerSize: 300,
        country: [
        ['Germany', '+2'],
        ['China', '+8'],
        ['Hawaii', '-10']],
		showDate: true
	};
	
})(jQuery);
