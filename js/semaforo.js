class Semaforo{
    constructor(){
        this.levels = [0.2, 0.5, 0.8]
        this.lights = 4
        this.unload_moment = null
        this.clic_moment = null
        this.difficulty = this.levels[Math.floor(Math.random() * 4)]
        this.createStructure()
    }
    createStructure() {
        const main = document.querySelector("main")

        const section = document.createElement("section")
        main.append(section)
    
        const title = document.createElement("h3")
        title.textContent = "Semáforo"
        section.appendChild(title)
    
        for (let i = 0; i < this.lights; i++) {
            const light = document.createElement("div")
            light.classList.add("light");
            section.appendChild(light)
        }
    
        const startButton = document.createElement("button")
        startButton.textContent = "Encender semáforo"
        startButton.classList.add("startButton")
        startButton.onclick = this.initSequence.bind(startButton, this)
        section.appendChild(startButton)
    
        const stopButton = document.createElement("button")
        stopButton.textContent = "Reacción"
        stopButton.classList.add("stopButton")
        stopButton.onclick = this.stopReaction.bind(stopButton, this)
        stopButton.disabled = true
        section.appendChild(stopButton)
    }
    initSequence(semaforo){
        const main = document.querySelector("main")
        main.classList.add("load")
        main.classList.remove("unload")
        
        this.disabled = true
        
        setTimeout(() => {
            semaforo.unload_moment = new Date()
            semaforo.endSequence()
        }, semaforo.difficulty * 100 + 2000)
    }
    endSequence(){
        const stopButton = document.querySelector(".stopButton")
        stopButton.disabled = false

        const main = document.querySelector("main")
        main.classList.remove("load")
        main.classList.add("unload")
    }
    stopReaction(semaforo){
        semaforo.clic_moment = new Date()

        var tiempoReaccion = (semaforo.clic_moment.getTime() - semaforo.unload_moment.getTime()) / 1000

        tiempoReaccion = tiempoReaccion.toPrecision(3)
        
        const prevResult = $("p")
        if(prevResult) prevResult.remove()

        const prevForm = $("article")
        if(prevForm) prevForm.remove()

        const result = document.createElement("p")
        result.textContent = tiempoReaccion + " segundos"

        const section = document.querySelector("section")
        section.appendChild(result)
        
        const main = document.querySelector("main")
        main.classList.remove("load")
        main.classList.remove("unload")  
        
        const startButton = document.querySelector(".startButton")
        startButton.disabled = false
        this.disabled = true

        semaforo.createRecordForm(tiempoReaccion)
    }
    createRecordForm(tiempoReaccion) {
        const main = $("main");

        const article = $("<article>");

        const h4 = $("<h4>Registra tu puntuación</h4>")
        article.append(h4)

        const form = $("<form>")
            .attr("action", "#")
            .attr("method", "post");

        const nameField = $("<input>")
            .attr("type", "text")
            .attr("name", "nombre")
            .attr("placeholder", "Nombre")
            .prop("required", true);

        const surnameField = $("<input>")
            .attr("type", "text")
            .attr("name", "apellidos")
            .attr("placeholder", "Apellidos")
            .prop("required", true);

        const levelField = $("<input>")
            .attr("type", "text")
            .attr("name", "nivel")
            .val(this.difficulty)
            .prop("readonly", true);

        const timeField = $("<input>")
            .attr("type", "text")
            .attr("name", "tiempoReaccion")
            .val(tiempoReaccion + " segundos")
            .prop("readonly", true);

        const submitButton = $("<button>")
            .attr("type", "submit")
            .text("Enviar");

        form.append(
            $("<label>").text("Nombre").append(nameField),
            $("<label>").text("Apellidos").append(surnameField),
            $("<label>").text("Nivel").append(levelField),
            $("<label>").text("Tiempo de reacción").append(timeField),
            submitButton
        );

        article.append(form)
        main.append(article)
    }
}

new Semaforo()