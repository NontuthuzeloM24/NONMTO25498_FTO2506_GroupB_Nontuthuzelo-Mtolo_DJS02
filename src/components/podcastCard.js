/**
 * @file PodcastCard.js
 * @description A stateless custom web component for displaying podcast info cards.
 * Accepts external data via attributes and emits a custom event on click.
 */

class PodcastCard extends HTMLElement {
  /**
   * Define which attributes this component reacts to.
   * @returns {string[]}
   */
  static get observedAttributes() {
    return ['cover', 'title', 'genres', 'seasons', 'updated', 'id'];
  }

  constructor() {
    super();
    // Create and attach shadow DOM
    this.attachShadow({ mode: 'open' });

    // Create root container
    this.wrapper = document.createElement('div');
    this.wrapper.classList.add('card');
    this.wrapper.addEventListener('click', this.handleClick.bind(this));

    // Template content will be injected dynamically based on attributes
    this.shadowRoot.appendChild(this.wrapper);

    // Attach encapsulated styles
    const style = document.createElement('style');
    style.textContent = this.styles();
    this.shadowRoot.appendChild(style);
  }

  /**
   * Called each time an attribute is added, removed, or changed.
   * @param {string} name - Attribute name
   * @param {string} oldValue - Previous value
   * @param {string} newValue - New value
   */
  attributeChangedCallback(name, oldValue, newValue) {
    if (oldValue !== newValue) this.render();
  }

  /**
   * Handles card click and dispatches a custom event to the parent.
   * @param {MouseEvent} event
   */
  handleClick(event) {
    event.stopPropagation();

    this.dispatchEvent(
      new CustomEvent('podcastSelected', {
        detail: { id: this.getAttribute('id') },
        bubbles: true,
        composed: true,
      })
    );
  }

  /**
   * Format ISO date strings into a readable short date.
   * @param {string} isoDate
   * @returns {string}
   */
  formatDate(isoDate) {
    const date = new Date(isoDate);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  /**
   * Render the component based on current attributes.
   */
  render() {
    const cover = this.getAttribute('cover') || '';
    const title = this.getAttribute('title') || 'Untitled';
    const genres = this.getAttribute('genres')
      ? JSON.parse(this.getAttribute('genres'))
      : [];
    const seasons = this.getAttribute('seasons') || 0;
    const updated = this.getAttribute('updated') || '';

    this.wrapper.innerHTML = `
      <img src="${cover}" alt="Podcast cover for ${title}">
      <h3>${title}</h3>
      <div class="tags">
        ${genres.map((g) => `<span class="tag">${g}</span>`).join('')}
      </div>
      <p>${seasons} seasons</p>
      <p class="updated-text">Last updated: ${this.formatDate(updated)}</p>
    `;
  }

  /**
   * Returns the encapsulated styles for the shadow DOM.
   * @returns {string}
   */
  styles() {
    return `
      :host {
        display: block;
      }
      .card {
        background: white;
        padding: 1rem;
        border-radius: 8px;
        box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
        cursor: pointer;
        transition: transform 0.2s;
      }
      .card:hover {
        transform: scale(1.02);
      }
      img {
        width: 100%;
        border-radius: 6px;
      }
      h3 {
        margin: 0.5rem 0;
        font-size: 1rem;
      }
      p {
        margin: 0;
        font-size: 0.8rem;
        color: #555;
      }
      .tags {
        margin: 0.5rem 0;
      }
      .tag {
        background: #eee;
        padding: 0.3rem 0.6rem;
        margin-right: 0.5rem;
        margin-top: 0.5rem;
        border-radius: 4px;
        display: inline-block;
        font-size: 0.8rem;
      }
      .updated-text {
        font-size: 0.8rem;
        color: #555;
      }
    `;
  }

  /**
   * Lifecycle method called when element is inserted into the DOM.
   */
  connectedCallback() {
    this.render();
  }
}

// Define the custom element
customElements.define('podcast-card', PodcastCard);
