import type { Service } from "@/entities/service";

import { DeliveryProcess } from "./DeliveryProcess";

/** Service page section 4 (planning/DESIGN.md §9.1): the service's delivery steps plus its maintenance note. */
export function ServiceProcess({ service }: { service: Service }) {
  return (
    <DeliveryProcess eyebrow="Delivery process" title="How we deliver" steps={service.process}>
      {service.maintenance && (
        <div className="mt-16 grid gap-6 border-t border-line pt-10 lg:mt-24 lg:grid-cols-12 lg:gap-8">
          <h3 className="font-display text-heading-md font-semibold lg:col-span-4">Maintenance and after-care</h3>
          <p className="max-w-[65ch] text-body-lg text-ink-muted lg:col-span-7 lg:col-start-6">{service.maintenance}</p>
        </div>
      )}
    </DeliveryProcess>
  );
}
