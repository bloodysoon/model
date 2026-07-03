import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Users } from "lucide-react"

export function Navigation() {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            Model Catalog
          </Link>
          <div className="flex items-center gap-4">
            <Button asChild variant="ghost">
              <Link href="/models">
                <Users className="mr-2 h-4 w-4" />
                Browse Models
              </Link>
            </Button>
            <Button asChild>
              <Link href="/admin/models">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Admin
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
