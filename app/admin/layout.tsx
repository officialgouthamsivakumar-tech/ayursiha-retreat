import '../styles/admin.css'
import AdminSidebar from './_components/AdminSidebar'

export const metadata = { title: 'Admin — Ayursiha Retreat' }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="admin-root">
      <AdminSidebar />
      <div className="admin-main">{children}</div>
    </div>
  )
}
