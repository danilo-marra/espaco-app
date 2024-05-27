import React, { useState } from 'react'
import {
  List,
  PencilSimple,
  TrashSimple,
  Eye,
  Plus,
} from '@phosphor-icons/react'

export function AgendaTerapeutas() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="flex min-h-screen">
      {/* Botão de Hambúrguer visível em telas menores */}
      <button
        type="button"
        className="fixed top-4 left-4 md:hidden text-gray-500 focus:outline-none z-30"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        <List size={24} weight="bold" />
      </button>
      <aside
        className={`fixed md:static w-64 bg-blue-800 text-white p-6 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 transition-transform duration-300 ease-in-out z-20`}
      >
        <span className="block mb-8 text-2xl font-bold">
          Logo Espaço Dialógico
        </span>
        <ul className="menu space-y-4">
          <li className="hover:text-blue-300 cursor-pointer">Home</li>
          <li className="hover:text-blue-300 cursor-pointer">Faturamento</li>
          <li className="hover:text-blue-300 cursor-pointer">Pacientes</li>
          <li className="hover:text-blue-300 cursor-pointer">Terapeutas</li>
          <li className="hover:text-blue-300 cursor-pointer">Agenda</li>
        </ul>
      </aside>
      <main
        className={`flex-1 bg-gray-100 p-8 transition-all duration-300 ease-in-out ${isMenuOpen ? 'md:ml-64' : 'ml-0'}`}
      >
        <header className="flex items-center justify-between mb-8">
          <div className="searchBar flex items-center space-x-2 bg-white p-2 rounded shadow">
            <span className="text-gray-500">IconeLupa</span>
            <input type="text" placeholder="Buscar" className="outline-none" />
          </div>
          <div className="profile flex items-center space-x-4">
            <div className="fotoPerfil w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
              <span>Imagem Perfil</span>
            </div>
          </div>
        </header>
        <div>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Agenda das Terapeutas</h1>
            <button
              type="button"
              className="flex items-center bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              <Plus size={20} weight="bold" className="mr-2" />
              Novo Registro
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
              <span>Icone Terapeutas</span>
              <span className="text-xl font-semibold">
                Total de Terapeutas Cadastradas
              </span>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
              <span>Icone Pacientes</span>
              <span className="text-xl font-semibold">
                Total de Pacientes Cadastrados
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-white rounded shadow">
              <span>Icone seta esquerda</span>
              <h2 className="text-xl font-semibold">
                Agenda Mês de Fevereiro/2024
              </h2>
              <span>Icone seta direita</span>
            </div>
          </div>
          <table className="listaTerapeutas w-full bg-white rounded shadow">
            <thead className="bg-blue-800 text-white">
              <tr>
                <th className="p-4 text-left">Terapeuta</th>
                <th className="p-4 text-left">Paciente</th>
                <th className="p-4 text-left">Dia da Semana</th>
                <th className="p-4 text-left">Horário</th>
                <th className="p-4 text-left">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="p-4">Juliana</td>
                <td className="p-4">Davi</td>
                <td className="p-4">Segunda</td>
                <td className="p-4">9h30</td>
                <td className="p-4 flex space-x-2">
                  <button className="text-blue-500 hover:text-blue-700">
                    <Eye size={20} weight="bold" />
                  </button>
                  <button className="text-green-500 hover:text-green-700">
                    <PencilSimple size={20} weight="bold" />
                  </button>
                  <button className="text-red-500 hover:text-red-700">
                    <TrashSimple size={20} weight="bold" />
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
