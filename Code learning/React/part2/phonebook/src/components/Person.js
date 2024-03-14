const Person = ({person, toggleImportanceOf}) => {
    return (
        <li className="person">
        {person.name} {person.number} <button onClick={toggleImportanceOf}>Delete</button>
        </li>
    )
}

export default Person