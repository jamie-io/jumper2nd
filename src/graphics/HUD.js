export default class HUD{
    constructor(width,height){
        this.width = width;
        this.height = height;
    }
    createHudContainer(){
        var cameraHUD = new THREE.OrthographicCamera(
            -width/2, width/2,
            height/2, -height/2,
            0, 30
        );
        const sceneHUD = new THREE.Scene();


    }
}