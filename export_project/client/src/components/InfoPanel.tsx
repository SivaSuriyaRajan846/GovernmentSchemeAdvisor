import { cn } from "@/lib/utils";

interface InfoPanelProps {
  className?: string;
}

export function InfoPanel({ className }: InfoPanelProps) {
  return (
    <section className={cn("lg:col-span-12 bg-gradient-to-r from-primary to-accent rounded-lg p-6 text-white shadow-lg mb-6", className)}>
      <div className="flex flex-col md:flex-row items-center justify-between">
        <div className="mb-4 md:mb-0">
          <h2 className="font-bold text-2xl mb-2">Find Government Schemes You're Eligible For</h2>
          <p className="text-white text-opacity-90 max-w-2xl">
            Fill in your details in the form below to discover schemes that match your profile. One simple form, countless opportunities.
          </p>
        </div>
        <img 
          src="https://images.unsplash.com/photo-1586892477838-2b96e85e0f96?auto=format&fit=crop&w=200&h=150" 
          alt="Indian family" 
          className="rounded-lg h-24 w-32 object-cover"
        />
      </div>
    </section>
  );
}
