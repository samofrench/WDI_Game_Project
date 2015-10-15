var players = [{name: "Red", active: 1, bankroll: 0, bid: null}, {name: "Blue", active: 0, bankroll: 0, bid: null}];
var parcels = data;
var winner = null;
var index = 0;

$(document).ready(function () {
	console.log("JS ready");
	
// Fisher-Yates shuffling algorithm	
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

// Formats dollar amounts as -$0000 when negative
	var dollarDisplay = function (loc, amt) {
		
		(parseInt(amt)<0)?loc.addClass('negative'):loc.removeClass('negative');
		loc.html(((parseInt(amt)<0)?"-":"")+"$"+Math.abs(amt).toLocaleString());
	};

	var dollarDisplayGreen = function (loc, amt) {
		
		(parseInt(amt)<0)?loc.addClass('negative'):loc.removeClass('negative');
		(parseInt(amt)>0)?loc.addClass('positive'):loc.removeClass('positive');
		loc.html(((parseInt(amt)<0)?"-":"")+"$"+Math.abs(amt).toLocaleString());
	};

// Determines the price range for 'easy' mode
	var getRange = function (p) {
		switch (true) {
			case (parseInt(p.value) > 1000000):
				return "More than $1,000,000";
				break;
			case (parseInt(p.value) >= 500000):
				return "At least $500,000; up to $1,000,000"
				break;
			default: 
				return "Less than $500,000";
		}
	};

// Loads a home onto the screen
	var loadParcel = function (obj) {
		$('#image').html("<img src=Images/Properties/"+obj.parcel1+obj.parcel2+".jpeg class='img-responsive img-circle' alt='House'>");
		$('#sf').html(parseInt(obj.squarefeet).toLocaleString());
		$('#lsf').html(parseInt(obj.lot).toLocaleString());
		$('#beds').html(obj.bedrooms);
		$('#br').html(obj.fullBR+" / "+obj.threeQBR+" / "+obj.halfBR);
		$('#yr').html(obj.yearBuilt);
		(parseInt(obj.mtRainier) > 0)?$('#mr').removeClass('hidden'):$('#mr').addClass('hidden');
		$('#pr').html(getRange(obj));
		$('#map-div').html("<img src=Images/Maps/"+obj.parcel1+obj.parcel2+"-map.jpeg class='map' alt='Map'>");
		$('#map-div').append("<i class='fa fa-map-marker'></i>");

	};

// Places players' selected names in the appropriate places 
	var setNames = function () {
		players[0].name = $('#player1name').val();
		players[1].name = $('#player2name').val();
		$('#p1input label').html(players[0].name+" bid $");
		$('#p2input label').html(players[1].name+" bid $");
		$('#p1-bank-name').html(players[0].name+" Bank Account");
		$('#p2-bank-name').html(players[1].name+" Bank Account");
		dollarDisplay($('#p1-bank-amt'), players[0].bankroll);
		dollarDisplay($('#p2-bank-amt'), players[1].bankroll);


	};

// Switches the 'active' player
	var switchPlayer = function () {
		if (players[0].active) {
			players[0].active = 0;
			players[1].active = 1;
		} else {
			players[0].active = 1;
			players[1].active = 0;
		}
	};

// Checks whether a submitted bid is a positive whole number, does not include any text, 
// and if 'easy' mode is on, checks that it is within range.
	var validBid = function (b) {
		var ii = parseInt(b, 10);
		
		var str = getRange(parcels[index]);
		
		if (ii.toString()!==b) {
			return false;
		} else if ($('#hard:checked')[0]) {
				return ii>0;
			} else {
				switch(str){
					case ("Less than $500,000"):
						return (0<ii&&ii<500000);
						break;
					case ("At least $500,000; up to $1,000,000"):
						return (500000<=ii&&ii<=1000000);
						break;
					case ("More than $1,000,000"):
						return (1000000<ii);
						break;
				}

			}

	};

// Determines the winner of an auction
	var getWinner = function () {
		if (parseInt(players[0].bid) == parseInt(players[1].bid)) {
			swal("The auction was a tie! Both players bid the same amount. The winner will instead be decided by a coin flip.");
			return (Math.random()>.5)?1:0;
		} else if (parseInt(players[0].bid) > parseInt(players[1].bid)) {
			return 0;
		} else if (parseInt(players[0].bid) < parseInt(players[1].bid)) {
			return 1;
		}
	};

// Chooses text for the winner of the game.
	var winText = function () {
		if (parseInt(players[0].bankroll) > parseInt(players[1].bankroll)) {
			return players[0].name + " wins the game!";
		} else if (parseInt(players[0].bankroll) < parseInt(players[1].bankroll)) {
			return players[1].name + " wins the game!";
		} else {
			return "It's a tie!"
		}
	};

// Checks that both name fields have a submission and that they are not the same.
	var validNames = function (n1, n2) {
		return ((n1.length&&n2.length)&&(n1!=n2));
	};

// Event listeners for the 'up' and 'down' carets.
	$('#collapser').on('click', 'i.fa-caret-down', function () {
		$('#caret').addClass('fa-caret-up');
		$('#caret').removeClass('fa-caret-down');	
	});

	$('#collapser').on('click', 'i.fa-caret-up', function () {
		$('#caret').addClass('fa-caret-down');
		$('#caret').removeClass('fa-caret-up');	
	});

// Events triggered when 'Start Game' on the info screen is clicked.
	$('#startGame').submit(function (e) {
		e.preventDefault();

		if (validNames($('#player1name').val(), $('#player2name').val())) {
			$('.compare').addClass('hidden');
			$('.box').removeClass('hidden');
			$('#p1input').removeClass('hidden');
			$('#frame').removeClass('hidden');
			$('#image').removeClass('hidden');
			$('.stats').removeClass('hidden');
			$('#bankroll').removeClass('hidden');
			$('#demo').collapse('show');
			$('i').addClass('fa-caret-down');
			$('i').removeClass('fa-caret-up');

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
			swal("Try again!", "Make sure you enter something in both fields, and that your names are different from each other.", "error");
		};

	});

// Events triggered when player 1 submits a bid
	$('#p1input').submit(function (e) {
		e.preventDefault();

		if (!validBid($('#player1bid').val())) {
			
			swal("Try again!", "Your bid must include only positive whole numbers, and must be within the specified range if playing in Beginner Mode.", "error");
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

// Events triggered when player 2 submits a bid
	$('#p2input').submit(function (e) {
		e.preventDefault();

		if (!validBid($('#player2bid').val())) {
			
			swal("Try again!", "Your bid must include only positive whole numbers, and must be within the specified range if playing in Beginner Mode.", "error");
			$('#player2bid').val('').focus();

		} else {
			
			players[1].bid = $('#player2bid').val()
			$('#player2bid').val('');
			switchPlayer();
			$('#player2bid').val('').focus();		
			$('#p2input').addClass('hidden');

			$('#demo').collapse('hide');
			$('#auc-next button').focus();
			$('.box').addClass('hidden');
			$('.auction').removeClass('hidden');

			$('#p1-auc-name').html(players[0].name+" bid");
			$('#p2-auc-name').html(players[1].name+" bid");
			$('#p1-auc-bid').html("$"+parseInt(players[0].bid).toLocaleString());
			$('#p2-auc-bid').html("$"+parseInt(players[1].bid).toLocaleString());
			winner = getWinner();
			$('#auc-winner').html(players[winner].name+" wins the auction!");
			$('#auc-next').removeClass('hidden');

		} 
			
	});

// Events triggered when 'Next' is hit during the auction.
	$('#auc-next').submit(function (e) {
		e.preventDefault();

		$('.auction').addClass('hidden');
		$('#auc-winner').html('')
		$('#compare-name').html(players[winner].name+" bid");
		$('#compare-bid').html("- $"+parseInt(players[winner].bid).toLocaleString());
		$('#compare-home').html("$"+parseInt(parcels[index].value).toLocaleString());
		$('#compare-net-name').html(players[winner].name+" net");
		var net = parseInt(parcels[index].value) - parseInt(players[winner].bid);
		dollarDisplayGreen($('#compare-net'), net);
		players[winner].bankroll += net;
		setNames(); 
		$('.compare').removeClass('hidden');

			
	});

// Events triggered when 'Next' is hit during the comparison phase
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
			$('.box').removeClass('hidden');
			loadParcel(parcels[index]);
		} else {
			$('#endGame h3').html(winText());
			$('#p1input').addClass('hidden');
			$('#demo').collapse('hide');
			$('#caret').addClass('fa-caret-up');
			$('#caret').removeClass('fa-caret-down');
			$('#endGame').removeClass('hidden');
		};	
	});

// Events triggered when a new game is started after an old one finishes
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

// Events triggered when a new game is started at any other point
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
