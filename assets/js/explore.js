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
  function close(book = false, packageId) {
    if (closing) return;
    closing = true;
    dialog.classList.add('is-leaving');
    window.setTimeout(() => {
      packageObserver?.disconnect();
      dialog.close();
      unlock();
      trigger.focus({preventScroll: true});
      if (book) {
        window.DGITBooking.open(trigger, activeProgram.name, packageId);
      }
      closing = false;
    }, reduced.matches ? 0 : 160);
  }
  function open(button) {
    trigger = button;
    activeProgram = programs[button.dataset.explore];
    const p = activeProgram;
    dialog.dataset.program = button.dataset.explore;
    delete dialog.dataset.view;
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
    if (button.dataset.explore === 'solo') { renderSoloPackages(); return; }
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
  const packages = window.DGITSoloPackages;
  const money = value => `₱${value.toLocaleString('en-PH')}`;
  let packageObserver;
  function soloHero(title, eyebrow, intro) {
    return `<section class="explore__hero solo-hero">
      <img class="explore__photo" src="assets/images/dsc05365.jpeg" alt="Coach Tom guiding individual basketball skill work" decoding="async">
      <div class="explore__lighting" aria-hidden="true"></div><div class="explore__court" aria-hidden="true"></div>
      <div class="explore__hero-copy"><p class="explore__eyebrow">${eyebrow}</p><h2 id="explore-title" tabindex="-1">${title}</h2><p class="explore__intro">${intro}</p></div>
    </section>`;
  }
  function renderSoloPackages(focusId) {
    packageObserver?.disconnect();
    const scroll = dialog.querySelector('.explore__scroll');
    dialog.dataset.view = 'packages';
    scroll.innerHTML = `<section class="explore__hero solo-entry-hero">
      <img class="explore__photo" src="assets/images/dsc05365.jpeg" alt="Coach Tom guiding an athlete through individual ball-handling work" decoding="async">
      <div class="explore__lighting" aria-hidden="true"></div>
      <div class="solo-entry-hero__copy"><p class="explore__eyebrow">DGIT SOLO TRAINING SYSTEM</p>
      <h2 id="explore-title">${programs.solo.headline}</h2>
      <p class="explore__intro">${programs.solo.intro}</p>
      <div class="solo-entry-hero__actions">
        <a href="#solo-package-options" class="explore__discover solo-entry-hero__scroll">GET INTO THE WORK <span aria-hidden="true">↓</span></a>
        <button type="button" class="explore__book" data-solo-hero-book>BOOK SOLO TRAINING NOW!</button>
      </div></div>
      </section>` +
      `<section id="solo-package-options" class="solo-packages explore__section" aria-label="Available Solo training packages">
        ${Object.values(packages).map((p,i) => `<article class="solo-package">
          <p class="explore__eyebrow">0${i+1} / ${p.sessions === 1 ? '1 Session' : p.label}</p>
          <h3>${p.name}</h3>${p.id === 'solo_10' ? '<p class="solo-package__subtitle">Individualized Basketball Development</p>' : ''}
          <p class="solo-package__position">${p.position}</p>
          <div class="solo-package__price"><strong>${money(p.price)}</strong><span>Court fee included</span>${p.perSession ? `<small>${money(p.perSession)} per session</small>` : '<small>One session</small>'}</div>
          <button type="button" class="explore__book" data-solo-explore="${p.id}">${p.exploreLabel} <span aria-hidden="true">↗</span></button>
        </article>`).join('')}
      </section>
      <section class="explore__finish explore__section" aria-label="Book Solo Training">
        <button type="button" class="explore__book" data-solo-bottom-book>BOOK SOLO TRAINING NOW!</button>
      </section>`;
    scroll.scrollTop = 0;
    scroll.querySelectorAll('[data-solo-hero-book], [data-solo-bottom-book]').forEach(button => {
      button.onclick = () => close(true, window.DGITBooking.selectedSoloPackage);
    });
    scroll.querySelector('.solo-entry-hero__scroll').onclick = event => {
      event.preventDefault();
      scroll.querySelector('#solo-package-options').scrollIntoView({behavior: reduced.matches ? 'instant' : 'smooth', block:'start'});
    };
    scroll.querySelectorAll('[data-solo-explore]').forEach(button => button.onclick = () => renderSoloDetail(button.dataset.soloExplore));
    if (focusId) {
      scroll.querySelector('#solo-package-options').scrollIntoView({block:'start'});
      scroll.querySelector(`[data-solo-explore="${focusId}"]`).focus({preventScroll:true});
    }
  }
  function renderSoloDetail(id) {
    const p = packages[id];
    if (!p) return;
    window.DGITBooking.selectSoloPackage(id);
    packageObserver?.disconnect();
    const scroll = dialog.querySelector('.explore__scroll');
    dialog.dataset.view = id;
    scroll.innerHTML = `<div class="solo-back"><button type="button" data-packages-back>← Back to Packages</button><span>${p.label} · ${money(p.price)}</span></div>` +
      soloHero(p.headline, p.name, p.subtitle) + `
      <section class="solo-story explore__section"><p class="explore__eyebrow">${p.label} / Court fee included</p><h3>${p.position}</h3><div class="solo-story__copy">${p.story.map(t=>`<p>${t}</p>`).join('')}</div></section>
      <section class="solo-inclusions explore__section"><p class="explore__eyebrow">Inside the session</p><h3>What’s included</h3><dl>${p.included.map(([t,c],i)=>`<div><dt><span>0${i+1}</span>${t}</dt><dd>${c}</dd></div>`).join('')}</dl></section>
      ${p.phases ? `<section class="solo-framework explore__section"><p class="explore__eyebrow">The DGIT Development Framework</p><h3>Five phases.<br>A clear progression.</h3><p>Each phase builds on the previous one, from a strong foundation to effective execution in real-game situations.</p><ol>${p.phases.map(([t,c],i)=>`<li><span aria-hidden="true">0${i+1}</span><div><h4>${t}</h4><p>${c}</p></div></li>`).join('')}</ol></section>
      <section class="solo-more explore__section"><p class="explore__eyebrow">More than Solo Training</p><h3>Keep your development going.</h3><p>Your development doesn’t stop with your 10 sessions. Ask Coach Tom about access to available training systems, including the DGIT Weekend Course Program and other development programs that can support your continued growth.</p><p class="solo-artwork-note">Access arrangements, availability, and any separate fees must be confirmed with Coach Tom. These programs are not promised as free or automatically included.</p></section>` : ''}
      <section class="explore__program explore__section"><div><p class="explore__eyebrow">The program</p><h3>${p.closingTitle}</h3><p>${p.closing}</p><p class="solo-signature">DGIT — Dreams Grow In Time.</p></div><figure><button type="button" class="explore__graphic" aria-label="View original Solo promotional graphic"><img src="assets/images/solo_trainingprogram1.1.jfif" alt="Original Solo Training promotional artwork; see current package price below" width="2048" height="1716" loading="lazy"></button><figcaption>ORIGINAL SOLO ARTWORK</figcaption><p class="solo-artwork-note">Original promotional artwork is preserved. Current package terms: ${p.label}, ${money(p.price)}, court fee included. Older prices or inclusions printed on the graphic do not apply.</p></figure></section>
      <section class="explore__finish explore__section"><p class="explore__eyebrow">${p.sessions} ${p.sessions===1?'SESSION':'SESSIONS'} · COURT FEE INCLUDED</p><h3>${money(p.price)}</h3><button type="button" class="explore__book">${p.bookLabel} <span aria-hidden="true">↗</span></button><p>Next: review your selected package, complete payment, then send your booking request for Coach Tommy’s review.</p></section>`;
    scroll.scrollTop = 0;
    scroll.querySelector('#explore-title').focus({preventScroll:true});
    scroll.querySelector('[data-packages-back]').onclick = () => renderSoloPackages(id);
    scroll.querySelector('.explore__book').onclick = () => close(true, id);
    scroll.querySelector('.explore__graphic').onclick = () => {
      const viewer = document.querySelector('#galleryLightbox');
      viewer.querySelector('img').src = 'assets/images/solo_trainingprogram1.1.jfif';
      viewer.querySelector('img').alt = 'Original Solo promotional graphic';
      viewer.querySelector('p').textContent = `Original artwork. Current package: ${p.label} · ${money(p.price)} · Court fee included. Older printed terms do not apply.`;
      viewer.showModal();
    };
    if (!reduced.matches && 'IntersectionObserver' in window) {
      packageObserver = new IntersectionObserver(entries => entries.forEach(entry => {
        if (entry.isIntersecting) { entry.target.classList.add('phase-in'); packageObserver.unobserve(entry.target); }
      }), {root:scroll, threshold:.2});
      scroll.querySelectorAll('.solo-framework li').forEach(li => packageObserver.observe(li));
    }
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
