import React from 'react'

function DeckEditor(props) {
  return (
    <div className="deck-editor">
      <ul>
        {props.decks.map((item, index) => {
          return <li key={index}>{item.name}</li>
        })}
      </ul>
    </div>
  )
}

export default DeckEditor
