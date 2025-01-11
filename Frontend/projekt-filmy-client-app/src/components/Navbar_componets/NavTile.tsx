import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom';

interface Props {
    children?: string;
    link: string
    tileStyle?: string;
}

const NavTile = ({ children, link, tileStyle = "btn-outline-light" }: Props) => {
    return (
      <Link
        to={link}
        className={
          "btn " +
          tileStyle +
          " d-flex align-items-center justify-content-center text-decoration-none rounded-4 w-100 h-100 m-1 jersey-15-regular"
        }
      >
        {children}
      </Link>
    );
};

export default NavTile