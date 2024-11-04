import {
  Calendar,
  CaretLeft,
  CaretRight,
  Plus,
  User,
} from '@phosphor-icons/react'
import DatePicker from 'react-datepicker'

export function Agendas() {
  return (
    <div className="flex min-h-screen">
      <main className="flex-1 bg-gray-100 p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold">Terapeutas</h1>
          <button
            type="button"
            className="flex items-center bg-azul text-white px-4 py-2 rounded hover:bg-sky-600"
          >
            <Plus size={20} weight="bold" className="mr-2" />
            Nova Agenda
          </button>
        </div>
        {/* Filters and Summary */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4 mb-8">
          <div className="flex items-center space-x-4 p-4 bg-white rounded shadow">
            <User size={24} />
            <label htmlFor="terapeutas" className="text-xl font-semibold">
              Terapeuta:
            </label>
            <select id="terapeutas" className="text-xl">
              <option value="Todos">Todos</option>
              <option>Terapeuta 01</option>
            </select>
          </div>
        </div>
        {/* Date Navigation */}
        <div className="flex items-center justify-between p-4 bg-white rounded shadow mb-4">
          <button type="button" aria-label="Previous month">
            <CaretLeft size={24} weight="fill" />
          </button>
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-semibold">Janeiro 2021</h2>
            <DatePicker
              showMonthYearPicker
              dateFormat="MMMM yyyy"
              customInput={
                <button type="button" aria-label="Select month and year">
                  <Calendar size={28} className="text-gray-500 mt-2" />
                </button>
              }
            />
          </div>
          <button type="button" aria-label="Next month">
            <CaretRight size={24} weight="fill" />
          </button>
        </div>
        {/* Calendar */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold">Segunda-feira</h2>
          </div>
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold">Terça-feira</h2>
          </div>
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold">Quarta-feira</h2>
          </div>
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold">Quinta-feira</h2>
          </div>
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold">Sexta-feira</h2>
          </div>
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold">Sábado</h2>
          </div>
          <div className="bg-white rounded shadow p-4">
            <h2 className="text-xl font-semibold">Domingo</h2>
          </div>
        </div> */}
        <div className="grid grid-cols-7 gap-4">
          {/* Header row with weekday names */}
          {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day) => (
            <div key={day} className="text-center font-semibold p-2">
              {day}
            </div>
          ))}

          {/* Calendar days */}
          {Array.from({ length: 35 }, (_, i) => (
            <div
              key={i}
              className="bg-white rounded-lg shadow p-2 min-h-[120px] hover:bg-gray-50 cursor-pointer"
            >
              <div className="font-medium text-gray-700 mb-2">{i + 1}</div>
              <div className="space-y-1">
                <div className="text-sm bg-blue-100 text-blue-800 p-1 rounded">
                  09:00 - Consulta
                </div>
                <div className="text-sm bg-green-100 text-green-800 p-1 rounded">
                  14:30 - Terapia
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
