const canvas = document.querySelector("#gameboard");
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


class Player {
    constructor(){
        this.positionY = 35;
        this.positionX = 35;
        this.fallingSpeed = 5;
        this.movementSpeed = 1;
        this.width = 25;
        this.height = 25;
        this.fillColor = "#FF0000";
        this.strokeColor = "#F00000";
    };
}

class Area {
    constructor(codedPlain){
        this.arena = codedPlain;
        this.arenaHeight = codedPlain.length;
        this.arenaWidth = codedPlain[0].length;
        this.blockWidth = 25;
        this.blockHeight = 25;
        this.spaceColor = "#0000FF";
        this.obstacleColor = "#00FF00";
        this.trapColor = "#FF0000";
    };
}

class Game{
    constructor(arena){
        this.player = new Player();
        this.area = new Area(arena);
        this.drawBlock = function (x,y,w,h,c){
            ctx.save();
            ctx.fillStyle = c;
            ctx.translate(x, y);
            ctx.fillRect(0, 0, w, h);
            ctx.restore();
        }
        this.renderArea = function (area){

            for(let i = 0; i < area.arenaHeight; i++){
                for(let j = 0; j < area.arenaWidth; j++){
                    switch(area.arena[i][j]){
                        case "P":
                            this.drawBlock(j*area.blockWidth, i*area.blockHeight, area.blockWidth, area.blockHeight, area.spaceColor);
                            console.log("P");
                            break;
                        case 'O':
                            this.drawBlock(j*area.blockWidth, i*area.blockHeight, area.blockWidth, area.blockHeight, area.obstacleColor);
                            console.log("O");
                            break;
                        case 'T':
                            this.drawBlock(j*area.blockWidth, i*area.blockHeight, area.blockWidth, area.blockHeight, area.trapColor);
                            console.log("T");
                            break;
                    }
                }
            }
           
        };
        this.gravity = function(area, player){
            if(area.arena[Math.floor((player.positionY+player.height)/area.blockHeight)][Math.floor((player.positionX+player.width)/area.blockWidth)] == "P"){
                player.positionY += player.fallingSpeed;
            }
        };
        this.movement = function(area, player){
            window.addEventListener("keydown", (event) =>{
                switch(event.key){
                    case "ArrowLeft":
                        if(area.arena[Math.floor((player.positionY+player.height)/area.blockHeight)][Math.floor((player.positionX)/area.blockWidth)] != "O"){
                            player.positionX -= player.movementSpeed;
                        }   
                        break;
                    case "ArrowRight":
                        if(area.arena[Math.floor((player.positionY+player.height)/area.blockHeight)][Math.floor((player.positionX)/area.blockWidth)] != "O"){
                            player.positionX += player.movementSpeed;
                        }   
                        break;
                    case "ArrowDown":
                        if(area.arena[Math.floor((player.positionY+player.height)/area.blockHeight)][Math.floor((player.positionX)/area.blockWidth)] != "O"){
                            player.positionY -= player.movementSpeed;
                        }   
                        break;
                    case "ArrowUp":
                        if(area.arena[Math.floor((player.positionY+player.height)/area.blockHeight)][Math.floor((player.positionX)/area.blockWidth)] != "O"){
                            player.positionY -= player.movementSpeed;
                        }   
                        break;
                }
            })
        }
        this.renderPlayer = function (area, player){
            ctx.save();
            ctx.fillStyle = player.fillColor;
            ctx.strokeStyle = player.strokeColor;
            this.movement(area, player);
            this.gravity(area, player);
            ctx.fillRect(player.positionX, player.positionY, player.width, player.height);
            ctx.restore();
        }
    }
    initiateGame = function (){
        ctx.clearRect(0,0,canvas.height, canvas.width);
        this.renderArea(this.area, this.player);
        this.renderPlayer(this.area, this.player);
    }
};

let firstArea = JSON.parse(localStorage.getItem("level1"));
const game = new Game(firstArea);

const renderGame = () =>{
    setInterval(() =>{
        game.initiateGame();
    }, 100)

}

const beginButton = document.querySelector("#begin-game");
beginButton.addEventListener("click", () => {
    const menu = document.querySelector(".menu");
    menu.remove();
    renderGame();
})

const options = ["P", "O", "T"];
let chosenOption = options[1];

const arenaDesigning = (w,h) =>{
    const previousRows = document.querySelectorAll(".edit-row");
    if(previousRows != null){
        previousRows.forEach((row) => {
            row.remove();
        })
    }
    if(firstArea == null) firstArea = [];

    const newPlain = document.querySelector(".edit-plain")

    if(firstArea.length == h && firstArea[0].length == w){
        for(let i = 0; i < h; i++){
            const row = document.createElement("div");
            row.classList.add("edit-row");
            for(let j = 0; j < w; j++){
                const cell = document.createElement("span");
                row.appendChild(cell);
                switch(firstArea[i][j]){
                    case 'P':
                        cell.classList.add("edit-empty");
                        break;
                    case 'O':
                        cell.classList.add("edit-obstacle");
                        break;
                    case 'T':
                        cell.classList.add("edit-trap");
                        break;
                }
                cell.addEventListener("click", () =>{
                    switch(chosenOption){
                        default: break;
                        case 'P': 
                            cell.innerText = "P";
                            cell.classList.add("edit-empty");
                            console.log(firstArea.length);
                            firstArea[i][j] = "P";
                        break;
                        case 'O': 
                            cell.innerText = "O";
                            console.log(firstArea);
                            cell.classList.add("edit-obstacle");
                            firstArea[i][j] = "O";
                        break;
                        case 'T': 
                            cell.innerText = "T";
                            console.log(firstArea.length);
                            cell.classList.add("edit-trap");
                            firstArea[i][j] = "T";
                        break;
                    }
                    arenaDesigning(w, h);
                })
            }
            newPlain.appendChild(row);
        }  
    }else{
        console.log("else");
        firstArea = []
        for(let i = 0; i < h; i++){
            firstArea.push([]);
            for(let j = 0; j < w; j++){
                firstArea[i].push("P");
            }
        }

        arenaDesigning(w,h,firstArea);
    }
    localStorage.setItem("level1", JSON.stringify(firstArea))
    console.log(firstArea);
}

const editForm = document.querySelector(".edit-form");

editForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const menu = document.querySelector(".menu");
    menu.classList.toggle("hidden");
    canvas.classList.toggle("hidden");

    const levelArray = [];
    const body = document.querySelector("body");

    const editPlain = document.createElement("div");
    editPlain.classList.add("edit-plain");
    body.appendChild(editPlain);

    const optionsSpace = document.createElement("div");
    optionsSpace.classList.add("edit-options");
    editPlain.appendChild(optionsSpace);

    const emptyOption = document.createElement("div"); 
    emptyOption.classList.add("edit-option");
    emptyOption.innerText = options[0];
    emptyOption.addEventListener("click", () => {
        chosenOption = emptyOption.innerText;
        console.log(chosenOption);
    })
    
    const obstacleOption = document.createElement("div"); 
    obstacleOption.classList.add("edit-option");
    obstacleOption.innerText = options[1];
    obstacleOption.addEventListener("click", () => {
        chosenOption = obstacleOption.innerText;
        console.log(chosenOption);
    })
    
    const trapOption = document.createElement("div"); 
    trapOption.classList.add("edit-option");
    trapOption.innerText = options[2];
    trapOption.addEventListener("click", () => {
        chosenOption = trapOption.innerText;
        console.log(chosenOption);
    })
    optionsSpace.append(emptyOption, obstacleOption, trapOption);

    // input -> e.target[input-number];
    height = e.target[0].value;

    width = e.target[1].value;

    arenaDesigning(width,height);
})

const hidebox = document.querySelector(".hide-box");

hidebox.addEventListener("click", () =>{
    console.dir(hidebox);
    hidebox.childNodes[1].classList.toggle("hidden");
    editForm.classList.toggle("hidden");
})