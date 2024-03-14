import { useState, useEffect } from 'react'
import Person from './components/Person'
import Notification from './components/Notification'

import personService from './services/persons'

const Persons = ({personsToShow, toggleImportanceOf}) => (
  <div>
    <ul>
      {personsToShow.map(person =>
        <Person 
          key={person.id} 
          person={person} 
          toggleImportanceOf={() => toggleImportanceOf(person.id)}
        />
      )}
    </ul>
  </div>
)

const Filter = (props) => {
  return (
    <div>
      {props.text} <input value={props.filter} onChange={props.handleFilterChange}/>
    </div>
  )
}

const PersonForm  = (props) => (
  <div>
    <form onSubmit={props.addPerson}>
    <div>
      name: <input value={props.newName} onChange={props.handleNameChange} />
    </div>
    <div>
      number: <input value={props.newPhone} onChange={props.handlePhoneChange}/>
    </div>
    <div>
      <button type="submit">add</button>
    </div>
    </form>
  </div>
)

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newPhone, setNewPhone] = useState('')
  const [filter, setFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    personService
      .getAll()
      .then(initialNotesPerson => {
        setPersons(initialNotesPerson)
      })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()

    if(persons.filter(p => p.name === newName).length > 0){
      //update old person
      //alert(`${newName} is already added to phonebook`);
      const person = persons.find(p => p.name === newName)
      if(window.confirm(`${person.name} is already added to phonebook, replace the old number with a new one?`)){
        const changePerson = {...person, number: newPhone}
        const pid = person.id
  
        personService
          .update(person.id, changePerson)
          .then(returnedPerson => {
            setErrorMessage(
              `updated ${newName}`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.map(person => person.id !== pid ? person : returnedPerson))
          })
          .catch(error => {
            setErrorMessage(
              `the person ${person.name} was already deleted from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
            setPersons(persons.filter(p => p.id !== pid))
          })
      }
    } else{
      //create new person
      let maxNo = 0
      persons.forEach(v => {
        if(v.id > maxNo)
          maxNo = v.id
      })

      maxNo = Number(maxNo) + 1

      const personObject = {
        name : newName,
        number : newPhone,
        //id : persons.length + 1,
        id : String(maxNo),
      }
  
      personService
        .create(personObject)
        .then(returnedPerson => {
          setErrorMessage(
            `added ${newName}`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.concat(personObject))
          setNewName('')
          setNewPhone('')
        })
    }
  }

  const toggleImportanceOf = (id) => {
    const person = persons.find(p => p.id === id)
    if(window.confirm(`Delete ${person.name} ?`)){
      personService
        .deleteSinglePerson(id)
        .then(returnedPerson => {
          setErrorMessage(
            `deleted ${person.name}`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter(p => p.id !== id))
        })
        .catch(error => {
          setErrorMessage(
            `the person ${person.name} was already deleted from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
          setPersons(persons.filter(p => p.id !== id))
        })
    }
  }

  const personToShow = filter === '' ? persons : persons.filter(person => person.name.toLowerCase().includes(filter))

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handlePhoneChange = (event) => {
    setNewPhone(event.target.value)
  }
  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter text='filter shown with ' filter={filter} handleFilterChange={handleFilterChange}/>
      <h3>Add a new</h3>
      <PersonForm addPerson={addPerson} newName={newName} handleNameChange={handleNameChange} newPhone={newPhone} handlePhoneChange={handlePhoneChange} />
      <h3>Numbers</h3>
      <Persons personsToShow={personToShow} toggleImportanceOf={toggleImportanceOf} />
    </div>
  )
}

export default App;
