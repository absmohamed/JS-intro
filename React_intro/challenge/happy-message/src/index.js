import React from "react"
import ReactDOM from "react-dom"

const getMessage = () => {
	const messages = [
		"Your smile lights up my day!",
		"You did a great job with today's challenge!",
		"I can see how hard you're working - what an inspiration!",
		"Remember failing is a necessary part of learning, so don't let it get you down.",
		"Your positive attitude lifted me up today!"
	]
	let index = Math.floor(Math.random() * messages.length)
	return messages[index]
}

const HappyMessage = () => {
	return <p>{getMessage()}</p>
}

const App = () => {
	return <HappyMessage />
}

ReactDOM.render(<App />, document.getElementById("root"))
