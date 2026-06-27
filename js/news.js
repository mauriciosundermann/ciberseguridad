class NewsManager {

    constructor() {

        this.news = [];
    }

    async load() {

        const response =
            await fetch(
                'data/noticias.json'
            );

        const data =
            await response.json();

        this.news = data.noticias;
    }

    render() {

        return `
            <div class="news-section">

                <h2>
                    📰 Noticias de Ciberseguridad
                </h2>

                <div class="news-grid">

                    ${this.news.map(
            noticia => `

                        <article
                            class="news-card"
                        >

                            <div class="news-date">
                                ${noticia.fecha}
                            </div>

                            <h3>
                                ${noticia.titulo}
                            </h3>

                            <p>
                                ${noticia.resumen}
                            </p>

                            <span
                                class="news-category"
                            >
                                ${noticia.categoria}
                            </span>

                        </article>

                    `
        ).join('')}

                </div>

            </div>
        `;
    }
}