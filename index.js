const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

var CardNames = [
  "Ace",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "Jack",
  "Queen",
  "King",
];
var CardValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
var CardSuits = ["Hearts", "Clubs", "Diamonds", "Spades"];
var deck = CardSuits.flatMap((suit) =>
  CardNames.map((name) => ({
    name,
    value: CardValues[CardNames.indexOf(name)],
    suit,
  })),
);

function listElements(deck) {
  deck.forEach((card) => {
    console.log(`${card.name} of ${card.suit}. ${card.value}`);
  });
}

var playerHand = [];
var dealerHand = [];

function shuffle(deck) {
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
}
function drawTwoCards(deck, playerHand) {
  shuffle(deck);
  playerHand.push(deck.pop());
  playerHand.push(deck.pop());
  console.log("Your Hand:");
  listElements(playerHand);
}
function dealerDraws(deck, dealerHand) {
  shuffle(deck);
  dealerHand.push(deck.pop());
  dealerHand.push(deck.pop());
  console.log("Dealer Hand:");
  console.log(`${dealerHand[0].name} of ${dealerHand[0].suit}`);
}

drawTwoCards(deck, playerHand);

function getTotalHandValue(hand) {
  let totalValue = hand.reduce((total, card) => total + card.value, 0);
  hand.forEach((card) => {
    if (card.name === "Ace" && totalValue + 10 <= 21) {
      totalValue += 10;
    }
  });
  return totalValue;
}

console.log("Player Hand Value: " + getTotalHandValue(playerHand));
if (getTotalHandValue(playerHand) > 21) {
  console.log("Player busts! Dealer wins.");
  rl.close();
} else {
  playerDecision("", deck, playerHand, dealerHand);
}

dealerDraws(deck, dealerHand);

console.log("Remaining Cards:" + deck.length);

function dealerDecision(deck, dealerHand, playerHand) {
  let dealerHandValue = getTotalHandValue(dealerHand);
  while (dealerHandValue < 17) {
    dealerHand.push(deck.pop());
    dealerHandValue = getTotalHandValue(dealerHand);
  }
  console.log("Dealer Hand:");
  dealerHand.forEach((card) => {
    console.log(`${card.name} of ${card.suit}. ${card.value}`);
  });
  console.log("Dealer Hand Value: " + dealerHandValue);
  determineWinner(playerHand, dealerHand);
  rl.close();
}

function playerDecision(prompt, deck, playerHand, dealerHand) {
  rl.question("Do you want to hit or stay?", (response) => {
    if (response.toLowerCase() === "hit") {
      playerHand.push(deck.pop());
      console.log("Your Hand:");
      playerHand.forEach((card) => {
        console.log(`${card.name} of ${card.suit}. ${card.value}`);
      });
      console.log("Your Hand Value: " + getTotalHandValue(playerHand));
      if (getTotalHandValue(playerHand) > 21) {
        console.log("Player busts! Dealer wins.");
        rl.close();
      } else {
        playerDecision(prompt, deck, playerHand, dealerHand);
      }
    } else if (response.toLowerCase() === "stay") {
      console.log("Player stays.");
      dealerDecision(deck, dealerHand, playerHand);
      rl.close();
    }
  });
}

function determineWinner(playerHand, dealerHand) {
  let playerValue = getTotalHandValue(playerHand);
  let dealerValue = getTotalHandValue(dealerHand);
  if (dealerValue > 21) {
    console.log("Dealer busts! Player wins.");
  } else if (playerValue === dealerValue) {
    console.log("It's a tie!");
  } else if (playerValue > dealerValue) {
    console.log("Player wins!");
  } else {
    console.log("Dealer wins with " + dealerValue + "!");
  }
}

playerDecision("", deck, playerHand);
