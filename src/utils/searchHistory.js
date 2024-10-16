const MAX_HISTORY_ITEMS = 10;

export const addToSearchHistory = (searchQuery) => {
  let searchHistory = JSON.parse(localStorage.getItem('searchHistory')) || [];
  
  // Remove the query if it already exists to avoid duplicates
  searchHistory = searchHistory.filter(item => item !== searchQuery);
  
  // Add the new query to the beginning of the array
  searchHistory.unshift(searchQuery);
  
  // Limit the history to MAX_HISTORY_ITEMS
  searchHistory = searchHistory.slice(0, MAX_HISTORY_ITEMS);
  
  localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
};

export const getSearchHistory = () => {
  const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
  console.log('Retrieved search history:', history);
  return history;
};

export const clearSearchHistory = () => {
  localStorage.removeItem('searchHistory');
};