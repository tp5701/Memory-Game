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
var unturnedCardClassName = "card";
var turnedCardClassName = "card open show";
var matchedCardClassName = "card match";
var unselectedCardClassName = ""
var currentMatchClass = "";
var unmatchedOpenCard;
var pendingCardSwap = false;

function onClickHandler(event) {
    var clickedCard = event.srcElement;
    if (!pendingCardSwap) {
        switch (clickedCard.className) {
            case unturnedCardClassName:
                console.log("Clicked unopened card");
                openCardHandler(clickedCard);
                break;
            case turnedCardClassName:
                console.log("Clicked opened card");
                break;
            case matchedCardClassName:
                console.log("Clicked matched card");
                break;
            default: 
                break;
        };
    }
};

function openCardHandler(element) {
    element.className = turnedCardClassName;
    var cardType = element.querySelector(".fa");

    if (currentMatchClass === unselectedCardClassName) {
        unmatchedOpenCard = element;
        currentMatchClass = cardType;
    } else {
        if (cardType.className === currentMatchClass.className) {
            unmatchedOpenCard.className = matchedCardClassName;
            element.className = matchedCardClassName; 
        } else {
            var millisecondsToWait = 1000;
            var match1 = element;
            var match2 = unmatchedOpenCard;
            pendingCardSwap = true;
            setTimeout(function() {
                match1.className = unturnedCardClassName;
                match2.className = unturnedCardClassName; 
                pendingCardSwap = false;
            }, millisecondsToWait);
        }

        currentMatchClass = unselectedCardClassName;
        unmatchedOpenCard = null;
    } 
};


// This is wrapped in () so that it will be called on intial page load only
 (function() {
    var list = document.querySelector('.deck');
    var cards = list.querySelectorAll('.card');
    
    var shuffledCards = shuffle(cards);
    shuffledCards.forEach(function (card){
        // add our custom handler here
        card.onclick = onClickHandler;
        // elements can only exist in a list once
        // thus, readding them will remove the original
        list.appendChild(card);
    });
})();