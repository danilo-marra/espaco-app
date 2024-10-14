export function Agendas() {
  // const { pacientes } = usePacientesContext()

  return (
    <table>
      <thead>
        <tr>
          <th>Nome do Paciente</th>
          <th>Nome do Terapeuta</th>
        </tr>
      </thead>
      {/* <tbody>
        {pacientes.map((paciente) => (
          <tr key={paciente.id}>
            <td className="p-4">{paciente.nomePaciente}</td>
            <td className="p-4">
              {paciente.terapeutaInfo?.nomeTerapeuta || 'Sem Terapeuta'}
            </td>
          </tr>
        ))}
      </tbody> */}
    </table>
  )
}
