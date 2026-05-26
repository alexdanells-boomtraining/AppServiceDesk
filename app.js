// AppServiceDesk — entry point

document.addEventListener('DOMContentLoaded', () => {
  const grid = document.getElementById('categoryGrid');

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('.request-card');
    if (!card) return;
    const category = card.dataset.category;
    // TODO: navigate to the request form for this category
    console.log('Selected category:', category);
  });
});
