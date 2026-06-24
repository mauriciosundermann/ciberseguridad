const siteData = {
    baseUrl: document.baseURI,
    observer: null,
};

function initMenu(){
    const toggle = document.querySelector('.menu-toggle');
    const closeBtn = document.querySelector('.menu-close');
    const sidebar = document.getElementById('sidebar');
    const links = document.querySelectorAll('.sidebar-link');

    if(!toggle || !sidebar) return;

    const setOpen = (open) => {
        sidebar.classList.toggle('open', open);
        toggle.setAttribute('aria-expanded', String(Boolean(open)));
    };

    toggle.addEventListener('click', ()=>{
        const expanded = toggle.getAttribute('aria-expanded') === 'true';
        setOpen(!expanded);
    });

    if(closeBtn){
        closeBtn.addEventListener('click', ()=>{
            setOpen(false);
        });
    }

    links.forEach(link => {
        link.addEventListener('click', ()=>{
            if(window.innerWidth <= 900){
                setOpen(false);
            }
        });
    });
}

function initSmoothScroll(){
    const nav = document.getElementById('main-nav');
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
        a.addEventListener('click', function(e){
            const href = this.getAttribute('href');
            if(href.length > 1){
                e.preventDefault();
                const target = document.querySelector(href);
                if(target) target.scrollIntoView({behavior:'smooth',block:'start'});
                if(window.innerWidth <= 640 && nav){
                    nav.style.display = '';
                    document.querySelector('.menu-toggle')?.setAttribute('aria-expanded','false');
                }
            }
        });
    });
}

function initRevealObserver(){
    if('IntersectionObserver' in window){
        siteData.observer = new IntersectionObserver((entries, obs)=>{
            entries.forEach(entry=>{
                if(entry.isIntersecting){
                    entry.target.classList.add('revealed');
                    obs.unobserve(entry.target);
                }
            });
        }, {threshold: 0.12});
    } else {
        siteData.observer = null;
    }
}

function observeCards(container, selector = '.card'){
    const nodes = container.querySelectorAll(selector);
    if(!nodes) return;
    nodes.forEach((node, idx) => {
        // stagger reveal using CSS variable
        const delay = `${idx * 80}ms`;
        node.style.setProperty('--delay', delay);
    });

    if(siteData.observer){
        nodes.forEach(node => siteData.observer.observe(node));
    } else {
        // fallback: reveal with timeouts
        nodes.forEach((node, idx) => setTimeout(()=> node.classList.add('revealed'), idx * 80));
    }
} 

function addCardInteractions(container){
    container.querySelectorAll('.card[data-type]').forEach(card=>{
        if(card.dataset.interactionBound) return;
        card.dataset.interactionBound = 'true';
        card.addEventListener('click', ()=>{
            const type = card.dataset.type || 'info';
            const consejos = siteData.config?.sitio?.consejos || {};
            const msg = consejos[type] || 'Consejo: revisá las buenas prácticas antes de continuar.';
            alert(msg);
        });
    });
}

async function fetchJSON(path){
    try{
        const url = new URL(path, siteData.baseUrl).href;
        const res = await fetch(url, {cache:'no-store'});
        if(!res.ok) throw new Error('HTTP '+res.status);
        return await res.json();
    }catch(err){
        console.error('Error cargando JSON:', path, err);
        return null;
    }
}

async function loadAllData(){
    console.info('Cargando datos JSON...');
    const [config, modulos, noticias, fuentes, actividades, glosario] = await Promise.all([
        fetchJSON('data/configuracion.json'),
        fetchJSON('data/modulos.json'),
        fetchJSON('data/noticias.json'),
        fetchJSON('data/fuentes.json'),
        fetchJSON('data/actividades.json'),
        fetchJSON('data/glosario.json')
    ]);

    if(config) applyConfig(config);
    renderModulos(modulos?.modulos || []);
    renderActividades(actividades?.actividades || []);
    renderFuentes(fuentes?.fuentes || []);
    renderNoticias(noticias?.noticias || []);
    renderGlosario(glosario?.terminos || []);
    console.info('Datos cargados: ', {
        modulos: modulos?.modulos?.length || 0,
        actividades: actividades?.actividades?.length || 0,
        noticias: noticias?.noticias?.length || 0,
        fuentes: fuentes?.fuentes?.length || 0
    });
}

function applyConfig(cfg){
    // store config for other modules
    siteData.config = cfg || {};

    if(cfg?.sitio?.nombre){
        const brand = document.querySelector('.brand');
        if(brand) brand.textContent = cfg.sitio.nombre;
    }
    if(cfg?.sitio?.tema === 'oscuro'){
        document.documentElement.style.setProperty('--bg','#0b1220');
        document.documentElement.style.setProperty('--card','#071025');
        document.documentElement.style.setProperty('--muted','#9ca3af');
    }

    // render site-level UI pieces from config
    if(cfg?.sitio?.hero) renderHero(cfg.sitio.hero);
    if(Array.isArray(cfg?.sitio?.amenazas)) renderAmenazas(cfg.sitio.amenazas);
    if(Array.isArray(cfg?.sitio?.practicas)) renderPracticas(cfg.sitio.practicas);
    if(cfg?.sitio?.footer) renderFooter(cfg.sitio.footer);
}

function renderHero(hero){
    const title = document.getElementById('hero-title');
    const desc = document.getElementById('hero-desc');
    const cta = document.getElementById('hero-cta');
    if(title) title.textContent = hero.titulo || '';
    if(desc) desc.textContent = hero.descripcion || '';
    if(cta){
        cta.textContent = hero.cta_texto || '';
        if(hero.cta_destino) cta.setAttribute('href', hero.cta_destino);
    }
    if(Array.isArray(hero.imagenes) && hero.imagenes.length > 0){
        renderHeroImages(hero.imagenes);
    }
}

function renderHeroImages(images){
    const mainImg = document.getElementById('hero-image-main');
    const sidebar = document.getElementById('hero-image-sidebar');
    if(!mainImg || !sidebar) return;

    const normalized = images.map(item => {
        if(typeof item === 'string') return {url: item, alt: 'Imagen de ciberseguridad'};
        if(item && item.url) return {url: item.url, alt: item.alt || 'Imagen de ciberseguridad'};
        return null;
    }).filter(Boolean);

    if(normalized.length === 0){
        sidebar.hidden = true;
        mainImg.src = '';
        mainImg.alt = 'Ilustración de ciberseguridad';
        return;
    }

    let activeIndex = 0;
    const updateActive = (index) => {
        const image = normalized[index];
        if(!image) return;
        mainImg.src = image.url;
        mainImg.alt = image.alt;
        activeIndex = index;
        sidebar.querySelectorAll('.hero-thumb').forEach((thumb, idx)=>{
            thumb.classList.toggle('active', idx === index);
        });
    };

    sidebar.innerHTML = normalized.map((img, idx)=>{
        return `
            <button type="button" class="hero-thumb" data-index="${idx}" aria-label="Ver imagen ${idx + 1}">
                <img src="${escapeAttr(img.url)}" alt="${escapeAttr(img.alt)}" />
            </button>
        `;
    }).join('');

    if(normalized.length > 1){
        sidebar.hidden = false;
    } else {
        sidebar.hidden = true;
    }

    const startRotation = () => {
        if(siteData.heroRotationTimer){
            clearInterval(siteData.heroRotationTimer);
        }
        if(normalized.length < 2) return;
        siteData.heroRotationTimer = setInterval(() => {
            const nextIndex = (activeIndex + 1) % normalized.length;
            updateActive(nextIndex);
        }, 4500);
    };

    sidebar.querySelectorAll('.hero-thumb').forEach(button => {
        button.addEventListener('click', () => {
            const index = Number(button.dataset.index);
            updateActive(index);
            startRotation();
        });
    });

    updateActive(0);
    startRotation();
}

function renderAmenazas(items){
    const container = document.getElementById('amenazas-list');
    if(!container) return;
    container.innerHTML = items.length ? items.map(it=>{
        const icon = renderIcon(getIconForThreat(it.id || it.titulo));
        return `
            <article class="card" data-type="${escapeAttr(it.id)}">
                <div class="card-head">
                    ${icon}
                    <h4>${escapeHtml(it.titulo)}</h4>
                </div>
                <p>${escapeHtml(it.descripcion || '')}</p>
            </article>
        `;
    }).join('') : '<p>No hay amenazas definidas.</p>';
    observeCards(container);
    addCardInteractions(container);
}

function renderPracticas(items){
    const ul = document.getElementById('practicas-list');
    if(!ul) return;
    ul.innerHTML = items.length ? items.map(p=>`<li>${escapeHtml(p)}</li>`).join('') : '<li>No hay prácticas disponibles.</li>';
}

function renderFooter(footer){
    const c = document.getElementById('footer-copyright');
    const n = document.getElementById('footer-note');
    if(c) c.textContent = footer.copyright || '';
    if(n) n.textContent = footer.nota || '';
}

function getSvgIcon(name){
    const icons = {
        shieldCheck: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 4 5 7v5c0 5 5 8 7 8s7-3 7-8V7l-7-3z"/><path d="m9.5 12.5 2 2 4-4"/></svg>',
        lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="11" width="12" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
        key: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 2 11 12"/><circle cx="7" cy="17" r="3"/><path d="M8 17h3"/><path d="M11 17h2"/></svg>',
        bug: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 7c0-2.2 1.8-4 4-4s4 1.8 4 4"/><path d="M12 13v8"/><path d="M5 11h14"/><path d="M7 16c1.5-1.5 3-2 5-2s3.5.5 5 2"/><path d="M4 7l3 3m13-3-3 3"/></svg>',
        book: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M6 4h12a2 2 0 0 1 2 2v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V6a2 2 0 0 1 2-2Z"/><path d="M6 8h12"/><path d="M9 15h6"/><path d="M9 19h6"/></svg>',
        link: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 14a4 4 0 0 1 0-5.66l1.77-1.77a4 4 0 0 1 5.66 0 4 4 0 0 1 0 5.66l-1.77 1.77"/><path d="M14 10a4 4 0 0 1 0 5.66l-1.77 1.77a4 4 0 0 1-5.66 0 4 4 0 0 1 0-5.66l1.77-1.77"/></svg>',
        newspaper: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 5h16v14H4z"/><path d="M8 9h8"/><path d="M8 13h5"/><path d="M8 17h4"/><path d="M16 5v14"/></svg>',
        globe: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="8"/><path d="M4 12h16"/><path d="M12 4a15 15 0 0 1 0 16"/><path d="M12 4a15 15 0 0 0 0 16"/></svg>',
        spark: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2v20"/><path d="M2 12h20"/><path d="m4.5 4.5 15 15"/><path d="m19.5 4.5-15 15"/></svg>',
        module: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="3"/><path d="M4 10h16M10 4v16"/></svg>',
        quiz: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8"/><path d="M8 13h5"/><path d="M8 17h6"/></svg>',
        activity: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3v18"/><path d="M3 12h18"/><path d="M5 5l14 14"/></svg>',
        default: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><path d="M12 7v5l3 3"/></svg>'
    };
    return icons[name] || icons.default;
}

function renderIcon(name){
    return `<span class="content-icon" aria-hidden="true">${getSvgIcon(name)}</span>`;
}

function getIconForModule(item){
    const title = (item.titulo || item.id || '').toLowerCase();
    if(title.includes('phishing') || title.includes('correo')) return 'shieldCheck';
    if(title.includes('ransomware') || title.includes('malware')) return 'lock';
    if(title.includes('contraseña') || title.includes('clave')) return 'key';
    if(title.includes('seguridad') || title.includes('datos')) return 'shieldCheck';
    return 'module';
}

function getIconForActivity(type){
    const key = String(type || '').toLowerCase();
    if(key.includes('quiz') || key.includes('cuestionario')) return 'quiz';
    if(key.includes('crucigrama') || key.includes('juego')) return 'activity';
    if(key.includes('prueba') || key.includes('reto')) return 'spark';
    return 'activity';
}

function getIconForThreat(id){
    const key = String(id || '').toLowerCase();
    if(key.includes('phishing')) return 'shieldCheck';
    if(key.includes('ransomware')) return 'lock';
    if(key.includes('contrasena') || key.includes('claves')) return 'key';
    return 'default';
}

function getIconForNews(){
    return 'newspaper';
}

function getIconForResource(){
    return 'link';
}

function renderModulos(items){
    const container = document.getElementById('modulos-list');
    if(!container) return;
    container.innerHTML = items.length ? items.map(item=>{
        const icon = renderIcon(getIconForModule(item));
        return `
            <article class="card">
                <div class="card-head">
                    ${icon}
                    <h4>${escapeHtml(item.titulo)}</h4>
                </div>
                <p>${escapeHtml(item.descripcion || item.texto_principal || '')}</p>
                <div class="tag-row">${(item.palabras_clave || []).map(k=>`<span class="tag">${escapeHtml(k)}</span>`).join('')}</div>
            </article>
        `;
    }).join('') : '<p>No hay módulos disponibles.</p>';
    observeCards(container);
}

function renderActividades(items){
    const container = document.getElementById('actividades-list');
    if(!container) return;
    container.innerHTML = items.length ? items.map(item=>{
        const meta = item.tipo ? `<small class="muted">${escapeHtml(item.tipo)}</small>` : '';
        const details = [];
        if(Array.isArray(item.preguntas)) details.push(`${item.preguntas.length} pregunta(s)`);
        if(Array.isArray(item.palabras)) details.push(`Palabras: ${escapeHtml(item.palabras.join(', '))}`);
        const icon = renderIcon(getIconForActivity(item.tipo || item.id));
        return `
            <article class="card" data-type="${escapeAttr(item.tipo || '')}">
                <div class="card-head">
                    ${icon}
                    <h4>${escapeHtml(item.titulo || item.id)}</h4>
                </div>
                ${meta}
                ${details.length ? `<p>${details.join(' · ')}</p>` : ''}
            </article>
        `;
    }).join('') : '<p>No hay actividades disponibles.</p>';
    observeCards(container);
    addCardInteractions(container);
}

function renderFuentes(items){
    const container = document.getElementById('fuentes-list');
    if(!container) return;
    container.innerHTML = items.length ? items.map(item=>{
        return `<li><span class="resource-icon" aria-hidden="true">${getSvgIcon(getIconForResource())}</span><a href="${escapeAttr(item.url)}" target="_blank" rel="noopener">${escapeHtml(item.nombre)} — ${escapeHtml(item.titulo)}</a></li>`;
    }).join('') : '<li>No hay fuentes disponibles.</li>';
}

function renderNoticias(items){
    const container = document.getElementById('noticias-list');
    if(!container) return;
    container.innerHTML = items.length ? items.map(item=>{
        return `
            <article class="news-item">
                <div class="news-head">
                    <span class="news-icon" aria-hidden="true">${getSvgIcon(getIconForNews())}</span>
                    <strong>${escapeHtml(item.titulo)}</strong>
                </div>
                <div class="muted">${escapeHtml(item.fecha)}${item.categoria ? ` • ${escapeHtml(item.categoria)}` : ''}</div>
                <p>${escapeHtml(item.resumen || '')}</p>
            </article>
        `;
    }).join('') : '<p>No hay noticias disponibles.</p>';

    // observe news items too with staggered reveal
    observeCards(container, '.news-item');
} 

function renderGlosario(items){
    console.log('Glosario cargado:', items);
}

function escapeHtml(value){
    if(value === null || value === undefined) return '';
    return String(value).replace(/[&<>"']/g, ch => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;','\'':'&#39;'
    })[ch] || ch);
}

function escapeAttr(value){
    if(value === null || value === undefined) return '';
    return String(value).replace(/"/g,'&quot;');
}

function showWarning(message){
    const warning = document.getElementById('data-warning');
    if(!warning) return;
    warning.textContent = message;
    warning.hidden = false;
}

function init(){
    initMenu();
    initSmoothScroll();
    initRevealObserver();
    initHeroParallax();
    if(window.location.protocol === 'file:'){
        showWarning('El sitio se está abriendo con file://. Para que los JSON se carguen correctamente, usa un servidor local: python3 -m http.server 8000.');
    }
    loadAllData();
}

// small hero parallax using requestAnimationFrame
function initHeroParallax(){
    const heroVisual = document.querySelector('.hero-visual');
    if(!heroVisual) return;
    let ticking = false;
    function onScroll(){
        if(ticking) return;
        ticking = true;
        requestAnimationFrame(()=>{
            const rect = heroVisual.getBoundingClientRect();
            const winH = window.innerHeight;
            const offset = (rect.top - winH/2) * 0.03;
            heroVisual.style.setProperty('--parallax', `${offset}px`);
            heroVisual.classList.add('parallax');
            ticking = false;
        });
    }
    window.addEventListener('scroll', onScroll, {passive:true});
    onScroll();
} 

document.addEventListener('DOMContentLoaded', init);
