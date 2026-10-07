(() => {
  // Prototype photo assignments: replace these paths when final program photos are ready.
  const programs = {
    solo: {
      name: 'Solo Training', count: '01', athletes: '1 athlete / Full attention',
      photo: 'dsc05365.jpeg', position: 'center 42%', graphic: 'solo_trainingprogram1.1.jfif',
      headline: 'JUST YOU.<br>YOUR GAME.<br><em>YOUR WORK.</em>',
      intro: 'Bring the part of your game you keep avoiding. There’s time to work on it here.',
      statement: 'The session starts<br>with <em>your game.</em>',
      story: 'A loose handle. An off-balance jumper. That finish you only trust on one side. With one player, the coach can stay on the detail until you understand the correction.',
      detail: 'No waiting for a teammate’s turn. Work through the movement, hear the feedback, then take another rep. The focus follows what you need.',
      drills: [['Find your base', 'Footwork changes the shot before the ball leaves your hand. Slow it down, check your balance, then build the pace.'], ['Keep the ball yours', 'Work on your handle and finishing angles. Repeat the weak-side move instead of always going back to the comfortable one.'], ['Make the read', 'Put the skill into a game situation. Talk through when to shoot, drive, or change direction—not just how the move looks.']],
      fit: ['You know a weakness you want to spend time on.', 'You want feedback aimed squarely at your game.', 'You like focused reps and room to ask questions.'],
      ending: 'BRING YOUR GAME.<br>WE’LL START THERE.', label: 'BOOK SOLO TRAINING'
    }
  };
  programs.duo = {
    name: 'Duo Training', count: '02', athletes: '2 athletes / One standard',
    photo: 'dsc08075.jpeg', position: 'center 40%', graphic: 'dgit_duotraining.jfif',
    headline: 'BRING SOMEONE<br>WHO CAN<br><em>PUSH YOU.</em>',
    intro: 'Your partner isn’t just sharing the workout. They’re giving you something to answer.',
    statement: 'One more player.<br><em>No easy reps.</em>',
    story: 'You beat the first step. Your partner adjusts. Now the same move needs a different answer. A second player gives you a reaction that a cone never will.',
    detail: 'There’s still space for individual corrections. Then you get to test them against someone who wants to win the next rep as much as you do.',
    drills: [['Pass. Move. Be ready.', 'Partner work puts timing into the rep. Deliver the pass where it’s needed, move your feet, and be ready when the ball comes back.'], ['Read the reaction', 'Attack a closeout. Notice the defender’s feet. Choose your next move from what’s in front of you, rather than running through a script.'], ['Push. Then switch.', 'Compete through offensive and defensive reps, then trade roles. Learn what makes a move tough to guard by facing it yourself.']],
    fit: ['You have a friend, teammate, or sibling ready to train.', 'You want close coaching and a live challenge.', 'You both care about the quality of the next rep.'],
    ending: 'PICK YOUR PARTNER.<br>BRING THE STANDARD.', label: 'BOOK DUO TRAINING'
  };
  programs.trio = {
    name: 'Trio Training', count: '03', athletes: '3 athletes / More reads',
    photo: 'dsc01176-edit.jpeg', position: 'center 35%', graphic: 'dgit_triotraining.jfif',
    headline: 'SEE THE GAP.<br>MAKE<br><em>THE READ.</em>',
    intro: 'Add a third player. Suddenly, the right move depends on more than the defender in front of you.',
    statement: 'Now the game<br><em>opens up.</em>',
    story: 'You drive. Help steps over. A teammate finds space. The finish was there a second ago—now the pass might be the better play. Three players put another decision into the rep.',
    detail: 'Work through those moments in a small group where the coach can stop the action, show the spacing, and let you try the read again.',
    drills: [['Create an advantage', 'Use your first step and the ball to make a defender commit. In small-sided situations, notice the space that decision leaves behind.'], ['Move without the ball', 'A good passing lane doesn’t happen by accident. Adjust your spacing, show your hands, and make the next decision easier for your teammate.'], ['Talk through the play', 'Call the help, close out under control, and switch roles. Read the situation from both sides of the ball.']],
    fit: ['You want to connect your skills to passing and spacing.', 'You have two other players who will compete with you.', 'You want more decisions without a large-group session.'],
    ending: 'SEE IT TOGETHER.<br>WORK IT OUT ON COURT.', label: 'BOOK TRIO TRAINING'
  };
  programs.group = {
    name: 'Small Group Training', count: '04', athletes: '4–6 athletes / Real pressure',
    photo: 'dsc03573.jpeg', position: 'center 40%', graphic: 'dgit_smallgroup.jfif',
    headline: 'MAKE IT WORK.<br><em>WITH SOMEONE<br>IN YOUR WAY.</em>',
    intro: 'A move feels different when the space closes and someone is trying to stop you. That’s the point.',
    statement: 'More voices.<br>Less space.<br><em>Stay composed.</em>',
    story: 'The defender closes. A teammate calls. The gap won’t wait. With four to six athletes, you have to keep your skills together while the picture around you changes.',
    detail: 'This is coached skills work. Situational drills give the competition a purpose; corrections give the next rep a direction. You’re here to learn while you compete.',
    drills: [['Handle the pressure', 'Protect the ball, keep your eyes up, and use your feet when the defender crowds you. A skill needs to hold up in traffic.'], ['Find space together', 'Work on passing windows, movement, and communication. Give the ball handler an option instead of standing and watching.'], ['Compete with a purpose', 'Small-sided play puts the session’s focus under pressure. Stop, hear the correction, and take it into the next possession.']],
    fit: ['You have a group of four to six ready to work.', 'You enjoy a loud, competitive session with coaching.', 'You want to make decisions with more players around you.'],
    ending: 'BRING YOUR GROUP.<br>MAKE EVERY REP COUNT.', label: 'BOOK SMALL GROUP'
  };
  const dialog = document.createElement('dialog');
  dialog.className = 'explore';
  dialog.setAttribute('aria-labelledby', 'explore-title');
  document.body.append(dialog);
  let trigger, activeProgram, closing = false, scrollY = 0, bodyStyle;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  function unlock() {
    Object.assign(document.body.style, bodyStyle);
    window.scrollTo({top: scrollY, behavior: 'instant'});
  }
  function close(book = false) {
    if (closing) return;
    closing = true;
    dialog.classList.add('is-leaving');
    window.setTimeout(() => {
      dialog.close();
      unlock();
      trigger.focus({preventScroll: true});
      if (book) {
        // Use the original carousel trigger and its existing booking listener, unchanged.
        const original = trigger.closest('[data-program-slide]').querySelector('[data-solo-training-open]');
        original.click();
      }
      closing = false;
    }, reduced.matches ? 0 : 160);
  }
  function open(button) {
    trigger = button;
    activeProgram = programs[button.dataset.explore];
    const p = activeProgram;
    dialog.dataset.program = button.dataset.explore;
    dialog.classList.remove('is-leaving');
    dialog.innerHTML = `
      <div class="explore__shell">
        <header class="explore__bar"><span><b>DGIT</b> / THE WORK</span><button type="button" class="explore__close" aria-label="Close training experience">CLOSE <span aria-hidden="true">×</span></button></header>
        <div class="explore__scroll">
          <section class="explore__hero">
            <img class="explore__photo" src="assets/images/${p.photo}" style="object-position:${p.position}" alt="Coach Tommy guiding DGIT athletes through on-court skill work" decoding="async">
            <div class="explore__lighting" aria-hidden="true"></div><div class="explore__court" aria-hidden="true"></div>
            <div class="explore__hero-copy"><p class="explore__eyebrow">${p.name} <span>/ ${p.count}</span></p><h2 id="explore-title">${p.headline}</h2><p class="explore__intro">${p.intro}</p><a class="explore__discover" href="#explore-story">GET INTO THE WORK <span aria-hidden="true">↓</span></a></div>
            <div class="explore__hero-foot"><span>${p.athletes}</span><span>DAILY GRIND IT · CEBU</span></div>
          </section>
          <section class="explore__story explore__section" id="explore-story"><div><p class="explore__eyebrow">01 / WHY THIS SESSION</p><h3>${p.statement}</h3></div><div><p class="explore__lead">${p.story}</p><p>${p.detail}</p></div></section>
          <section class="explore__work explore__section"><div><p class="explore__eyebrow">02 / INSIDE THE WORK</p><h3>Better details.<br>Better reps.</h3><p>Open a rep to see the focus. Coach Tommy shapes the work around the players in the session.</p></div><div class="explore__drills">${p.drills.map(([title,copy],i)=>`<details ${i===0?'open':''}><summary><span>0${i+1}</span>${title}<b aria-hidden="true">+</b></summary><p>${copy}</p></details>`).join('')}</div></section>
          <section class="explore__program explore__section"><div class="explore__fit"><p class="explore__eyebrow">03 / FIND YOUR FIT</p><h3>This is for you if…</h3><ul>${p.fit.map(x=>`<li>${x}</li>`).join('')}</ul><p class="explore__note">Bring your focus. The coaching gives it direction.</p></div><figure><button class="explore__graphic" type="button" aria-label="View ${p.name} program graphic full size"><img src="assets/images/${p.graphic}" alt="${p.name} official program details" loading="lazy" decoding="async"></button><figcaption>THE PROGRAM <span>Tap to view full size ↗</span></figcaption></figure></section>
          <section class="explore__finish explore__section"><p class="explore__eyebrow">${p.athletes}</p><h3>${p.ending}</h3><button class="explore__book" type="button">${p.label} <span aria-hidden="true">↗</span></button><p>Next: your selected program, payment details, and the booking request for Coach Tommy’s review.</p></section>
        </div>
      </div>`;
    scrollY = window.scrollY;
    bodyStyle = Object.fromEntries(['position','top','width','overflow'].map(key=>[key,document.body.style[key]]));
    Object.assign(document.body.style, {position:'fixed', top:`-${scrollY}px`, width:'100%', overflow:'hidden'});
    dialog.showModal();
    dialog.querySelector('.explore__close').focus({preventScroll:true});
    dialog.querySelector('.explore__close').onclick = () => close();
    dialog.querySelector('.explore__book').onclick = () => close(true);
    dialog.querySelector('.explore__discover').onclick = event => {
      event.preventDefault();
      dialog.querySelector('#explore-story').scrollIntoView({behavior: reduced.matches ? 'instant' : 'smooth', block:'start'});
    };
    dialog.querySelector('.explore__graphic').onclick = () => {
      const viewer = document.querySelector('#galleryLightbox');
      const img = viewer.querySelector('img');
      img.src = `assets/images/${p.graphic}`; img.alt = `${p.name} official program details`;
      viewer.querySelector('p').textContent = img.alt;
      viewer.showModal();
    };
  }
  // Keep Tab cycling inside the experience; the image viewer manages its own focus.
  dialog.addEventListener('keydown', event => {
    if (event.key !== 'Tab' || document.querySelector('#galleryLightbox').open) return;
    const items = [...dialog.querySelectorAll('button, a[href], summary')].filter(el => el.getClientRects().length);
    const first = items[0], last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault(); last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault(); first.focus();
    }
  });
  dialog.addEventListener('cancel', event => {event.preventDefault(); close();});
  let backdropDown = false;
  dialog.addEventListener('pointerdown', event => {backdropDown = event.target === dialog;});
  dialog.addEventListener('click', event => {if (backdropDown && event.target === dialog) close(); backdropDown = false;});
  document.querySelectorAll('[data-explore]').forEach(button => button.addEventListener('click', () => open(button)));
})();
