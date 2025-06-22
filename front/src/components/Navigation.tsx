import { NavLink } from "react-router-dom"
import './Navigation.css';

export function Navigation() {
    return (
        <nav className="nav">
            <NavLink to='/' className='nav-link'>Все котики</NavLink>
            <NavLink to='/favorite' className='nav-link'>Любимые котики</NavLink>
            <NavLink to='/register' className='nav-link'>Регистрация</NavLink>
        </nav>
    )
}