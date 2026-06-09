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

    sidebar.querySelectorAll('.hero-thumb').forEach(button => {
        button.addEventListener('click', () => {
            const index = Number(button.dataset.index);
            updateActive(index);
        });
    });

    updateActive(0);
}

function renderAmenazas(items){
    const container = document.getElementById('amenazas-list');
    if(!container) return;
    container.innerHTML = items.length ? items.map(it=>{
        return `
            <article class="card" data-type="${escapeAttr(it.id)}">
                <h4>${escapeHtml(it.titulo)}</h4>
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

function renderModulos(items){
    const container = document.getElementById('modulos-list');
    if(!container) return;
    container.innerHTML = items.length ? items.map(item=>{
        return `
            <article class="card">
                <h4>${escapeHtml(item.titulo)}</h4>
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
        return `
            <article class="card" data-type="${escapeAttr(item.tipo || '')}">
                <h4>${escapeHtml(item.titulo || item.id)}</h4>
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
        return `<li><a href="${escapeAttr(item.url)}" target="_blank" rel="noopener">${escapeHtml(item.nombre)} — ${escapeHtml(item.titulo)}</a></li>`;
    }).join('') : '<li>No hay fuentes disponibles.</li>';
}

function renderNoticias(items){
    const container = document.getElementById('noticias-list');
    if(!container) return;
    container.innerHTML = items.length ? items.map(item=>{
        return `
            <article class="news-item">
                <strong>${escapeHtml(item.titulo)}</strong>
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
