import React from "react"
import ReactDOM from "react-dom"

const Greeting = () => {
	let name = "Mr. Sunshine"
	return <h1>Hi there, my good friend, {name}!</h1>
}

const App = () => {
	return <Greeting />
}

ReactDOM.render(<App />, document.getElementById("root"))
