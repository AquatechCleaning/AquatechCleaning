import Link from "next/link";
import { siteConfig } from "@/config/site";

export function TopBar() {
  return (
    <div className="border-b border-[#d2d5c6] bg-[#02203D] text-[#fbf8e5]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-2 text-xs sm:text-sm">
        <p>{siteConfig.hoursText}</p>
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href={siteConfig.cta.quote}
            className="rounded-full bg-[#f0a935] px-3 py-1 font-semibold text-[#02203D] transition hover:bg-[#dd982d]"
          >
            REQUEST A QUOTE
          </Link>
          <Link href={siteConfig.phoneHref} className="font-medium hover:text-white">
            {siteConfig.phoneDisplay}
          </Link>
          <div className="flex items-center gap-2">
            {siteConfig.socials.map((social) => (
              <Link
                key={social.name}
                href={social.href}
                className="grid h-6 w-6 place-items-center rounded-full border border-[#d2d5c6] text-[11px] font-semibold hover:bg-[#055178]"
                aria-label={social.name}
              >
                {social.shortLabel}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
