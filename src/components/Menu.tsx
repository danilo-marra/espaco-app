import {
  CalendarBlank,
  House,
  List,
  Money,
  Person,
  UsersThree,
} from '@phosphor-icons/react'
import { NavLink } from 'react-router-dom'
import { useState } from 'react'
import Logo from '../assets/img/logo.png'

export function Menu() {
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)
  return (
    <div>
      <button
        type="button"
        className="fixed top-5 left-5 md:hidden text-gray-500 focus:outline-none z-30"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <List size={24} weight="bold" />
      </button>
      <aside
        className={`fixed md:static h-full w-64 bg-azul text-white p-6 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-20`}
      >
        <img src={Logo} alt="Logo Espaço Dialógico" />
        <span className="block mb-8 text-2xl font-bold">Espaço Dialógico</span>
        <ul className="menu space-y-4">
          <li className="hover:text-blue-300 cursor-pointer flex items-center space-x-2">
            <House weight="fill" size={24} />
            <NavLink to={'/'}>Home</NavLink>
          </li>
          <hr />
          <li className="hover:text-blue-300 cursor-pointer flex items-center space-x-2">
            <CalendarBlank size={24} />
            <NavLink to={'/agenda'}>Agenda</NavLink>
          </li>
          <hr />
          <li className="hover:text-blue-300 cursor-pointer flex items-center space-x-2">
            <Money size={24} />
            <NavLink to={'/financeiro'}>Financeiro</NavLink>
          </li>
          <hr />
          <li className="hover:text-blue-300 cursor-pointer flex items-center space-x-2">
            <Person size={24} />
            <NavLink to={'/pacientes'}>Pacientes</NavLink>
          </li>
          <hr />
          <li className="hover:text-blue-300 cursor-pointer flex items-center space-x-2">
            <CalendarBlank size={24} />
            <NavLink to={'/sessoes'}>Sessões</NavLink>
          </li>
          <hr />
          <li className="hover:text-blue-300 cursor-pointer flex items-center space-x-2">
            <UsersThree size={24} />
            <NavLink to={'/terapeutas'}>Terapeutas</NavLink>
          </li>
          <hr />
        </ul>
      </aside>
    </div>
  )
}
