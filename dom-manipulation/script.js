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

function showRandomQuote() {
  const filteredQuotes = getFilteredQuotes();
  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const selectedQuote = filteredQuotes[randomIndex];

  if (selectedQuote) {
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(selectedQuote));
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>${selectedQuote.text}</p><p><em>Category: ${selectedQuote.category}</em></p>`;
  } else {
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>No quotes available for the selected category.</p>`;
  }
}

function addQuote() {
  const newQuoteText = document.getElementById('newQuoteText').value;
  const newQuoteCategory = document.getElementById('newQuoteCategory').value;

  if (newQuoteText && newQuoteCategory) {
    const newQuote = { text: newQuoteText, category: newQuoteCategory };
    quotes.push(newQuote);
    saveQuotes();
    populateCategories();
    alert('New quote added!');
  } else {
    alert('Please enter both quote text and category.');
  }
}

function populateCategories() {
  const categoryFilter = document.getElementById('categoryFilter');
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  const categories = [...new Set(quotes.map(quote => quote.category))];
  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categoryFilter.appendChild(option);
  });

  const lastSelectedCategory = getLastSelectedCategory();
  categoryFilter.value = lastSelectedCategory;
}

function getFilteredQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  if (selectedCategory === 'all') {
    return quotes;
  }
  return quotes.filter(quote => quote.category === selectedCategory);
}

function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  saveLastSelectedCategory(selectedCategory);
  showRandomQuote();
}

function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const downloadUrl = URL.createObjectURL(dataBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = downloadUrl;
  downloadLink.download = 'quotes.json';
  downloadLink.click();
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    const importedQuotes = JSON.parse(event.target.result);
    quotes.push(...importedQuotes);
    saveQuotes();
    populateCategories();
    alert('Quotes imported successfully!');
  };
  fileReader.readAsText(event.target.files[0]);
}

document.getElementById('newQuote').addEventListener('click', showRandomQuote);
document.getElementById('exportJson').addEventListener('click', exportToJsonFile);

populateCategories();
createAddQuoteForm();
showRandomQuote();
