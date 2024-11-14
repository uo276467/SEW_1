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
        const section = document.querySelector("section")
    
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

        var dif = (semaforo.clic_moment.getTime() - semaforo.unload_moment.getTime()) / 1000

        dif = dif.toPrecision(3)

        const result = document.createElement("p")
        result.textContent = dif + " segundos"

        const section = document.querySelector("section")
        section.appendChild(result)
        
        const main = document.querySelector("main")
        main.classList.remove("load")
        main.classList.remove("unload")  
        
        const startButton = document.querySelector(".startButton")
        startButton.disabled = false
        this.disabled = true
    }
}

new Semaforo()