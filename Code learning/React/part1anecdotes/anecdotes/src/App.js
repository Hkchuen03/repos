import { useState } from 'react'

const Header = (props) => (
  <h1>
    {props.text}
  </h1>
)

const Display = (props) => {
  return(
    <div>
      {props.text}
    </div>
  )
}

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]

  const [selected, setSelected] = useState(0)
  const [points, setPoints] = useState([0, 0, 0, 0, 0, 0, 0])
  const [maxselected, setMaxselected] = useState(0)


  const setRandomSelected = () => {
    const randomNo = Math.floor(Math.random() * anecdotes.length)
    setSelected(randomNo)
  }

  const voteSelected = () => {
    const copy = [...points]
    copy[selected] += 1

    setPoints([...copy])

    let maxVote = 0
    let maxVoteSelected = 0

    copy.forEach((value, idr) => {
      if(value >= maxVote){
        maxVote = value
        maxVoteSelected = idr
      }
    })

    setMaxselected(maxVoteSelected)
  }


  return (
    <div>
      <Header text="Anecdote of the day" />
      <Display text={anecdotes[selected]}/>
      <Display text={"has " + points[selected] + " votes"} />
      <Button handleClick={() => voteSelected()} text='vote' />
      <Button handleClick={() => setRandomSelected()} text='next anecdotes' />
      <Header text="Anecdote with most votes" />
      <Display text={anecdotes[maxselected]}/>
      <Display text={"has " + points[maxselected] + " votes"} />
    </div>
  )
}

export default App