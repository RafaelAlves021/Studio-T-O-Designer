/* Studio T O Designer - JS puro, sem dependências além do Bootstrap */
(() => {
  'use strict';
  document.documentElement.classList.add('js'); /* só esconde itens do reveal se o JS estiver rodando */
  const $ = (s, c = document) => c.querySelector(s), $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const WA = '5521987610261';
  const wa = t => `https://wa.me/${WA}?text=${encodeURIComponent(t)}`;

  /* Serviços (ícones: Bootstrap Icons) */
  const services = [
    ['bi-scissors', 'Cabeleireiro', 'Cortes personalizados para o seu estilo.'],
    ['bi-brightness-high', 'Mechas e Coloração', 'Loiros e morena iluminada com saúde dos fios.'],
    ['bi-gem', 'Nails Designer', 'Unhas em gel com acabamento impecável.'],
    ['bi-hand-thumbs-up', 'Manicure e Pedicure', 'Cuidado e beleza para mãos e pés.'],
    ['bi-droplet-half', 'Tratamentos capilares', 'Inclui o Método TO, com foco em saúde e brilho.'],
    ['bi-flower1', 'Spa dos Pés', 'Momento de relaxamento e renovação.'],
    ['bi-wind', 'Escova Bionatural', 'Fios alinhados, macios e com movimento.']
  ];
  $('#servGrid').innerHTML = services.map(([i, n, d]) => `
    <div class="col-sm-6 col-lg-4 reveal"><div class="glass card-s tilt"><i class="bi ${i}" aria-hidden="true"></i><h3>${n}</h3><p>${d}</p>
    <a class="btn btn-ghost btn-sm" data-wa data-svc="${n}" href="https://wa.me/${WA}">Agendar</a></div></div>`).join('');

  /* Links do WhatsApp com mensagem pré-preenchida */
  $$('[data-wa]').forEach(a => {
    const s = a.dataset.svc;
    a.href = wa(s ? `Olá! Gostaria de agendar ${s} no Studio T O Designer` : 'Olá! Gostaria de agendar um horário no Studio T O Designer');
    a.target = '_blank'; a.rel = 'noopener';
  });

  /* Navbar sólida + voltar ao topo */
  const nav = $('#nav'), top = $('#top');
  const onScroll = () => { nav.classList.toggle('solid', scrollY > 40); top.classList.toggle('show', scrollY > 600); };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  top.onclick = () => scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });

  /* Título do hero por palavra */
  const h1 = $('.reveal-words');
  h1.innerHTML = h1.textContent.split(' ').map((w, i) => `<span class="w" style="transition-delay:${i * 90}ms">${w}</span>`).join(' ');
  requestAnimationFrame(() => h1.classList.add('in'));

  /* Reveal on scroll + contadores */
  const count = el => {
    const end = +el.dataset.count, dec = +el.dataset.dec || 0, t0 = performance.now();
    const step = t => { const p = Math.min((t - t0) / 1200, 1); el.textContent = (end * p).toFixed(dec).replace('.', ','); if (p < 1) requestAnimationFrame(step); };
    reduce ? (el.textContent = end.toFixed(dec).replace('.', ',')) : requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); $$('[data-count]', e.target).forEach(count); io.unobserve(e.target);
  }), { threshold: 0, rootMargin: '0px 0px -5% 0px' });
  $$('.reveal').forEach(el => io.observe(el));
  /* Garantia: se algo não aparecer, mostra tudo após 2,5s */
  setTimeout(() => $$('.reveal:not(.in)').forEach(el => { el.classList.add('in'); $$('[data-count]', el).forEach(count); }), 2500);

  /* Tilt 3D e cursor de brilho (só desktop) */
  const fine = matchMedia('(hover:hover) and (pointer:fine)').matches;
  if (fine && !reduce) {
    $$('.tilt').forEach(c => {
      c.addEventListener('pointermove', e => {
        const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
        c.style.transform = `perspective(700px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) translateZ(6px)`;
      });
      c.addEventListener('pointerleave', () => c.style.transform = '');
    });
    const g = $('.glow-cursor');
    addEventListener('pointermove', e => { g.classList.add('on'); g.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; }, { passive: true });
  }

  /* Horários: dia atual e status aberto/fechado (09h-19h, seg-sáb) */
  const now = new Date(), d = now.getDay(), h = now.getHours() + now.getMinutes() / 60;
  const open = d !== 0 && h >= 9 && h < 19;
  $(`.hours tr[data-d="${d}"]`).classList.add('today');
  const st = $('#status'); st.textContent = open ? 'Aberto agora' : 'Fechado agora'; st.classList.toggle('off', !open);
  $('#openChip').textContent = open ? 'Aberto hoje até 19h' : (d === 0 || h >= 19 ? 'Abrimos às 9h (seg a sáb)' : 'Abrimos hoje às 9h');

  /* Galeria: filtros + lightbox */
  $$('.filters button').forEach(b => b.onclick = () => {
    $$('.filters button').forEach(x => x.classList.toggle('on', x === b));
    $$('#gal button').forEach(i => i.classList.toggle('off', b.dataset.f !== 'all' && i.dataset.c !== b.dataset.f));
  });
  const lb = $('#lb'), lbi = $('img', lb);
  $$('#gal button').forEach(b => b.onclick = () => { const i = $('img', b); lbi.src = i.src; lbi.alt = i.alt; lb.hidden = false; $('button', lb).focus(); });
  lb.onclick = () => lb.hidden = true;
  addEventListener('keydown', e => { if (e.key === 'Escape') lb.hidden = true; });

  /* Slider antes/depois */
  const ba = $('#ba');
  $('input', ba).addEventListener('input', e => ba.style.setProperty('--p', e.target.value + '%'));
})();