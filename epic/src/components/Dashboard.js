import React from 'react'
import {Link} from 'react-router-dom'

function Dashboard(props) {
  return (
    <div className="dashboard">
      <Link to="/deck-editor">
        <div>Deck Editor</div>
      </Link>
      <div>Play</div>
    </div>
  )
}

export default Dashboard
