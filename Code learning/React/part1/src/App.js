import { useState } from 'react'

const Header = (props) => (
  <div>
    <h1>
      {props.text}
    </h1>
  </div>
)

const Button = (props) => (
  <button onClick={props.handleClick}>
    {props.text}
  </button>
)

const StatisticLine = props => <div>{props.text} {props.value}</div>

const Statistics  = (props) => {
  if (props.good === 0 && props.neutral === 0 && props.bad === 0 ) {
    return (
      <div>
        No feedback given
      </div>
    )
  }else{
    const average = (props.good - props.bad) / (props.good + props.neutral + props.bad)

    const positiveValue = props.good / (props.good + props.neutral + props.bad) * 100

    return (
      <div>
        <table>
          <tr>
            <StatisticLine text="good" value={props.good} />
          </tr>
          <tr>
            <StatisticLine text="neutral" value={props.neutral} />
          </tr>
          <tr>
            <StatisticLine text="bad" value={props.bad} />
          </tr>
          <tr>
            <StatisticLine text="all" value={props.good + props.neutral + props.bad} />
          </tr>
          <tr>
            <StatisticLine text="average" value={average} />
          </tr>
          <tr>
            <StatisticLine text="positive" value={positiveValue + "%"} />
          </tr>
        </table>
      </div>
    )    
  }

}

function App() {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const setToGood = newValue => {
    setGood(newValue)
  }

  const setToNeutral = newValue => {
    setNeutral(newValue)
  }

  const setToBad = newValue => {
    setBad(newValue)
  }

  return (
    <div>
      <Header text="give feedback" />
      <Button handleClick={() => setToGood(good + 1)} text="good" />
      <Button handleClick={() => setToNeutral(neutral + 1)} text="neutral" />
      <Button handleClick={() => setBad(bad + 1)} text="bad" />
      <Header text="statistics" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App;
