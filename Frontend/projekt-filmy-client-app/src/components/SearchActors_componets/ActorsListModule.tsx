import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Actor } from '../../models/Actor';


interface Props {
  actorsList:Actor[]
}

const ActorsListModule = ({ actorsList }: Props) => {
  return (
    <div className="container d-flex justify-content-center align-items-top p-0">
      <ul className="list-group">
        {actorsList.map((actor) => (
          <li className="list-group-item d-flex align-items-start p-3" style={{ borderBottom: "1px solid #ddd", width: "600px", height: "180px", borderRadius: "15px", marginBottom: "5px"}}>
             <span>{actor.firstName} {actor.lastName}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActorsListModule;