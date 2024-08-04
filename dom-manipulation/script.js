const quotes = [
    { text: "The only limit to our realization of tomorrow is our doubts of today.", category: "Motivation" },
    { text: "Do not wait to strike till the iron is hot; but make it hot by striking.", category: "Action" },
    { text: "Great things never came from comfort zones.", category: "Inspiration" }
  ];
  
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const selectedQuote = quotes[randomIndex];
    const quoteDisplay = document.getElementById('quoteDisplay');
    quoteDisplay.innerHTML = `<p>${selectedQuote.text}</p><p><em>Category: ${selectedQuote.category}</em></p>`;
  }
  
  function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;
    
    if (newQuoteText && newQuoteCategory) {
      const newQuote = { text: newQuoteText, category: newQuoteCategory };
      quotes.push(newQuote);
      alert('New quote added!');
    } else {
      alert('Please enter both quote text and category.');
    }
  }
  
  document.getElementById('newQuote').addEventListener('click', showRandomQuote);
  
  showRandomQuote();
  