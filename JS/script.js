var parcels = [];
var players = [{name: "Red", active: 1, bankroll: 0, bid: null}, {name: "Blue", active: 0, bankroll: 0, bid: null}];
//	localStorage.players = players;
var winner = null;
var index = 0;

$(document).ready(function () {
	console.log("JS ready");
	// var zipCodes = [98104, 98101, 98122, 98121, 98112, 98102, 98109, 98119, 98199, 98107, 98117, 98103, 98105, 98115];

	var addParcel = function (p1, p2, sf, lotsf, beds, full, tq, half, yr, app, wf, mr) {
		var newParcel = {parcel1: p1, parcel2: p2, squarefeet: sf, lot: lotsf, 
			bedrooms: beds, fullBR: full, threeQBR: tq, halfBR: half, 
			yearBuilt: yr, value: app, waterfront: wf, mtRainier: mr};

		parcels.push(newParcel);
	};
	addParcel(193030, 0905, 1240, 4800, 2, 1, 1, 0, 1920, 366000, 0, 0);
	addParcel(051000, 3120, 1410, 3040, 2, 1, 1, 0, 1908, 530000, 0, 0);
	addParcel(882790, 0070, 3650, 9040, 5, 1, 0, 1, 1925, 669000, 0, 0);
	addParcel(290220, 1185, 2220, 7250, 4, 1, 1, 0, 1944, 826000, 0, 0);
	addParcel(359250, 0881, 4020, 8230, 3, 1, 0, 1, 1924, 1017000, 0, 0);
	addParcel(982820, 2240, 1380, 4400, 2, 1, 0, 1, 1920, 354000, 0, 0);
	addParcel(794260, 0970, 1300, 4800, 4, 1, 0, 1, 1954, 321000, 0, 0);
	addParcel(545780, 0121, 2990, 6050, 4, 2, 1, 0, 1949, 1086000, 0, 0);
	addParcel(080900, 3620, 2810, 4770, 2, 1, 1, 0, 1914, 594000, 0, 0);
	addParcel(119300, 0715, 2080, 6000, 4, 2, 0, 1, 1952, 499000, 0, 0);
	addParcel(751850, 6220, 1650, 5100, 3, 1, 0, 1, 1906, 394000, 0, 0);

	var dollarDisplay = function (amt) {
		return ((parseInt(amt)<0)?"-":"")+"$"+Math.abs(amt).toLocaleString();
	};

	var loadParcel = function (obj) {
		$('#sf').html(obj.squarefeet.toLocaleString());
		$('#lsf').html(obj.lot.toLocaleString());
		$('#beds').html(obj.bedrooms);
		$('#br').html(obj.fullBR+" / "+obj.threeQBR+" / "+obj.halfBR);
		$('#yr').html(obj.yearBuilt);
	};


	var setNames = function () {
		$('#p1input label').html(players[0].name+" bid");
		$('#p2input label').html(players[1].name+" bid");
		$('#p1-bank-name').html(players[0].name+" Bankroll");
		$('#p2-bank-name').html(players[1].name+" Bankroll");
		$('#p1-bank-amt').html(dollarDisplay(players[0].bankroll));
		$('#p2-bank-amt').html(dollarDisplay(players[1].bankroll));

		// $('#p1-bank-amt').html("$"+parseInt(players[0].bankroll).toLocaleString());
		// $('#p2-bank-amt').html("$"+parseInt(players[1].bankroll).toLocaleString());

	};

	var switchPlayer = function () {
		if (players[0].active) {
			players[0].active = 0;
			players[1].active = 1;
		} else {
			players[0].active = 1;
			players[1].active = 0;
		}
	};

	var validBid = function (b) {
		int = parseInt(b, 10);
		if (int.toString()===b) {
			return (int>0);
		}
		return false;
	};

	var getWinner = function () {
		if (players[0].bid > players[1].bid) {
			return 0;
		} else if (players[0].bid < players[1].bid) {
			return 1;
		}
	}


	loadParcel(parcels[index]);
	setNames();

//	$('demo').on('click',$('demo').collapse('toggle'));

	$('#p1input').submit(function (e) {
		e.preventDefault();

		if (!validBid($('#player1bid').val())) {
			
			alert("Please enter an integer!");
			$('#player1bid').val('').focus();

		} else {
			
			players[0].bid = $('#player1bid').val()
			$('#player1bid').val('');
			switchPlayer();
			$('#p1input').addClass('hidden');
			$('#p2input').removeClass('hidden');
			$('#player2bid').val('').focus();		

		} 
			
	});

	$('#p2input').submit(function (e) {
		e.preventDefault();

		if (!validBid($('#player2bid').val())) {
			
			alert("Please enter an integer!");
			$('#player2bid').val('').focus();

		} else {
			
			players[1].bid = $('#player2bid').val()
			$('#player2bid').val('');
			switchPlayer();
			$('#player2bid').val('').focus();		
			$('#p2input').addClass('hidden');


			$('#p1-auc-name').html(players[0].name+" bid");
			$('#p2-auc-name').html(players[1].name+" bid");
			$('#p1-auc-bid').html("$"+parseInt(players[0].bid).toLocaleString());
			$('#p2-auc-bid').html("$"+parseInt(players[1].bid).toLocaleString());
			winner = getWinner();
			$('#auc-winner').html(players[winner].name+" wins the auction!");
			$('#demo').collapse('hide');
			$('.auction').removeClass('hidden');
		} 
			
	});

	$('#auc-next').submit(function (e) {
		e.preventDefault();

		$('.auction').addClass('hidden');
		$('#compare-name').html(players[winner].name+" bid");
		$('#compare-bid').html("$"+parseInt(players[winner].bid).toLocaleString());
		$('#compare-home').html("$"+parseInt(parcels[index].value).toLocaleString());
		$('#compare-net-name').html(players[winner].name+" net");
		var net = parcels[index].value - players[winner].bid;
		$('#compare-net').html(dollarDisplay(net));		
//		$('#compare-net').html(((net<0)?"-":"")+"$"+parseInt(Math.abs(net)).toLocaleString());
		players[winner].bankroll += net;
		setNames(); 
		$('.compare').removeClass('hidden');

			
	});

	$('#comp-next').submit(function (e) {
		e.preventDefault();

		$('.compare').addClass('hidden');
		$('#p1input').removeClass('hidden');
		$('#demo').collapse('show');

		players[0].active = 1;
		players[1].active = 0;
		players[0].bid = null;
		players[1].bid = null;
		index++;
		winner = null;
		loadParcel(parcels[index]);
			
	});














});
