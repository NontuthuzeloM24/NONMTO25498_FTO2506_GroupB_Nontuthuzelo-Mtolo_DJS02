import './components/podcastCard.js';
import { podcasts, genres, seasons } from './data.js';

const grid = document.getElementById('podcastGrid');
const modal = document.getElementById('modal');
const closeModalBtn = document.getElementById('closeModal');

const modalTitle = document.getElementById('modalTitle');
const modalImage = document.getElementById('modalImage');
const modalDesc = document.getElementById('modalDesc');
const modalGenres = document.getElementById('modalGenres');
const modalUpdated = document.getElementById('modalUpdated');
const seasonList = document.getElementById('seasonList');

/**
 * Create and append podcast cards to the grid
 */
podcasts.forEach((podcast) => {
  const card = document.createElement('podcast-card');

  const genreNames = podcast.genres.map(
    (id) => genres.find((g) => g.id === id)?.title || 'Unknown'
  );

  // Pass data to the stateless component
  card.setAttribute('id', podcast.id);
  card.setAttribute('cover', podcast.image);
  card.setAttribute('title', podcast.title);
  card.setAttribute('genres', JSON.stringify(genreNames));
  card.setAttribute('seasons', podcast.seasons);
  card.setAttribute('updated', podcast.updated);

  grid.appendChild(card);
});

/**
 * Listen for the custom event from PodcastCard
 */
grid.addEventListener('podcastSelected', (e) => {
  const podcastId = e.detail.id;
  const selectedPodcast = podcasts.find(
    (p) => String(p.id) === String(podcastId)
  );

  if (selectedPodcast) {
    openModal(selectedPodcast);
  }
});

/**
 * Opens the modal and populates it with the selected podcast data
 * @param {Object} podcast - The selected podcast object
 */
function openModal(podcast) {
  // Basic info
  modalTitle.textContent = podcast.title;
  modalImage.src = podcast.image;
  modalDesc.textContent = podcast.description || 'No description available.';

  // Genres
  const genreNames = podcast.genres.map(
    (id) => genres.find((g) => g.id === id)?.title || 'Unknown'
  );
  modalGenres.innerHTML = genreNames
    .map((g) => `<span class="tag">${g}</span>`)
    .join('');

  // Updated date
  const formattedDate = new Date(podcast.updated).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  modalUpdated.textContent = `Last updated: ${formattedDate}`;

  // Display all matching seasons with their episode count
  const relatedSeasons = seasons.filter(
    (s) => String(s.podcastId) === String(podcast.id)
  );

  // Build the list of seasons
  seasonList.innerHTML = relatedSeasons
    .map(
      (s) => `
      <li>
        <strong>${s.title}</strong>
        <p>${s.episodes} episodes</p>
      </li>`
    )
    .join('');

  modal.classList.remove('hidden');
}

/**
 * Closes the modal
 */
function closeModal() {
  modal.classList.add('hidden');
}

// Close button event
closeModalBtn.addEventListener('click', closeModal);

// Close modal when clicking outside content
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});



