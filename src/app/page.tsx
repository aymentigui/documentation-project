import Link from 'next/link'
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold mb-6">Welcome to Code Documentation</h1>
      <Link href="/create">
        <Button>Create New Documentation</Button>
      </Link>
    </div>
  )
}

