import { Outlet } from 'react-router-dom'
import { Menu } from '../components/Menu'

export function DefaultLayout() {
  return (
    <div className="flex min-h-screen">
      <Menu />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  )
}
