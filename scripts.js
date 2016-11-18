(function() {
	'use strict';

	init();

	function init() {
		// Register the service worker if available.
		if ('serviceWorker' in navigator) {
	    navigator.serviceWorker.register('./sw.js').then(function(reg) {
	        console.log('Successfully registered service worker', reg);
	    }).catch(function(err) {
	        console.warn('Error whilst registering service worker', err);
	    });
		}

		window.addEventListener('online', function(e) {
	    // Resync data with server.
	    console.log("You are online");
	    $('body').classList.remove('offline');
	    $('.offline__message').style.display = 'none';
	    $('.schedule__form__input').disabled = false;
	    $('.schedule__form__submit').disabled = false;
		}, false);

		window.addEventListener('offline', function(e) {
	    console.log("You are offline");
	    $('body').classList.add('offline');
	    $('.offline__message').style.display = 'block';
	    $('.schedule__form__input').disabled = true;
	    $('.schedule__form__submit').disabled = true;    
		}, false);

		// Check if the user is connected.
		if (navigator.onLine) {
	    //Arrivals.loadData();
		} else {
		   // Show offline message
	    //Page.showOfflineWarning();
		}

		// Set Knockout view model bindings.
		//ko.applyBindings(Page.vm);		

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

			$('.schedule__results').innerHTML = '';
			$('.loading').style.display = 'block';
			var data = getData(number);
		});
	}

	function getData(number) {
		var request = new XMLHttpRequest();
		request.open('GET', 'http://localhost:8080/' + number, true);

		request.onload = function() {
		  if (request.status >= 200 && request.status < 400) {
		    var data = JSON.parse(request.responseText);
		    buildResult(data);
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
		/* PROCESS BUS STOP DATA */
		var point = document.createElement('div');

		var point_number = document.createElement('h3');
		point_number.classList.add('point__number');
		point_number.innerHTML = 'Ponto ' + data.number;

		var point_address = document.createElement('p');
		point_address.classList.add('point__address');
		point_address.innerHTML = data.address;

		var point_description = document.createElement('p');
		point_description.classList.add('point__description');
		point_description.innerHTML = data['reference-point'];

		var request_datetime = data['request-date'].split(' ');
		var request_date = request_datetime[0].replace(/-/g, '/');
		var request_time = request_datetime[1];

		var datetime = document.createElement('p');
		datetime.classList.add('datetime');
		datetime.innerHTML = '<strong>' + request_date + ' às ' + request_time + '</strong>'

		point.append(point_number);
		point.append(point_address);
		point.append(point_description);
		point.append(datetime);

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

			lines.append(lines_item);
		}

		$('.schedule__results').append(point);
		$('.schedule__results').append(lines);	
		$('.loading').style.display = 'none';
		$('.schedule__results').style.display = 'block';
	}

	function showToast(status, message) {
		
	}

	function $(elem) {
		return document.querySelector(elem);
	}

	function $$(elem) {
		return document.querySelectorAll(elem);
	}
})();