var players = [{name: "Red", active: 1, bankroll: 0, bid: null}, {name: "Blue", active: 0, bankroll: 0, bid: null}];


var parcels = data;
var winner = null;
var index = 0;

$(document).ready(function () {
	console.log("JS ready");
	
	var shuffle = function(array) {
	  var m = array.length, t, i;

	  // While there remain elements to shuffle…
	  while (m) {

	    // Pick a remaining element…
	    i = Math.floor(Math.random() * m--);

	    // And swap it with the current element.
	    t = array[m];
	    array[m] = array[i];
	    array[i] = t;
	  }

	  return array;
	}

	var dollarDisplay = function (amt) {
		return ((parseInt(amt)<0)?"-":"")+"$"+Math.abs(amt).toLocaleString();
	};

	var getRange = function (p) {
		switch (true) {
			case (parseInt(p.value) > 1000000):
				return "More than $1,000,000";
				break;
			case (parseInt(p.value) >= 500000):
				return "More than $500,000; less than $1,000,000"
				break;
			default: 
				return "Less than $500,000";
		}
	};

	var loadParcel = function (obj) {
		$('#image').html("<img src=images/Properties/"+obj.parcel1+obj.parcel2+".jpeg class='img-responsive img-circle' alt='Image'>");
		$('#sf').html(parseInt(obj.squarefeet).toLocaleString());
		$('#lsf').html(parseInt(obj.lot).toLocaleString());
		$('#beds').html(obj.bedrooms);
		$('#br').html(obj.fullBR+" / "+obj.threeQBR+" / "+obj.halfBR);
		$('#yr').html(obj.yearBuilt);
		(parseInt(obj.mtRainier) > 0)?$('#mr').removeClass('hidden'):$('#mr').addClass('hidden');
		$('#pr').html(getRange(obj));
	};

	var setNames = function () {
		players[0].name = $('#player1name').val();
		players[1].name = $('#player2name').val();
		$('#p1input label').html(players[0].name+" bid");
		$('#p2input label').html(players[1].name+" bid");
		$('#p1-bank-name').html(players[0].name+" Bankroll");
		$('#p2-bank-name').html(players[1].name+" Bankroll");
		$('#p1-bank-amt').html(dollarDisplay(players[0].bankroll));
		$('#p2-bank-amt').html(dollarDisplay(players[1].bankroll));

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
		if (parseInt(players[0].bid) > parseInt(players[1].bid)) {
			return 0;
		} else if (parseInt(players[0].bid) < parseInt(players[1].bid)) {
			return 1;
		}
	}

	var winText = function () {
		if (parseInt(players[0].bankroll) > parseInt(players[1].bankroll)) {
			return players[0].name + " wins the game!";
		} else if (parseInt(players[0].bankroll) < parseInt(players[1].bankroll)) {
			return players[1].name + " wins the game!";
		} else {
			return "It's a tie!"
		}
	};

	var validNames = function (n1, n2) {
		return ((n1.length&&n2.length)&&(n1!=n2));
	};

	// var setDifficulty = function () {

	// };

	$('#startGame').submit(function (e) {
		e.preventDefault();

		if (validNames($('#player1name').val(), $('#player2name').val())) {
			$('.compare').addClass('hidden');
			$('#p1input').removeClass('hidden');
			$('#frame').removeClass('hidden');
			$('#image').removeClass('hidden');
			$('.stats').removeClass('hidden');
			$('#bankroll').removeClass('hidden');
			$('#demo').collapse('show');

			if ($('#easy:checked')[0]) {
				$('#difficulty-range').removeClass('hidden');
			} else {
				$('#difficulty-range').addClass('hidden');
			}

			players[0].active = 1;
			players[1].active = 0;
			players[0].bid = null;
			players[1].bid = null;
			players[0].bankroll = 0;
			players[1].bankroll = 0;		
			index = 0;
			winner = null;

			parcels = shuffle(parcels);
			loadParcel(parcels[index]);
		
			setNames();
			$('#p1input').focus()
			$('#info').addClass('hidden');
		} else {
			alert("Please enter different names in both fields.");
		};

	});

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
			$('#auc-next button').focus();
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
		
		if(index < parcels.length) {
			loadParcel(parcels[index]);
		} else {
			$('#endGame h3').html(winText());
			$('#p1input').addClass('hidden');
			$('#demo').collapse('hide');
			$('#endGame').removeClass('hidden');
		};	
	});

	$('#endGame-newGame').submit(function (e) {
		e.preventDefault();

		$('#player1name').val('');
		$('#player2name').val('');
		$('#endGame').addClass('hidden');
		$('#image').addClass('hidden');
		$('.stats').addClass('hidden');
		$('#bankroll').addClass('hidden');
		$('#frame').addClass('hidden');
		$('#info').removeClass('hidden');

	});

	$('#btn-newGame').submit(function (e) {
		e.preventDefault();

		$('#player1name').val('');
		$('#player2name').val('');
		$('#image').addClass('hidden');
		$('.stats').addClass('hidden');
		$('#p1input').addClass('hidden');
		$('#p2input').addClass('hidden');
		$('#bankroll').addClass('hidden');
		$('#frame').addClass('hidden');
		$('#info').removeClass('hidden');

	});












});
