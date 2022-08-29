import React from 'react';
import './search.css'

export const Search = (props) => {
  return (
    <div className="container">
      <div className="row">
        <input className="search" placeholder="Type to search..." value={ props.searchString } type="text" onChange={props.onSearchStringChange}></input>
      </div>
    </div>
  )
}
