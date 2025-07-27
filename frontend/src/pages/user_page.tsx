import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button"

export function UserIntroductionPage() {
  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              Central Customer Management System Storage
            </h1>
            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              Tired of juggling spreadsheets and scattered data? <br />
              CCMSS is your all-in-one platform to store, track, and manage customer records with ease. <br /><br />
              Designed for small and medium businesses, it simplifies your workflow, reduces errors, and gives you real-time access to what matters most — your customers. <br /><br />
              Stop wasting time on outdated systems. Switch to CCMSS and run your business smarter.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button size="lg" className="gap-4">
              <a
                href="/user/login"
              >
                Login In
              </a>
              <MoveRight className="w-4 h-4" />
            </Button>
            <Button size="lg" className="gap-4">
              <a
                href="/user/create-account"
              >
                Create Account
              </a>
              <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

