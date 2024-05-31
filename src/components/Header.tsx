import { MagnifyingGlass } from '@phosphor-icons/react'

export function Header() {
  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-2 bg-white p-2 rounded shadow md:w-full">
        <MagnifyingGlass />
        <input type="text" placeholder="Buscar" className="outline-none" />
      </div>
      <div className="profile flex items-center space-x-4">
        <div className="fotoPerfil ">
          <img
            className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center"
            src="https://github.com/danilo-marra.png"
            alt=""
          />
        </div>
      </div>
    </header>
  )
}
