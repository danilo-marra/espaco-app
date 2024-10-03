export function Agenda() {
  return (
    <div>
      <h1>Agenda</h1>
    </div>
  )
  // return (
  //   <div className="flex min-h-screen">
  //     <main>
  //       <div>
  //         <div className="flex items-center justify-between mb-4">
  //           <h1 className="text-2xl font-bold">Agenda</h1>
  //         </div>
  //         <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
  //           <div className="flex items-center space-x-4 p-4 bg-white rounded shadow ">
  //             <CashRegister size={24} />
  //             <input
  //               className="text-xl w-full  text-gray-800 focus:outline-none"
  //               type="text"
  //               placeholder="Buscar pacientes..."
  //             />
  //           </div>

  //           <div className="flex items-center space-x-1 p-4 bg-white rounded text-green-500 ">
  //             <ArrowCircleUp size={24} weight="fill" />
  //             <span className="text-xl">
  //               Entradas: <span>{priceFormatter.format(summary.entrada)}</span>
  //             </span>
  //           </div>

  //           <div className="flex items-center space-x-1 p-4 bg-white rounded shadow text-red-500 ">
  //             <ArrowCircleDown size={24} weight="fill" />
  //             <span className="text-xl">
  //               Saídas: <span>{priceFormatter.format(summary.saida)}</span>
  //             </span>
  //           </div>

  //           <div
  //             className={`flex items-center space-x-1 p-4 bg-white rounded shadow font-bold ${summary.total >= 0 ? 'text-green-500' : 'text-red-500'}`}
  //           >
  //             <CurrencyDollar size={24} />
  //             <span className="text-xl">
  //               Total: <span>{priceFormatter.format(summary.total)}</span>
  //             </span>
  //           </div>
  //         </div>

  //         <div className="flex items-center justify-between p-4 bg-white rounded shadow">
  //           <button type="button">
  //             <CaretLeft onClick={handleMonthPrev} size={24} weight="fill" />
  //           </button>
  //           <div className="flex items-center space-x-2">
  //             <div>
  //               <h2 className="text-xl font-semibold">
  //                 {format(dataAtual, 'MMMM yyyy', { locale: ptBR })}
  //               </h2>
  //             </div>
  //             <div>
  //               <button type="button">
  //                 <DatePicker
  //                   locale={ptBR}
  //                   selected={dataAtual}
  //                   onChange={(date) => date && setDataAtual(date)}
  //                   renderMonthContent={(
  //                     _month,
  //                     shortMonth,
  //                     longMonth,
  //                     day,
  //                   ) => {
  //                     const fullYear = new Date(day).getFullYear()
  //                     const tooltipText = `${longMonth} de ${fullYear}`
  //                     return <span title={tooltipText}>{shortMonth}</span>
  //                   }}
  //                   showMonthYearPicker
  //                   dateFormat="MMMM yyyy"
  //                   customInput={
  //                     <Calendar size={28} className="text-gray-500 mt-2" />
  //                   }
  //                 />
  //               </button>
  //             </div>
  //           </div>

  //           <button type="button">
  //             <CaretRight onClick={handleMonthNext} size={24} weight="fill" />
  //           </button>
  //         </div>

  //         <table className="listaPacientes w-full bg-white rounded shadow">
  //           <thead className="bg-rosa text-white">
  //             <tr>
  //               <th className="p-4 text-left">Descrição</th>
  //               <th className="p-4 text-left">Valor</th>
  //               <th className="p-4 text-left">Data</th>
  //               <th className="p-4 text-left">Ações</th>
  //             </tr>
  //           </thead>
  //           <tbody>
  //             {transacoesVisiveis.map((transacao) => {
  //               return (
  //                 <tr key={transacao.id}>
  //                   <td className="p-4">{transacao.descricao}</td>

  //                   <td
  //                     className={`p-4 d-flex ${transacao.tipo === 'entrada' ? 'text-green-500' : 'text-red-500'}`}
  //                   >
  //                     {transacao.tipo === 'entrada' ? (
  //                       <div className="flex items-center space-x-1">
  //                         <ArrowCircleUp
  //                           size={24}
  //                           color="rgb(34 197 94)"
  //                           weight="fill"
  //                         />
  //                         <span>{priceFormatter.format(transacao.valor)}</span>
  //                       </div>
  //                     ) : (
  //                       <div className="flex items-center space-x-1">
  //                         <ArrowCircleDown
  //                           size={24}
  //                           color="rgb(239 68 68)"
  //                           weight="fill"
  //                         />
  //                         <span>{priceFormatter.format(transacao.valor)}</span>
  //                       </div>
  //                     )}
  //                   </td>
  //                   <td className="p-4">
  //                     {dateFormatter.format(new Date(transacao.dtCriacao))}
  //                   </td>
  //                   <td className="p-4 flex space-x-2">
  //                     <button
  //                       title="Editar Paciente"
  //                       className="text-green-500 hover:text-green-700"
  //                       type="button"
  //                     >
  //                       <PencilSimple size={20} weight="bold" />
  //                     </button>
  //                     <button
  //                       title="Excluir Paciente"
  //                       className="text-red-500 hover:text-red-700"
  //                       type="button"
  //                     >
  //                       <TrashSimple size={20} weight="bold" />
  //                     </button>
  //                   </td>
  //                 </tr>
  //               )
  //             })}
  //           </tbody>
  //         </table>
  //         <Pagination
  //           currentPage={currentPage}
  //           totalPaginas={totalPaginas}
  //           onPageChange={handlePageChange}
  //         />
  //       </div>
  //     </main>
  //   </div>
  // )
}
