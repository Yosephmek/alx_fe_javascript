const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

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
