import { NavLink, useLocation } from "react-router-dom"
import './Navigation.css';
import { useEffect, useState } from "react";

export function Navigation() {
    const [token, setToken] = useState<string | null>(localStorage.getItem('x-auth-token'));
    const location = useLocation();

    useEffect(() => {
        setToken(localStorage.getItem('x-auth-token'));
    }, [location]);

    return (
        <nav className="nav">
            <NavLink to='/' className='nav-link'>Все котики</NavLink>
            <NavLink to='/favorites' className='nav-link'>Любимые котики</NavLink>
            {!token && (
                <NavLink to="/register" className="nav-link nav-link-right">Регистрация</NavLink>
            )}
        </nav>
    )
}