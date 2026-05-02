import TopAppBar from '@/components/common/TopAppBar'
import SideNav from '@/components/common/SideNav'
import BottomNav from '@/components/common/BottomNav'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <TopAppBar />
      <SideNav />
      <main className="lg:ml-64 pt-16 pb-20 lg:pb-0 min-h-screen">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
