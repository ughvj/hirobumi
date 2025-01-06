import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
      <div className="text-center">
        <Button asChild>
          <Link href="/timeline">表示</Link>
        </Button>
      </div>
    </main>
  );
}
