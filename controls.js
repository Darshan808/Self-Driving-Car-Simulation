class Controls{
    constructor(type){
        this.forward = false;
        this.right = false;
        this.left = false;
        this.reverse = false;
        switch (type){
            case "KEYS":
                this.#addEventListeners();
                break;
            case "DUMMY":
                this.forward=true;
                break;
        }
    }
    #addEventListeners(){
        document.onkeydown = (e)=>{ //we use arrow function here as in arrow function this keyword refers to the object, whereas in traditional function this keyword refers to the function itself not the object
            switch (e.key) {
                case 'ArrowUp':
                    this.forward = true;
                    break;
                case 'ArrowDown':
                    this.reverse = true;
                    break;
                case 'ArrowLeft':
                    this.left = true;
                    break;
                case 'ArrowRight':
                    this.right = true;
                    break;
                default:
                    break;
            }
        }
        document.onkeyup = (e)=>{
            switch (e.key){
                case 'ArrowUp':
                    this.forward = false;
                    break;
                case 'ArrowDown':
                    this.reverse = false;
                    break;
                case 'ArrowLeft':
                    this.left = false;
                    break;
                case 'ArrowRight':
                    this.right = false;
                    break;
                default:
                    break;
            }
        }
    }
}