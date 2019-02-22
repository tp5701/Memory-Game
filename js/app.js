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
}

const _gameBoardElement = document.querySelector('.deck');
const _cards = _gameBoardElement.querySelectorAll('.card');
const _movesElement = document.querySelector(".moves");
const _timerElement = document.querySelector(".timer");
const _starElements = [
    document.getElementById("star1"),
    document.getElementById("star2"),
    document.getElementById("star3")
];

const _cardClassName = "card";
let _awaitingFirstCardClass = ""
let _currentMatchClass = "";
let _firstCard = null;
let _pendingFlush = false;
let _totalMatches = 8;
let _currentMatches = 0;
let _gameOver = false;
let _gameTime = 0;
let _timer = null;

/**
* @description initializes game
*/
function initialize() {
    initResetButton();
    setMoveCount(0);
    shuffleCards();
    resetTimerOnDOM();
}
/**
* @description creates and adds a click listener to implement reset logic
*/
function initResetButton() {
    var resetButton = document.querySelector('.fa-repeat');
    resetButton.onclick = function() {
        _currentMatchClass = _awaitingFirstCardClass;
        _firstCard = null;
        _currentMatches = 0;
        _gameOver = false;
        setMoveCount(0);
        resetStars();
        clearTimer();
        shuffleCards();
    };
}

/**
* @description intializes the timer in code and DOM
*/
function startTimer() {
    // increase _gameTime every second
    _timer = setInterval(function() {
        if (_gameOver) {
            clearTimer();
        }

        _gameTime++;
        _timerElement.innerHTML = _gameTime;
    }, 1000);
};

/**
* @description resets the timer in code and DOM
*/
function clearTimer() {
    clearInterval(_timer);
    resetTimerOnDOM();
    _gameTime = 0;
    _timer = null;
}

/**
* @description reinitializes the cards for a new game
*/
function shuffleCards() {
    var shuffledCards = shuffle(Array.from(_cards));

    shuffledCards.forEach(function(card) {
        card.className = _cardClassName;
        card.onclick = onClickHandler;
        _gameBoardElement.appendChild(card);
    });
};

/**
* @description entrypoint for all card click logic
* @param {Event} event
*/
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

/**
* @description responsible for changing the DOM as well as 
*  delegating the many events that can happen on card flip
* @param {Element} card
*/
function openCardHandler(card) {
    if (_timer === null) {
        startTimer();
    }

    var openedCardClassName = "card open show";
    card.className = openedCardClassName;

    if (_currentMatchClass === _awaitingFirstCardClass) {
        firstCardTurnedHandler(card);
    } else {
        secondCardTurnedHandler(card);
        setMoveCount(getMoveCount() + 1);
        checkStarStatus();
    }

    if (_currentMatches === _totalMatches) {
        sendWinDialog();
    }
};


/**
* @description responsible for persisting the first card flip
* @param {Element} card
*/
function firstCardTurnedHandler(card) {
    var cardType = getCardTypeElementFromCardElement(card);
    _firstCard = card;
    _currentMatchClass = cardType.className;
};

/**
* @description responsible for determining if a match has occured as well
*  as resetting the properties for a fresh move
* @param {Element} card
*/
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

/**
* @description responsible for unflipping the selected cards after allowing player to 
*  see the choices made
* @param {Element} match1
* @param {Element} match2
*/
function failedToMatchHandler(match1, match2) {
    _pendingFlush = true;
    // wait 1 second for player to see outcome before resetting
    setTimeout(function() {
        match1.className = _cardClassName;
        match2.className = _cardClassName; 
        _pendingFlush = false;
    }, 1000);
};

/**
* @description responsible for changing the styles to that of matched
* @param {Element} match1
* @param {Element} match2
*/
function successfullyMatchedHandler(match1, match2) {
    var matchedCardClassName = "card match";
    match1.className = matchedCardClassName;
    match2.className = matchedCardClassName;
    _currentMatches += 1;
};

/**
* @description responsible for turning off stars after certain thresholds
*/
function checkStarStatus() {
    var check = getMoveCount() - 1;
    if (check === 10) {
        _starElements[0].style.display = "none";
    } else if (check === 20) {
        _starElements[1].style.display = "none";
    } else if (check === 30) {
        _starElements[2].style.display = "none";
    }
};

/**
* @description returns the element with the card type player selected
* @param {Element} match1
*/ 
function getCardTypeElementFromCardElement(card) {
    return card.querySelector(".fa");
};

/**
* @description retriever for move count displayed on the DOM
*/ 
function getMoveCount() {
    return parseInt(_movesElement.innerHTML);
};

/**
* @description setter for move count displayed on the DOM
*/
function setMoveCount(number) {
    _movesElement.innerHTML = number;
};

/**
* @description resets the stars for new game
*/
function resetStars() {
    _starElements[0].style.display = "";
    _starElements[1].style.display = "";
    _starElements[2].style.display = "";
};

/**
* @description resets the timer on the DOM for new game
*/
function resetTimerOnDOM() {
    _timerElement.innerHTML = 0;
};

/**
* @description send win dialog to player with victory message
*/
function sendWinDialog() {
    _gameOver = true;
    var finishTime = _gameTime;
    window.alert("Congratulations, you won in " + finishTime + " seconds with " + getMoveCount() + " moves!");
};

initialize();