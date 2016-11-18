(function() {
	'use strict';

	init();

	function init() {
		$('.toolbar__icon').addEventListener('click', function(e) {
			e.preventDefault();
			$('.menu').classList.add('opened');
			$('.overlay').classList.add('active');			
		});

		$('.overlay').addEventListener('click', function(e) {
			e.preventDefault();
			$('.menu').classList.remove('opened');
			$('.overlay').classList.remove('active');			
		});

		$$('.menu__item')[0].addEventListener('click', function(e) {
			e.preventDefault();
			$('#schedule').style.display = 'block';	
			$('#about').style.display = 'none';	
			$('.menu').classList.remove('opened');
			$('.overlay').classList.remove('active');	
		});	

		$$('.menu__item')[1].addEventListener('click', function(e) {
			e.preventDefault();
			$('#schedule').style.display = 'none';	
			$('#about').style.display = 'block';
			$('.menu').classList.remove('opened');
			$('.overlay').classList.remove('active');		
		});

		$('.schedule__form').addEventListener('submit', function(e) {
			e.preventDefault();

			var error = $('.schedule__form__error');
			error.style.display = 'none';

			var number = $('.schedule__form__input').value;
			
			try {
				number = parseInt(number);
			} catch(e) {
				console.log(e);
			}

			if(!(number > 0 && number < 10000)) {
				error.innerHTML = 'Número inválido';
				error.style.display = 'block';
				return;
			}

			//var data = getData(number);
			try {
				loadJSONP('http://easybus.tk/api/v1/point/' + number, buildResult);
			} catch( err ) {
				console.log(err);
			}
		});
	}

	function getData(number) {
		var request = new XMLHttpRequest();
		request.open('GET', 'http://easybus.tk/api/v1/point/' + number, true);

		request.onload = function() {
		  if (request.status >= 200 && request.status < 400) {
		    var data = JSON.parse(request.responseText);
		  } else {
		  	showToast(false, 'Erro no servidor. Tente novamente');
		  }
		};

		request.onerror = function() {
		  showToast(false, 'Erro de conexão.');
		};

		request.send();		
	}

	function buildResult(data) {
		data = JSON.parse(data);
		console.log(data);
		if(!data) throw "Error";

		/* PROCESS BUS STOP DATA */
		var point = document.createElement('div');

		var point_number = document.createElement('h3');
		point_number.classList.add('point__number');
		point_number.innerHTML = data.number;

		var point_address = document.createElement('p');
		point_address.classList.add('point__address');
		point_address.innerHTML = data.address;

		var point_description = document.createElement('p');
		point_description.classList.add('point__description');
		point_description.innerHTML = data['reference-point'];

		point.append(point_number);
		point.append(point_address);
		point.append(point_description);

		/* PROCESS BUS LINES DATA */
		var bus_lines = data['bus-lines'];

		var lines = document.createElement('div');
		lines.classList.add('lines');


		for(var i = 0; i < bus_lines.length; i++) {
			var lines_item = document.createElement('div');
			lines_item.classList.add('lines__item');

			/* BUS NUMBER AND NAME */
			var lines_item_number = document.createElement('div');
			lines_item_number.classList.add('lines__item__number');

			var number_h3 = document.createElement('h3');
			number_h3.innerHTML = bus_lines[i].number;

			var number_p = document.createElement('p');
			number_p.innerHTML = bus_lines[i].name;

			lines_item_number.append(number_h3);
			lines_item_number.append(number_p);


			/* BUS NEXT AND FOLLOWING TIMES */
			var lines_item_time = document.createElement('div');
			lines_item_time.classList.add('lines__item__time');

			var time_next = document.createElement('span');

			if(bus_lines[i].next != -1)
				time_next.innerHTML = 'Próximo:  <strong>' + bus_lines[i].next + ' min</strong>';
			else
				time_next.innerHTML = 'Próximo:  <strong> - </strong>';		


			var time_following = document.createElement('span');

			if(bus_lines[i].following != -1)
				time_following.innerHTML = 'Seguinte:  <strong>' + bus_lines[i].following + ' min</strong>';
			else
				time_following.innerHTML = 'Seguinte:  <strong> - </strong>';

			lines_item_time.append(time_next);
			lines_item_time.append(time_following);

			lines_item.append(lines_item_number);
			lines_item.append(lines_item_time);
		}

		$('.schedule__results').append(result[0]);
		$('.schedule__results').append(result[1]);	
	}

	function showToast(status, message) {
		
	}

	function $(elem) {
		return document.querySelector(elem);
	}

	function $$(elem) {
		return document.querySelectorAll(elem);
	}

	var loadJSONP = (function(){
	  var unique = 0;
	  return function(url, callback, context) {
	    // INIT
	    var name = "_jsonp_" + unique++;
	    if (url.match(/\?/)) url += "&callback="+name;
	    else url += "?callback="+name;
	    
	    // Create script
	    var script = document.createElement('script');
	    script.type = 'text/javascript';
	    script.src = url;
	    
	    // Setup handler
	    window[name] = function(data){
	      callback.call((context || window), data);
	      document.getElementsByTagName('head')[0].removeChild(script);
	      script = null;
	      delete window[name];
	    };
	    
	    // Load JSON
	    document.getElementsByTagName('head')[0].appendChild(script);
	  };
	})();	
})();