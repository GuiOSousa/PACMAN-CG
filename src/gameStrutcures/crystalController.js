import Crystal from "../objects/crystal";
import Map from "./map"

export default class CrystalController {
    constructor(scene) {
        this.crystals = []
        this.crystalSlots = []
        this.freeSlots = []
        this.scene = scene
    }

    shuffle(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
    }

    getRandomFreeSlot() {
        const options = Map.crystalSlots.filter(s => !this.crystals.some(c => c == s))
        
        console.log(options)

        this.shuffle(options)

        return options[0]
    }

    addCrystal(slot) {
        this.scene.addObject(new Crystal(this.scene.gl, slot))
        this.freeSlots.filter(e => e != slot)
        this.crystals.push(slot)
    }

    removeCrystal() {

    }

    addCrystals(n = -1) {
        this.crystalSlots = [...Map.crystalSlots]
        this.freeSlots = [...this.crystalSlots]
        const count = this.crystalSlots.length

        if (n == -1) {
            n = Math.ceil(count/1)
        }

        console.log(n)

        for (let i = 0; i < n; i++) {
            const slot = this.getRandomFreeSlot()
            this.addCrystal(slot)
        }

    }
}