class ResourcesManager {

    constructor() {
        this.modules = [];
    }
    async loadModules() {
        try {
            const response =
                await fetch("data/learning-content.json");
            const data =
                await response.json();
            this.modules = data.modules;
        } catch(error) {
            console.error(
                "Error cargando contenido educativo",
                error
            );
        }
    }

    render() {
        return `
            <div class="resources-page">

                <div class="page-header">
                    <h1>🎓 Centro de Aprendizaje</h1>

                    <p>
                        Aprenda conceptos esenciales
                        para navegar de forma segura.
                    </p>
                </div>

                <div class="resources-grid">

                    ${this.modules.map(module =>
                        this.renderCard(module)
                    ).join("")}

                </div>

            </div>
        `;
    }

    renderCard(module) {

        return `
            <div
                class="resource-card"
                onclick="app.openModule('${module.id}')"
            >

                <div class="resource-icon">
                    ${module.icon}
                </div>

                <h3>
                    ${module.title}
                </h3>

                <p>
                    ${module.description}
                </p>

            </div>
        `;
    }

    getModule(id) {

        return this.modules.find(
            module => module.id === id
        );
    }

    renderModule(moduleId) {
        const module = this.getModule(moduleId);
        if (!module) {
            return `
                <div class="error-page">
                    <h2>
                        Módulo no encontrado
                    </h2>
                </div>
            `;
        }
        return `<div class="module-view">
            <button
                class="back-button"
                onclick="app.showRecursos()"
            >
                ← Volver
            </button>
            <h1>
                ${module.icon}
                ${module.title}
            </h1>
            <section class="content-block">
                <p>
                    ${module.content}
                </p>
            </section>
            <section class="tips-block">
                <h2>Consejos de Seguridad</h2>
                <ul>
                    ${module.tips.map(tip =>
                        `<li>${tip}</li>`
                    ).join("")}
                </ul>
            </section>
        </div>
    `;
    }
    openModule(id) {

    const content =
        document.getElementById(
            "main-content"
        );

    content.innerHTML =
        this.renderModule(id);
}

}