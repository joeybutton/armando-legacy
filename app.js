/* Armando Fernandez — a celebration of life
   Everything here is enhancement. With JavaScript off, the page reads in full and
   the RSVP form still posts to Formspree the ordinary way. */

(function () {
  'use strict';

  var PLACEHOLDER = 'YOUR_FORM_ID';
  var MAX_PHOTOS = 5;
  var MAX_BYTES = 25 * 1024 * 1024;

  /* Mark the section currently in view in the masthead nav. */
  function navHighlight() {
    var links = [].slice.call(document.querySelectorAll('.masthead nav a[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    var linkFor = {};
    var targets = [];

    links.forEach(function (link) {
      var section = document.getElementById(link.getAttribute('href').slice(1));
      if (!section) return;
      linkFor[section.id] = link;
      targets.push(section);
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var link = linkFor[entry.target.id];
        if (!link) return;
        links.forEach(function (l) { l.classList.remove('current'); });
        link.classList.add('current');
      });
    }, { rootMargin: '-25% 0px -65% 0px' });

    targets.forEach(function (t) { observer.observe(t); });
  }

  /* Submit the RSVP without leaving the page. */
  function rsvpForm() {
    var form = document.getElementById('rsvp-form');
    if (!form) return;

    var message = document.getElementById('f-message');
    var thanks = document.getElementById('thanks');
    var submit = document.getElementById('f-submit');

    function say(text, bad) {
      message.textContent = text;
      message.classList.toggle('bad', !!bad);
      message.hidden = false;
    }

    var photos = document.getElementById('f-photos');

    function photoProblem() {
      if (!photos || !photos.files || !photos.files.length) return null;
      if (photos.files.length > MAX_PHOTOS) {
        return 'Please choose no more than ' + MAX_PHOTOS + ' pictures. You have chosen ' +
               photos.files.length + '.';
      }
      for (var i = 0; i < photos.files.length; i++) {
        if (photos.files[i].size > MAX_BYTES) {
          return '\u201C' + photos.files[i].name + '\u201D is larger than 25 MB. ' +
                 'Please choose a smaller version of it.';
        }
      }
      return null;
    }

    form.addEventListener('submit', function (event) {
      if (form.action.indexOf(PLACEHOLDER) !== -1) {
        event.preventDefault();
        say('This form has no destination yet. Create a form at formspree.io and put its ' +
            'ID in place of YOUR_FORM_ID in index.html.', true);
        return;
      }

      var problem = photoProblem();
      if (problem) {
        event.preventDefault();
        say(problem, true);
        photos.focus();
        return;
      }

      if (typeof window.fetch !== 'function') return; // Let the browser post it.

      event.preventDefault();
      submit.disabled = true;
      submit.textContent = 'Sending';
      say(photos && photos.files && photos.files.length
        ? 'Sending your RSVP and pictures… this can take a moment.'
        : 'Sending your RSVP…');

      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      })
        .then(function (response) {
          if (!response.ok) throw new Error('HTTP ' + response.status);
          form.hidden = true;
          thanks.hidden = false;
          thanks.scrollIntoView({ behavior: 'smooth', block: 'center' });
        })
        .catch(function () {
          submit.disabled = false;
          submit.textContent = 'Send RSVP';
          say('That RSVP did not go through. Try once more, or call the family directly.', true);
        });
    });
  }

  /* Reveal the photographs section once photos.json has entries. */
  function gallery() {
    var section = document.getElementById('photographs');
    var grid = document.getElementById('gallery');
    if (!section || !grid || typeof window.fetch !== 'function') return;

    fetch('photos.json')
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(function (data) {
        var photos = (data && data.photos) || [];
        if (!photos.length) return;

        photos.forEach(function (photo) {
          if (!photo.src) return;

          var figure = document.createElement('figure');

          var img = document.createElement('img');
          img.src = photo.src;
          img.alt = photo.alt || 'Armando Fernandez';
          img.loading = 'lazy';
          figure.appendChild(img);

          if (photo.caption) {
            var caption = document.createElement('figcaption');
            caption.textContent = photo.caption;
            figure.appendChild(caption);
          }

          grid.appendChild(figure);
        });

        section.hidden = false;
      })
      .catch(function () {
        /* No photographs yet. The section stays hidden. */
      });
  }

  navHighlight();
  rsvpForm();
  gallery();
})();
