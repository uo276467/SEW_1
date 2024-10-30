class Memoria{
    elements = 
    {"elements":[
            {"element":"RedBull", "source":"https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg"},
            {"element":"RedBull", "source":"https://upload.wikimedia.org/wikipedia/de/c/c4/Red_Bull_Racing_logo.svg"},
            {"element":"McLaren", "source":"https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg"},
            {"element":"McLaren", "source":"https://upload.wikimedia.org/wikipedia/en/6/66/McLaren_Racing_logo.svg"},
            {"element":"Alpine", "source":"https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg"},
            {"element":"Alpine", "source":"https://upload.wikimedia.org/wikipedia/fr/b/b7/Alpine_F1_Team_2021_Logo.svg"},
            {"element":"AstonMartin", "source":"https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg"},
            {"element":"AstonMartin", "source":"https://upload.wikimedia.org/wikipedia/fr/7/72/Aston_Martin_Aramco_Cognizant_F1.svg"},
            {"element":"Ferrari", "source":"https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg"},
            {"element":"Ferrari", "source":"https://upload.wikimedia.org/wikipedia/de/c/c0/Scuderia_Ferrari_Logo.svg"},
            {"element":"Mercedes", "source":"https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg"},
            {"element":"Mercedes", "source":"https://upload.wikimedia.org/wikipedia/commons/f/fb/Mercedes_AMG_Petronas_F1_Logo.svg"}
        ]
    }
    constructor(){
        this.hasFlippedCard = false
        this.lockBoard = false
        this.firstCard = null
        this.secondCard = null
    }
    shuffleElements(){
        // Verificación de que elements y elements.elements están definidos y son un array
        if (!this.elements || !Array.isArray(this.elements.elements) || this.elements.elements.length === 0) {
            console.error("No hay elementos disponibles para mezclar.");
            return;
        }

        let array = this.elements.elements;

        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            // Intercambio de elementos en posiciones i y j
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    unflipCards(){
        this.lockBoard = true;
    }
    resetBoard(){
        this.firstCard = null
        this.secondCard = null
        this.hasFlippedCard = false
        this.lockBoard = false
    }
    checkForMath(){
        if(this.firstCard === this.secondCard)
            this.disableCards()
        else
            this.unflipCards()
    }
    disableCards(){
        //datastate = revealed
        this.resetBoard();
    }
    createElements(){
        const section = document.querySelector("section")

        this.elements.elements.forEach(item => {
            // Crear el artículo
            const article = document.createElement("article")
            article.setAttribute("data-element", item.element)
            article.classList.add("card")

            // Crear el encabezado
            const text = document.createElement("h3")
            text.textContent = "Tarjeta de memoria"
            article.appendChild(text)

            // Crear la imagen
            const image = document.createElement("img")
            image.src = item.source
            image.alt = item.element
            image.style.display = "none" 
            article.appendChild(image)

            // Añadir el artículo a la sección
            section.appendChild(article)
        });

        this.addEventListeners()
    }
    addEventListeners(){
        const articles = document.querySelectorAll("section article");

        articles.forEach(card => {
            card.onclick = this.flipCard.bind(card, this)
        });
    }
    flipCard(card){
        const text = card.querySelector("h3")
        const image = card.querySelector("img")
        text.style.display = "none"
        image.style.display = "block"
    }
}

const memoria = new Memoria()
memoria.shuffleElements()
memoria.createElements()