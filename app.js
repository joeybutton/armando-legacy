/* Armando Fernandez — a celebration of life
   Everything here is enhancement. With JavaScript off, the page reads in full and
   the RSVP form still posts to Formspree the ordinary way. */

(function () {
  'use strict';

  var PLACEHOLDER = 'YOUR_FORM_ID';
  // Formspree's own caps: 10 files per submission, 25 MB each, 100 MB per
  // request. Exceeding any of them rejects the whole submission, RSVP and
  // all, so they are checked here before anything is sent.
  var MAX_PHOTOS = 10;
  var MAX_BYTES = 25 * 1024 * 1024;
  var MAX_TOTAL = 90 * 1024 * 1024;

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
        return 'Please choose no more than ' + MAX_PHOTOS + ' pictures at a time. You have ' +
               'chosen ' + photos.files.length + '. You are very welcome to send the rest ' +
               'in a second reply.';
      }
      var total = 0;
      for (var i = 0; i < photos.files.length; i++) {
        total += photos.files[i].size;
        if (photos.files[i].size > MAX_BYTES) {
          return '\u201C' + photos.files[i].name + '\u201D is larger than 25 MB. ' +
                 'Please choose a smaller version of it.';
        }
      }
      if (total > MAX_TOTAL) {
        return 'Those pictures come to ' + Math.round(total / 1048576) + ' MB together, ' +
               'which is more than can be sent at once. Please send them across a couple ' +
               'of replies.';
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
          say(photos && photos.files && photos.files.length
            ? 'That RSVP did not go through. Large pictures can time out on a slow ' +
              'connection \u2014 try again with fewer, or send the reply on its own and ' +
              'the pictures separately.'
            : 'That RSVP did not go through. Try once more, or call the family directly.', true);
        });
    });
  }

  /* Build the gallery from photos.json, with a lightbox for looking closer. */
  function gallery() {
    var section = document.getElementById('photographs');
    var grid = document.getElementById('gallery');
    if (!section || !grid || typeof window.fetch !== 'function') return;

    var box = document.getElementById('lightbox');
    var boxImg = document.getElementById('lb-img');
    var boxCap = document.getElementById('lb-caption');
    var boxDl = document.getElementById('lb-download');
    var photos = [];
    var at = 0;
    var opener = null;

    function show(i) {
      at = (i + photos.length) % photos.length;
      var photo = photos[at];
      boxImg.src = photo.full || photo.thumb;
      boxImg.alt = '';
      boxCap.textContent = (at + 1) + ' of ' + photos.length;
      boxDl.href = photo.full || photo.thumb;
      boxDl.setAttribute('download', 'armando-fernandez-' + (at + 1) + '.jpg');
    }

    function open(i, button) {
      opener = button;
      show(i);
      box.hidden = false;
      document.body.style.overflow = 'hidden';
      document.getElementById('lb-close').focus();
    }

    function close() {
      box.hidden = true;
      boxImg.removeAttribute('src');
      document.body.style.overflow = '';
      if (opener) opener.focus();
    }

    document.getElementById('lb-close').addEventListener('click', close);
    document.getElementById('lb-prev').addEventListener('click', function () { show(at - 1); });
    document.getElementById('lb-next').addEventListener('click', function () { show(at + 1); });

    // Clicking the backdrop closes; clicking the photograph itself does not.
    box.addEventListener('click', function (event) {
      if (event.target === box) close();
    });

    var touchX = 0, touchY = 0, touchAt = 0;

    box.addEventListener('touchstart', function (event) {
      var t = event.changedTouches[0];
      touchX = t.clientX; touchY = t.clientY; touchAt = Date.now();
    }, { passive: true });

    box.addEventListener('touchend', function (event) {
      var t = event.changedTouches[0];
      var dx = t.clientX - touchX;
      var dy = t.clientY - touchY;
      var held = Date.now() - touchAt;

      // A real swipe: far enough, mostly sideways, and not a slow drag.
      if (Math.abs(dx) >= 45 && Math.abs(dx) >= Math.abs(dy) * 1.5 && held <= 700) {
        show(dx < 0 ? at + 1 : at - 1);
        return;
      }

      // A tap on the photograph itself: its left half goes back, right half
      // forward. Taps on the backdrop still close, and taps on the buttons
      // are theirs alone.
      if (event.target === boxImg &&
          Math.abs(dx) < 12 && Math.abs(dy) < 12 && held < 400) {
        var rect = boxImg.getBoundingClientRect();
        show(t.clientX < rect.left + rect.width / 2 ? at - 1 : at + 1);
      }
    }, { passive: true });

    document.addEventListener('keydown', function (event) {
      if (box.hidden) return;
      if (event.key === 'Escape') close();
      else if (event.key === 'ArrowLeft') show(at - 1);
      else if (event.key === 'ArrowRight') show(at + 1);
    });

    fetch('photos.json')
      .then(function (response) {
        if (!response.ok) throw new Error('HTTP ' + response.status);
        return response.json();
      })
      .then(function (data) {
        photos = (data && data.photos) || [];
        if (!photos.length) return;

        photos.forEach(function (photo, i) {
          if (!photo.thumb) return;

          var button = document.createElement('button');
          button.type = 'button';
          // The photographs carry no descriptions, so the control is labelled
          // by position; without it the button would have no accessible name.
          button.setAttribute('aria-label', 'Photograph ' + (i + 1) + ' of ' + photos.length);

          var img = document.createElement('img');
          img.src = photo.thumb;
          img.alt = '';
          img.loading = 'lazy';
          img.width = 500;
          img.height = 500;
          button.appendChild(img);

          button.addEventListener('click', function () { open(i, button); });
          grid.appendChild(button);
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
