import React from 'react'
import "./App.css"

function Model(props) {
  return (
    <div className='model'>
      <p>percentInterest: {props.percentInterest / 100}%</p>
      <p>positionId: {props.positionId}</p>
      <p>tokenInterest: {props.tokenInterest/(10**14)}</p>
      <p>tokenStaked: {props.tokenStaked/(10**14)}</p>
      <p>position: {props.open ? "Open" : "Closed"}</p>
      {props.open ? <button onClick={() => props.withdraw()}>Withdraw</button> : <span>Closed</span>}
    </div>
  )
}

export default Model