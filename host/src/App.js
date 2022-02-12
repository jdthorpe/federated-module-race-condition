import React, { useState, useEffect } from "react"

function App() {
    const [a, set_a] = useState()
    const [b, set_b] = useState()

    useEffect(() => {
        import(`module_a/Message`).then((m) => {
            set_a(m.message)
        })
        import(`module_b/Message`).then((m) => {
            set_b(m.message)
        })
    }, [])

    return (
        <>
            <p>Module A says: {a}</p>
            <p>Module B says: {b}</p>
        </>
    )
}

export default App
