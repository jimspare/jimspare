import { createFileRoute } from "@tanstack/react-router";
import { ShaderBackground } from "@/components/ShaderBackground";
import headshot from "@/assets/jim-headshot.png";
import linkedinBadge from "@/assets/linkedin-badge.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Jim Spare | Strategic growth leader." },
      {
        name: "description",
        content:
          "Jim Spare is a strategic transformation leader for AI-era enterprise software businesses.",
      },
      { property: "og:title", content: "Jim Spare | Strategic growth leader." },
      {
        property: "og:description",
        content:
          "Jim Spare is a strategic transformation leader for AI-era enterprise software businesses.",
      },
      { property: "og:type", content: "website" },
      { property: "og:image", content: "/og-image.png" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Jim Spare | Strategic growth leader." },
      {
        name: "twitter:description",
        content:
          "Jim Spare is a strategic transformation leader for AI-era enterprise software businesses.",
      },
      { name: "twitter:image", content: "/og-image.png" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "icon", href: "/favicon.png", type: "image/png" },
      { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <ShaderBackground />
      <main className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-5 pb-16 pt-6 sm:px-8 sm:pt-8 lg:px-12">
        {/* Header */}
        <header className="flex items-center gap-4 sm:gap-6">
          <a
            href="https://www.linkedin.com/in/jimspare/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ fontFamily: "var(--font-display)" }}
            className="whitespace-nowrap text-xl font-extrabold italic tracking-tight text-foreground transition-opacity hover:opacity-80 sm:text-2xl"
          >
            Jim Spare
          </a>
          <div className="h-px flex-1 bg-[var(--border-faint)]" />
        </header>

        {/* Body */}
        <section className="mt-12 grid grid-cols-1 gap-8 sm:mt-16 md:grid-cols-[200px_1fr] md:gap-12 lg:grid-cols-[240px_1fr] lg:gap-16">
          <div className="flex justify-center md:justify-start">
            <img
              src={headshot}
              alt="Portrait of Jim Spare"
              width={240}
              height={240}
              className="h-40 w-40 rounded-full object-cover sm:h-48 sm:w-48 md:h-[200px] md:w-[200px] lg:h-[240px] lg:w-[240px]"
            />
          </div>

          <div
            style={{ fontFamily: "var(--font-body)" }}
            className="max-w-2xl space-y-5 text-[15px] leading-relaxed text-foreground/95 sm:text-base sm:leading-[1.7]"
          >
            <p>
              <a
                href="https://www.linkedin.com/in/jimspare"
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-transparent underline-offset-4 transition hover:decoration-foreground/60"
              >
                Jim Spare
              </a>{" "}
              is a growth-stage technology executive with deep experience leading
              companies through strategic inflection points, transformation, and
              growth. Over the course of his career, he has helped build and scale
              disruptive technology businesses across enterprise software, AI,
              media, data, and emerging technologies.
            </p>
            <p>
              He currently advises and helps build AI-native businesses through his
              work with <strong className="font-semibold text-foreground">A.Team</strong>, and recently served as Chief Product Officer at <strong className="font-semibold text-foreground">IDC</strong>,
              where he led the development of new AI-powered platforms and digital
              products. His work has focused on translating technological change
              into practical business strategy, organizational alignment, and
              commercial growth.
            </p>
            <p>
              Previously, Jim led <strong className="font-semibold text-foreground">Eko</strong> through more than 10x revenue growth and the
              creation of a $250 million joint venture with <strong className="font-semibold text-foreground">Walmart</strong>. Earlier in his
              career, he served as CEO of <strong className="font-semibold text-foreground">Canesta</strong> through its acquisition by
              <strong className="font-semibold text-foreground"> Microsoft</strong>, where its technology later contributed to products
              including Xbox Kinect and HoloLens.
            </p>
            <p>
              Throughout his career, Jim has worked with leading strategic and
              financial partners including <strong className="font-semibold text-foreground">Walmart</strong>, <strong className="font-semibold text-foreground">Microsoft</strong>, <strong className="font-semibold text-foreground">Intel</strong>, <strong className="font-semibold text-foreground">Samsung</strong>, <strong className="font-semibold text-foreground">Sony</strong>,
              <strong className="font-semibold text-foreground"> Honda</strong>, <strong className="font-semibold text-foreground">Sequoia</strong>, <strong className="font-semibold text-foreground">NEA</strong>, <strong className="font-semibold text-foreground">Venrock</strong>, and <strong className="font-semibold text-foreground">The Carlyle Group</strong>. He has also
              served on the boards of companies acquired by organizations including
              <strong className="font-semibold text-foreground"> Morgan Stanley</strong>, <strong className="font-semibold text-foreground">Microsoft</strong>, <strong className="font-semibold text-foreground">Twitter</strong>, and <strong className="font-semibold text-foreground">Foxconn</strong>.
            </p>

            <p>
              With many years of experience in Silicon Valley and now based in New
              York City, Jim holds a BS in Electrical Engineering from NC State and
              an MBA from the Tuck School of Business at Dartmouth.
            </p>

            {/* Footer links — centered under the text column */}
            <div className="flex flex-col items-center justify-center gap-6 pt-10 sm:flex-row sm:gap-10">
              <a
                href="https://www.linkedin.com/in/jimspare"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="transition-opacity hover:opacity-80"
              >
                <img
                  src={linkedinBadge}
                  alt="LinkedIn"
                  className="h-7 w-auto sm:h-[30px]"
                />
              </a>
              <a
                href="https://www.buildacious.com/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ fontFamily: "var(--font-mark)" }}
                className="text-lg uppercase leading-none tracking-[0.06em] text-[oklch(0.92_0_0)] transition-opacity hover:opacity-80 sm:text-[21px]"
              >
                Buildacious
              </a>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
