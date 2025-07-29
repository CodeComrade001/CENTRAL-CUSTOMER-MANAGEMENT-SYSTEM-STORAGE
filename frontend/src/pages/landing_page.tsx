import { MoveRight } from "lucide-react";
import { Button } from "@/components/ui/button"

export function LandingPageIntroductionPage() {
  return (
    <div className="w-full">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-4xl font-bold tracking-tight text-center">
              Take Control of Your Customer Data — The Smart Way
            </h1>
            <p className="mt-6 text-lg md:text-xl text-muted-foreground max-w-3xl text-center mx-auto">
              Welcome to <strong>Central Customer Management System Storage (CCMSS)</strong> — the ultimate solution for businesses tired of disorganized spreadsheets, lost records, and clunky tools.
              <br /><br />
              Whether you run a growing business or manage multiple clients, CCMSS helps you <strong>store, organize, and access customer data securely</strong> — all in one place.
              <br /><br />
              No more confusion. No more delays. Just a fast, reliable system that scales with you.
              <br /><br />
              <span className="text-primary font-semibold">Start making smarter decisions with CCMSS — your data, your control, your growth.</span>
            </p>

          </div>
          <div className="flex flex-row gap-3">
            <Button size="lg" className="gap-4">
              <a
                href="/admin/login"

              >
                Admin
              </a>
              <MoveRight className="w-4 h-4" />
            </Button>


            <Button size="lg" className="gap-4">
              <a
                href="/user"
              >
                User
              </a>
              <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

