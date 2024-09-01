document.addEventListener('DOMContentLoaded', function() {
  const allButtons = document.querySelectorAll('.searchBtn');
  const searchBar = document.querySelector('.searchBar');
  const searchInput = document.getElementById('searchInput');
  const searchClose = document.getElementById('searchClose');

  allButtons.forEach(button => {
    button.addEventListener('click', function() {
      console.log('Search button clicked');
      const isExpanded = this.getAttribute('aria-expanded') === 'true';
      console.log('Is expanded:', isExpanded);

      if (isExpanded) {
        // Close the search bar
        searchBar.classList.remove('open');
        this.setAttribute('aria-expanded', 'false');
      } else {
        // Open the search bar
        searchBar.classList.add('open');
        this.setAttribute('aria-expanded', 'true');
        searchInput.focus();
      }
    });
  });

  searchClose.addEventListener('click', function() {
    console.log('Close button clicked');
    searchBar.classList.remove('open');
    const openButton = document.querySelector('.searchBtn[aria-expanded="true"]');
    if (openButton) {
      openButton.setAttribute('aria-expanded', 'false');
    }
  });
});
