import ModelOBJ from "./basicModel.js";
import ghostModel from "../assets/ghost01/Untitled.obj?raw"

export default class ChaseGhostBody extends ModelOBJ {
    constructor(gl, position = [0, 0, 0], parent) {
        super(gl, ghostModel, 0.5, [1, 0.6, 0])
        this.position = position
        this.safeLoad()
        this.parent = parent
    }

    async safeLoad() {
        await super._load()
        this.parent.setBody(this)
    }
}