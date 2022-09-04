import React from 'react'
import "../style/Model.css"
import Button from '@mui/material/Button';


function Model(props) {

  const calcDaysRemaining = () => {
    const timeNow = Date.now() / 1000
    const secondsRemaining = props.endDate - timeNow
    return Math.max( (secondsRemaining / 60 / 60 / 24).toFixed(0), 0)
  }


  return (
    <div className='model'>
      <p className='model--item'>{props.positionId}</p>
      <p className='model--item'>{props.tokenStaked}</p>
      <p className='model--item'>{props.percentInterest / 100}%</p>
      <p className='model--item'>{calcDaysRemaining()}</p>
      {props.open ? <Button onClick={() => props.withdraw()} variant="contained" size="small">Withdraw</Button> : <span>Closed</span>}
    </div>
  )
}

export default Model