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

        this.shuffleElements()
        this.createElements()
        this.addEventListeners()
    }
    shuffleElements(){
        let array = this.elements.elements;

        for (let i = array.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            // Intercambio de elementos en posiciones i y j
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    unflipCards(){
        this.lockBoard = true
        setTimeout(() => {
            this.firstCard.removeAttribute('data-state')
            this.secondCard.removeAttribute('data-state')
            this.resetBoard()
        }, 1000)
    }
    resetBoard(){
        this.firstCard = null
        this.secondCard = null
        this.hasFlippedCard = false
        this.lockBoard = false
    }
    checkForMath(){
        this.firstCard.getAttribute("data-element") === this.secondCard.getAttribute("data-element") ? 
            this.disableCards() : this.unflipCards()
    }
    disableCards(){
        this.firstCard.setAttribute('data-state', 'revealed')
        this.secondCard.setAttribute('data-state', 'revealed')
        this.resetBoard();
    }
    createElements(){
        const section = document.querySelector("section")

        this.elements.elements.forEach(item => {
            //Crear el artículo
            const article = document.createElement("article")

            //Atributo data-element
            article.setAttribute("data-element", item.element)

            //Crear el encabezado
            const text = document.createElement("h4")
            text.textContent = "Click para voltear"
            article.appendChild(text)

            //Crear la imagen
            const image = document.createElement("img")
            image.src = item.source
            image.alt = item.element
            article.appendChild(image)

            //Añadir el artículo a la sección
            section.appendChild(article)
        });
    }
    addEventListeners(){
        const articles = document.querySelectorAll("section article");

        articles.forEach(card => {
            card.onclick = this.flipCard.bind(card, this)
        });
    }
    flipCard(game){
        if(this.getAttribute('data-state') === 'revealed')
            return
        if(game.lockBoard)
            return
        if(this === game.firstCard)
            return

        this.setAttribute('data-state', 'flip')
        if(game.hasFlippedCard){
            game.secondCard = this
            game.checkForMath()
        }else{
            game.hasFlippedCard = true
            game.firstCard = this
        }
    }
}

new Memoria()