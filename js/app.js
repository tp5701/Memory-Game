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

var _gameBoardElement = document.querySelector('.deck');
var _cards = _gameBoardElement.querySelectorAll('.card');
var _movesElement = document.querySelector(".moves");
var _cardClassName = "card";
var _awaitingFirstCardClass = ""
var _currentMatchClass = "";
var _firstCard;
var _pendingFlush = false;
var _totalMatches = 8;
var _currentMatches = 0;

function initialize() {
    initResetButton();
    shuffleCardsHandler();
    setMoveCount(0);
}

function initResetButton() {
    var resetButton = document.querySelector('.fa-repeat');
    resetButton.onclick = function() {
        shuffleCardsHandler();
        _currentMatchClass = _awaitingFirstCardClass;
        _firstCard = null;
        _currentMatches = 0;
        setMoveCount(0);
    };
};

function setMoveCount(number) {
    _movesElement.innerHTML = number;
};

function getMoveCount() {
    return parseInt(_movesElement.innerHTML);
}

function shuffleCardsHandler() {
    var shuffledCards = shuffle(Array.from(_cards));

    shuffledCards.forEach(function(card) {
        card.className = _cardClassName;
        card.onclick = onClickHandler;
        _gameBoardElement.appendChild(card);
    });
};

function onClickHandler(event) {
    // EXIT CASE: we want to wait for previous selections to clear
    if (_pendingFlush){
        return;
    }

    var clickedCard = event.srcElement;
    if (clickedCard.className === _cardClassName) {
        openCardHandler(clickedCard);
    }
};

function openCardHandler(card) {
    var openedCardClassName = "card open show";
    card.className = openedCardClassName;

    if (_currentMatchClass === _awaitingFirstCardClass) {
        firstCardTurnedHandler(card);
    } else {
        setMoveCount(getMoveCount() + 1);
        secondCardTurnedHandler(card);
    } 

    if (_currentMatches === _totalMatches) {
        sendWinDialog();
    }
};

function secondCardTurnedHandler(card) {
    var cardType = getCardTypeElementFromCardElement(card);
    if (cardType.className === _currentMatchClass) {
        successfullyMatchedHandler(card, _firstCard);
    } else {
        failedToMatchHandler(card, _firstCard);
    }

    _currentMatchClass = _awaitingFirstCardClass;
    _firstCard = null;
};

function firstCardTurnedHandler(card) {
    var cardType = getCardTypeElementFromCardElement(card);
    _firstCard = card;
    _currentMatchClass = cardType.className;
};

function getCardTypeElementFromCardElement(card) {
    return card.querySelector(".fa");
};

function successfullyMatchedHandler(match1, match2) {
    var matchedCardClassName = "card match";
    match1.className = matchedCardClassName;
    match2.className = matchedCardClassName;
    _currentMatches += 1;
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

function sendWinDialog() {
    window.alert("Congratulations, you won in " + getMoveCount() + " moves!");
};

initialize();