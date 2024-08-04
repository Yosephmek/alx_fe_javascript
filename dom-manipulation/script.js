const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
  { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", category: "Action" },
  { text: "Great things never came from comfort zones.", category: "Inspiration" }
];

function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

function saveLastSelectedCategory(category) {
  localStorage.setItem('lastSelectedCategory', category);
}

function getLastSelectedCategory() {
  return localStorage.getItem('lastSelectedCategory') || 'all';
}

async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverQuotes = await response.json();
    updateLocalQuotes(serverQuotes);
  } catch (error) {
    console.error('Error fetching quotes from server:', error);
  }
}

async function postQuoteToServer(quote) {
  try {
    const response = await fetch(SERVER_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(quote)
    });
    const newQuote = await response.json();
    quotes.push(newQuote);
    saveQuotes();
  } catch (error) {
    console.error('Error posting quote to server:', error);
  }
}

function updateLocalQuotes(serverQuotes) {
  const localQuoteTexts = quotes.map(quote => quote.text);
  serverQuotes.forEach(serverQuote => {
    if (!localQuoteTexts.includes(serverQuote.text)) {
      quotes.push(serverQuote);
    }
  });
  handleConflicts(serverQuotes);
  saveQuotes();
  populateCategories();
}

async function syncQuotes() {
  await fetchQuotesFromServer();
  quotes.forEach(quote => postQuoteToServer(quote));
}

setInterval(syncQuotes, 30000);

function notifyUser(message) {
  alert(message);
}

function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    postQuoteToServer(newQuote);
    populateCategories();
    notifyUser('New quote added and synced with server!');
  } else {
    notifyUser('Please enter both quote text and category.');
  }
}

function handleConflicts(serverQuotes) {
  const conflicts = [];
  serverQuotes.forEach(serverQuote => {
    const localQuote = quotes.find(quote => quote.text === serverQuote.text);
    if (localQuote && JSON.stringify(localQuote) !== JSON.stringify(serverQuote)) {
      conflicts.push({ localQuote, serverQuote });
    }
  });
  if (conflicts.length > 0) {
    notifyUser(`Conflicts detected: ${conflicts.length}. Server data will take precedence.`);
    resolveConflicts(conflicts);
  }
}

function resolveConflicts(conflicts) {
  conflicts.forEach(({ localQuote, serverQuote }) => {
    const index = quotes.indexOf(localQuote);
    quotes[index] = serverQuote;
  });
  saveQuotes();
  populateCategories();
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('exportJson').addEventListener('click', exportToJsonFile);

populateCategories();
fetchQuotesFromServer();
showRandomQuote();
