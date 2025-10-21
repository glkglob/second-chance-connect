import { RegistrationWizard } from "@/components/registration-wizard"
import { SiteHeader } from "@/components/site-header"
import { SiteFooter } from "@/components/site-footer"

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <main className="flex-1 container py-12">
        <RegistrationWizard />
      </main>
      <SiteFooter />
    </div>
  )
}
