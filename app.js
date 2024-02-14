const canvas = document.querySelector("#gameboard");
const ctx = canvas.getContext("2d");

canvas.height = window.innerHeight;
canvas.width = window.innerWidth;


class Player {
    constructor(){
        this.positionY = 20;
        this.positionX = 20;
        this.fallingSpeed = 10;
        this.radius = 10;
        this.fillColor = "#FF0000"
        this.strokeColor = "#F00000"
    };
}

class Area {
    constructor(codedPlain){
        this.arena = codedPlain;
        this.arenaHeight = codedPlain.length;
        this.arenaWidth = 200;
        this.blockWidth = 5;
        this.blockHeight = 5;
        this.obstacleColor = "#FFFFFF";
    };
}

class Game{
    constructor(levelFirst){
        this.player = new Player();
        this.obstacle = new Area(levelFirst);
        this.renderObstacle = function (obstacle){
            ctx.save();
            ctx.fillStyle = obstacle.color;
            ctx.translate(obstacle.startX, obstacle.startY);
            ctx.fillRect(0, 0, obstacle.width, obstacle.height);
            ctx.closePath();
            ctx.restore();
        }
        this.gravity = function (obstacle, player){
            let fallingSpeed = 5;
            if(player.positionY+fallingSpeed < obstacle.startY){
                player.positionY += fallingSpeed;
            }
            return player;
        }
        this.renderPlayer = function (obstacle, player){
            this.gravity(this.obstacle, player);
            ctx.save();
            ctx.fillStyle = player.fillColor;
            ctx.strokeStyle = player.strokeColor;
            ctx.translate(player.positionX, player.positionY);
            ctx.beginPath();
            ctx.arc(0, -player.radius, player.radius, 0, Math.PI*2, false);
            ctx.fill();
            ctx.stroke();
            ctx.closePath();
            ctx.restore();

            return player
        }

    };
    setScene(){
        ctx.clearRect(0, 0, canvas.height, canvas.width);
        this.renderArena(this.obstacle);
        this.renderPlayer(this.obstacle, this.player);
        this.player = this.renderPlayer();
    };
}
console.log(localStorage.getItem("level1"));

let levelFirst = [];
const game = new Game([]);

const renderGame = () =>{
    setInterval(() => {
        game.setScene();
    }, 0);
}

const beginButton = document.querySelector("#begin-game");
beginButton.addEventListener("click", () => {
    const menu = document.querySelector(".menu");
    menu.remove();
    renderGame();
})

const options = ["X", "O", "T"];
let chosenOption = options[1];

const arenaDesigning = (w,h) =>{
    const previousRows = document.querySelectorAll(".edit-row");
    if(previousRows != null){
        previousRows.forEach((row) => {
            row.remove();
        })
    }


    const newPlain = document.querySelector(".edit-plain")

    if(levelFirst.length == h && levelFirst[0].length == w){
        for(let i = 0; i < h; i++){
            const row = document.createElement("div");
            row.classList.add("edit-row");
            for(let j = 0; j < w; j++){
                const cell = document.createElement("span");
                row.appendChild(cell);
                switch(levelFirst[i][j]){
                    case 'X':
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
                        case 'X': 
                            cell.innerText = "X";
                            cell.classList.add("edit-empty");
                            console.log(levelFirst.length);
                            levelFirst[i][j] = "X";
                            break;
                            case 'O': 
                            cell.innerText = "O";
                            console.log(levelFirst);
                            cell.classList.add("edit-obstacle");
                            levelFirst[i][j] = "O";
                            break;
                            case 'T': 
                            cell.innerText = "T";
                            console.log(levelFirst.length);
                            cell.classList.add("edit-trap");
                            levelFirst[i][j] = "T";
                            break;
                    }
                    arenaDesigning(w, h);
                })
            }
            newPlain.appendChild(row);
        }  
    }else{
        console.log("else");
        levelFirst = []
        for(let i = 0; i < h; i++){
            levelFirst.push([]);
            for(let j = 0; j < w; j++){
                levelFirst[i].push("X");
            }
        }

        arenaDesigning(w,h,levelFirst);
    }
    localStorage.setItem("level1", JSON.stringify(levelFirst))
    console.log(levelFirst);
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