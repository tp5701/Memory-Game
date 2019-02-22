/*
 * Create a list that holds all of your cards
 */
 var cards = ["fa fa-cube", "fa fa-paper-plane-o", "fa fa-bicycle", "fa fa-bolt",
              "fa fa-bomb", "fa fa-leaf", "fa fa-diamond", "fa fa-anchor"];

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
};


/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
var _cardClassName = "card";
var _openedCardClassName = "card open show";
var _matchedCardClassName = "card match";
var _unselectedCardClassName = ""
var _currentMatchClass = "";
var _firstCard;
var _pendingFlush = false;

function initialize() {
    var list = document.querySelector('.deck');
    var cards = list.querySelectorAll('.card');

    var shuffledCards = shuffle(Array.from(cards));
    shuffledCards.forEach(function (card){
        // add our custom handler here
        card.onclick = onClickHandler;
        // elements can only exist in a list once
        // thus, readding them will remove the original
        list.appendChild(card);
    });
}

function onClickHandler(event) {
    // EXIT CASE: we want to wait for previous selections to clear
    if (_pendingFlush){
        return;
    }

    var clickedCard = event.srcElement;
    
    switch (clickedCard.className) {
        case _cardClassName:
            console.log("Clicked unopened card");
            openCardHandler(clickedCard);
            break;
        case _openedCardClassName:
            console.log("Clicked opened card");
            break;
        case _matchedCardClassName:
            console.log("Clicked matched card");
            break;
        default: 
            break;
    };
};

function openCardHandler(card) {
    card.className = _openedCardClassName;

    if (_currentMatchClass === _unselectedCardClassName) {
        firstCardTurnedHandler(card);
    } else {
        secondCardTurnedHandler(card);
    } 
};

function secondCardTurnedHandler(card) {
    var cardType = card.querySelector(".fa");
    if (cardType.className === _currentMatchClass) {
        successfullyMatchedHandler(card, _firstCard);
    } else {
        failedToMatchHandler(card, _firstCard);
    }

    _currentMatchClass = _unselectedCardClassName;
    _firstCard = null;
};

function firstCardTurnedHandler(card) {
    var cardType = card.querySelector(".fa");
    _firstCard = card;
    _currentMatchClass = cardType.className;
};

function successfullyMatchedHandler(match1, match2) {
    match1.className = _matchedCardClassName;
    match2.className = _matchedCardClassName; 
};

function failedToMatchHandler(match1, match2) {
    _pendingFlush = true;
    // wait 1 second for player to see outcome before resetting
    setTimeout(function() {
        match1.className = _cardClassName;
        match2.className = _cardClassName; 
        _pendingFlush = false;
    }, 1000);
};

initialize();