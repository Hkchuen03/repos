const Part = ({part}) => {
    return (
      <div>
        {part.name} {part.exercises}
      </div>
    )
  }
  
  const Total = ({text}) => (
    <div>
      <b>{text}</b>
    </div>
  )
  
  const Header = ({name}) => (
    <h2>
      {name}
    </h2>
  )
  
  const Content =({parts}) => {
    const total = parts.reduce((s, {exercises}) => s + exercises, 0)
  
    return (
      <div>
        {parts.map(part =>
          <Part key={part.id} part={part} />
        )}
        <Total text={"total of " + total + " exercises"} />
      </div>
    )
  }
  
  const Course = ({course}) => {
    return (
      <div>
        <Header name={course.name} />
        <Content parts={course.parts} />
      </div>
    )
  }
  
  export default Course