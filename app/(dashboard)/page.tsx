"use client"

import { Button } from "@/components/ui/button"
import { useNewList } from "@/features/accounts/hooks/use-new-list"


export default function Home() {
  const { onOpen } = useNewList();
  
return (
  <div>
    <Button onClick={onOpen}>
      Add an account
    </Button>
  </div>
)
}
