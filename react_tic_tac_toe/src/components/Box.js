import React from 'react'
import './Box.css'

const Box = (props) => {
    return (
        <div id={props.id} className={props.nameClass} 
            onClick={()=>{props.onClick()}}>
            <span className="board-span">{props.value}</span>
        </div>
    )
}

export default Box