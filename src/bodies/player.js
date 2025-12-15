import ModelOBJ from "./basicModel.js";
import flashLightModel from "../assets/flashlight/Untitled.obj?raw"

export default class PlayerBody extends ModelOBJ {
    constructor(gl, position = [0, 0, 0], parent) {
        super(gl, flashLightModel, 0.1, [0.2, 0.2, 0.2])
        this.position = position
        this.safeLoad()
        this.parent = parent
    }

    async safeLoad() {
        await super._load()
        this.parent.setBody(this)
    }
}