import { signal } from "@preact/signals-react"

const variables = signal({
    playerPosition: [0, 0],
    score: 0
})

export default variables