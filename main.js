const carCanvas = document.getElementById('carCanvas');
const carCtx = carCanvas.getContext('2d');
const networkCanvas = document.getElementById('networkCanvas');
const networkCtx = networkCanvas.getContext('2d');

carCanvas.width = 200;
networkCanvas.width = 400;

const bestBrain =
  '{"levels":[{"inputs":[0.3645124874763708,0,0,0,0.3546634807078054],"outputs":[0,1,1,1,0,1],"biases":[0.03451589855755649,-0.20484656413485156,0.03630905869324829,-0.09722316897472935,-0.0166381044568817,-0.06842078980774374],"weights":[[-0.09149494405164146,0.25526543739504204,0.03692528668619509,-0.12260999082956635,-0.24231122304068745,-0.09980400393209822],[-0.043916316282084186,-0.09613770816433817,0.05396997129020988,-0.047598470569437654,-0.19803902651065206,-0.2516192791205397],[0.14844381887587055,-0.10566415706744882,-0.20272076413169868,0.17988595625402198,-0.09344995546891387,0.13017567034708083],[0.25543289230400346,-0.2455387220540493,-0.2425259513893161,0.02604515909738872,0.12524109196197566,0.3076416330990159],[0.04886489390921537,-0.015944931683503763,0.20481849027255172,0.24250260413008135,-0.1763081944280927,0.09007775265475443]]},{"inputs":[0,1,1,1,0,1],"outputs":[1,1,1,0],"biases":[-0.1916651894291694,-0.13685019904061324,0.10234484694400227,0.02992567248931423],"weights":[[-0.027586726396734915,0.01623925534337306,-0.06939703864282984,0.33324622588443303],[-0.21306257603590667,0.08049706910004184,0.03123602946879392,-0.008233381965737462],[0.0660369787032861,-0.2556852240816098,0.5131275790607983,-0.057560011526841315],[0.010531252634012223,-0.19221641676786994,-0.13163808298408622,-0.2250680175439016],[-0.09132738555730066,-0.21428702542836248,-0.34215763545430994,-0.0339899172230486],[-0.00488407465869177,0.2332067756934954,-0.011448192177650487,-0.09682256797869643]]}]}';

const myRoad = new road(carCanvas.width/2,carCanvas.width);
const allCars = generateCars(1);
let bestCar = allCars[0];
// if(localStorage.getItem('bestBrain')){
//     for(let i=0;i<allCars.length;i++){
//         allCars[i].brain = JSON.parse(localStorage.getItem('bestBrain'));
//         if(i!=0){
//             NeuralNetwork.mutate(allCars[i].brain,0.1);
//         }
//     }
// }
if(bestBrain){
    for(let i=0;i<allCars.length;i++){
        allCars[i].brain = JSON.parse(bestBrain);
        if(i!=0){
            NeuralNetwork.mutate(allCars[i].brain,0.2);
        }
    }
}

function generateCars(N){
    const cars = [];
    for(let i=0;i<N;i++){
        cars.push(new Car(myRoad.getLaneCenter(1),100,30,50,"AI",4,"red"));
    }
    return cars;
}

//Traffic
const traffic = [
    new Car(myRoad.getLaneCenter(1),-100,30,50,"DUMMY",2),
    new Car(myRoad.getLaneCenter(2),-300,30,50,"DUMMY",2),
    new Car(myRoad.getLaneCenter(1),-600,30,50,"DUMMY",2),
    new Car(myRoad.getLaneCenter(1),-800,30,50,"DUMMY",2),
    new Car(myRoad.getLaneCenter(2),-800,30,50,"DUMMY",2),
    // new Car(myRoad.getLaneCenter(1),-1000,30,50,"DUMMY",2),
    new Car(myRoad.getLaneCenter(0),-1200,30,50,"DUMMY",2),
    new Car(myRoad.getLaneCenter(1),-1200,30,50,"DUMMY",2),
    new Car(myRoad.getLaneCenter(1),-1500,30,50,"DUMMY",2),
    new Car(myRoad.getLaneCenter(2),-1700,30,50,"DUMMY",2),
    new Car(myRoad.getLaneCenter(1),-1700,30,50,"DUMMY",2),
    new Car(myRoad.getLaneCenter(1),-1800,30,50,"DUMMY",2),
    new Car(myRoad.getLaneCenter(0),-2000,30,50,"DUMMY",2),
    new Car(myRoad.getLaneCenter(2),-2000,30,50,"DUMMY",2),
    new Car(myRoad.getLaneCenter(1),-2300,30,50,"DUMMY",2),
    new Car(myRoad.getLaneCenter(1),-2500,30,50,"DUMMY",2),
    new Car(myRoad.getLaneCenter(2),-2500,30,50,"DUMMY",2),
    new Car(myRoad.getLaneCenter(1),-2700,30,50,"DUMMY",2),
    new Car(myRoad.getLaneCenter(0),-2900,30,50,"DUMMY",2),
    new Car(myRoad.getLaneCenter(2),-2900,30,50,"DUMMY",2),
    new Car(myRoad.getLaneCenter(1),-3100,30,50,"DUMMY",2),
    new Car(myRoad.getLaneCenter(2),-3400,30,50,"DUMMY",2),
    new Car(myRoad.getLaneCenter(1),-3400,30,50,"DUMMY",2),
]

function save(){
    localStorage.setItem('bestBrain',JSON.stringify(bestCar.brain))
}
function discard(){
    localStorage.removeItem('bestBrain');
}

function animate(time){
    requestAnimationFrame(animate);
    // carCtx.clearRect(0,0,200,window.innerHeight);
    carCanvas.height=window.innerHeight;
    networkCanvas.height = window.innerHeight;
    carCtx.save();
    bestCar = allCars.find(c=>c.y===Math.min(...allCars.map(c=>c.y)));
    carCtx.translate(0,-bestCar.y+0.7*carCanvas.height);
    myRoad.draw(carCtx);
    traffic.forEach(car=>{
        car.update(carCtx,myRoad.borders,traffic,"red");
    })
    carCtx.globalAlpha = 0.2;
    for(let i=0;i<allCars.length;i++){
        if(allCars[i]===bestCar){
            continue;
        }
        else{
            allCars[i].update(carCtx,myRoad.borders,traffic,"blue");
        }
    }
    carCtx.globalAlpha = 1;
    bestCar.update(carCtx, myRoad.borders, traffic, "blue", true);
    carCtx.restore();
    networkCtx.lineDashOffset = -time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);
}
animate();