'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import SectionHeader from '@/components/SectionHeader';
import GalleryGrid from '@/components/GalleryGrid';
import portfolioData from '@/data/portfolio-data.json';

/* ──────────────────────── DATA ──────────────────────── */

const SELECTED_CLIENTS = [
  'Harvard Medical School', 'American Council for International Studies',
  'Wentworth Institute of Technology', 'ToolsGroup', 'Teradiode', 'Nedap',
  'Compass Group', 'Morrison Living', 'Unidine', 'Strategic Dining Services',
  'CCL Hospitality Group',
];

const SKILLSET = [
  'Content management', 'Organization structuring', 'Artificial intelligence',
  'Writing', 'Marketing automation', 'CRM systems and lead lifecycle optimization',
  'Sales enablement and pitch development', 'Thought leadership and executive branding',
  'Campaign performance tracking and reporting', 'Brand strategy and visual identity systems',
  'UX design and user experience testing', 'Web design and CMS management',
  'Creative direction', 'Paid media campaign management', 'Industrial design',
  'Product design', 'Graphic design', 'SEO (Search Engine Optimization)',
  'SEM (Search Engine Marketing)', 'Data analytics', 'Event organization',
  'Animation', 'Video editing', 'Video directing',
  'Cross-functional team collaboration', 'Editorial planning and content strategy',
  'B2B marketing and demand generation', 'Internal communications and culture marketing',
];

const CODING_PROJECTS = [
  { title: 'Ordinals Game Site', url: 'https://ordinal.thejake.design/', description: 'Interactive web-based ordinals experience', tech: ['Web', 'Interactive'] },
  { title: 'Gemeos Game Site', url: 'https://gemeos.thejake.design/', description: 'Gemeos gaming experience', tech: ['Web', 'Game'] },
  { title: 'Pokemon Game Site', url: 'https://24.thejake.design/poke/', description: 'Pokemon-themed interactive game', tech: ['Web', 'Game'] },
];

/* ──────────────────────── HELPERS ──────────────────────── */

function getSection(slug: string) {
  return portfolioData.sections.find((s) => s.slug === slug);
}

const sectionVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 1, 0.5, 1] as const } },
};

const staggerContainer = {
  visible: { transition: { staggerChildren: 0.08 } },
};

const staggerItem = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

/* ──────────────────────── PAGE ──────────────────────── */

export default function HomePage() {
  const aboutSection = getSection('about');
  const graphicSection = getSection('graphic-design');
  const animationSection = getSection('animation');
  const photographySection = getSection('photography');
  const codingSection = getSection('coding');
  const profileImage = aboutSection?.items.find((i) => i.type === 'image');

  return (
    <>
      {/* ═══════ HERO ═══════ */}
      <section id="hero" className="min-h-screen flex flex-col items-center justify-center px-6 pt-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
          className="text-center max-w-4xl"
        >
          <motion.h1
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.2 }}
            className="text-7xl md:text-9xl font-bold tracking-tighter mb-6 px-2"
          >
            <span className="bg-gradient-to-r from-[#79a5c8] via-[#e9eef4] to-[#79a5c8] bg-clip-text text-transparent">
              Jake
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#e65c4f] via-[#79a5c8] to-[#e9eef4] bg-clip-text text-transparent">
              Vallante
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-xl md:text-2xl text-[#79a5c8]/60 font-light tracking-wide mb-16"
          >
            A millennial that baby boomers like
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1, duration: 0.6 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { id: 'graphic-design', label: 'Graphic Design', icon: '✦' },
              { id: 'animation', label: 'Animation & Video', icon: '▶' },
              { id: 'photography', label: 'Photography', icon: '◉' },
              { id: 'coding', label: 'Coding', icon: '⟨/⟩' },
            ].map((s, i) => (
              <motion.button
                key={s.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 + i * 0.1, duration: 0.5 }}
                onClick={() => document.getElementById(s.id)?.scrollIntoView({ behavior: 'smooth' })}
                data-cursor-label={s.label}
                className="group p-6 rounded-2xl glass-dark hover:bg-white/10 transition-all duration-500 hover:shadow-[0_8px_30px_rgba(121,165,200,0.1)] hover:border-[#79a5c8]/25"
              >
                <div className="text-3xl mb-3 opacity-30 group-hover:opacity-80 transition-opacity text-[#79a5c8]">
                  {s.icon}
                </div>
                <div className="text-sm font-medium text-[#79a5c8]/50 group-hover:text-[#e9eef4] transition-colors">
                  {s.label}
                </div>
              </motion.button>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.8, duration: 0.8 }}
          className="mt-auto pb-8"
        >
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            className="text-[#79a5c8]/30 text-sm tracking-widest uppercase"
          >
            ↓ Scroll to explore
          </motion.div>
        </motion.div>
      </section>

      {/* ═══════ ABOUT ═══════ */}
      <section id="about" className="section-card py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <SectionHeader title="About" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {profileImage && (
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.2 }}
                className="md:col-span-1"
              >
                <div className="rounded-full overflow-hidden">
                  <Image src={profileImage.url} alt="Jake Vallante" width={400} height={400}
                    className="w-full h-auto object-cover" unoptimized />
                </div>
              </motion.div>
            )}

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className={profileImage ? 'md:col-span-2' : 'md:col-span-3'}
            >
              <div className="space-y-5 text-[#326789]/70 leading-relaxed text-lg">
                <p>
                  I&apos;m a marketer, designer, and photographer based out of Boston. With more than 18 years of branding and marketing experience, I&apos;ve led initiatives across nearly every discipline—augmenting creative vision with strategic execution.
                </p>
                <p>
                  I strive to craft elegant solutions to complex problems. For every company there is always an opportunity to design a meaningful experience that will change people&apos;s lives for the better. The experiences I work to create are the kind that take people on a journey to tell the story of a brand. This type of experiential branding reaches out and grabs you because it&apos;s strategically on target yet unexpected at the same time.
                </p>
                <p>
                  I recently exhibited work at the Metropolitan Museum of Art in New York and my presentations are featured in Harvard Medical School post-doctorate programs.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Clients */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="mt-16"
          >
            <h3 className="text-2xl font-bold text-[#326789] mb-6">Selected Clients</h3>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="grid grid-cols-2 md:grid-cols-3 gap-3"
            >
              {SELECTED_CLIENTS.map((client) => (
                <motion.div key={client} variants={staggerItem}
                  className="text-[#326789]/60 text-sm py-3 px-5 rounded-xl bg-[#e9eef4]/60 border border-[#326789]/6"
                >
                  {client}
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Skills */}
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
            className="mt-12"
          >
            <h3 className="text-2xl font-bold text-[#326789] mb-6">Skillset</h3>
            <motion.div variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true }}
              className="flex flex-wrap gap-2"
            >
              {SKILLSET.map((skill) => (
                <motion.span key={skill} variants={staggerItem}
                  className="text-xs px-3 py-1.5 rounded-full bg-[#326789]/8 text-[#326789] border border-[#326789]/10"
                >
                  {skill}
                </motion.span>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ GRAPHIC DESIGN ═══════ */}
      {graphicSection && (
        <section id="graphic-design" className="section-card py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <SectionHeader title="Graphic Design"
              subtitle={`${graphicSection.items.filter(i => i.type === 'image').length} works`} />
            <GalleryGrid items={graphicSection.items} columns={3} />
          </div>
        </section>
      )}

      {/* ═══════ ANIMATION ═══════ */}
      {animationSection && (
        <section id="animation" className="section-card py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <SectionHeader title="Animation & Video"
              subtitle={`${animationSection.items.filter(i => i.type === 'video-embed').length} videos`} />
            <GalleryGrid items={animationSection.items} />
          </div>
        </section>
      )}

      {/* ═══════ PHOTOGRAPHY ═══════ */}
      {photographySection && (
        <section id="photography" className="section-card py-24 px-6">
          <div className="max-w-7xl mx-auto">
            <SectionHeader title="Photography"
              subtitle={`${photographySection.items.filter(i => i.type === 'image').length} photographs`} />
            <GalleryGrid items={photographySection.items} columns={3} />
          </div>
        </section>
      )}

      {/* ═══════ CODING ═══════ */}
      <section id="coding" className="section-card py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <SectionHeader title="Coding" subtitle="Interactive web projects & experiments" />

          <motion.div variants={staggerContainer} initial="hidden" whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {CODING_PROJECTS.map((project) => (
              <motion.a
                key={project.title}
                variants={staggerItem}
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor-label="Visit ↗"
                className="group block p-8 rounded-2xl bg-[#e9eef4]/50 border border-[#326789]/6 hover:bg-white hover:shadow-[0_12px_40px_rgba(50,103,137,0.08)] hover:border-[#326789]/15 transition-all duration-500"
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-semibold text-[#326789] group-hover:text-[#e65c4f] transition-colors">
                    {project.title}
                  </h3>
                  <span className="text-[#326789]/20 group-hover:text-[#e65c4f] transition-colors text-lg">↗</span>
                </div>
                <p className="text-[#326789]/40 text-sm mb-6">{project.description}</p>
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((t) => (
                    <span key={t} className="text-xs px-3 py-1 rounded-full bg-[#326789]/5 text-[#326789]/50 border border-[#326789]/8">
                      {t}
                    </span>
                  ))}
                </div>
              </motion.a>
            ))}
          </motion.div>

          {codingSection && codingSection.items.filter(i => i.type === 'image').length > 0 && (
            <div className="mt-16">
              <h3 className="text-xl font-bold text-[#326789]/80 mb-8">Project Screenshots</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {codingSection.items.filter(i => i.type === 'image').map((item, index) => (
                  <motion.div key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="rounded-2xl overflow-hidden border border-[#326789]/8 shadow-sm"
                  >
                    <img src={item.url} alt={item.alt} className="w-full h-auto" loading="lazy" />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════ CONTACT ═══════ */}
      <section id="contact" className="section-card py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <SectionHeader title="Get in Touch" accent />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-8"
          >
            <p className="text-[#326789]/50 text-lg mb-8">
              Interested in working together? Let&apos;s chat.
            </p>

            <a
              href="mailto:JMVallante@gmail.com"
              data-cursor-label="Send email"
              className="inline-flex items-center gap-3 text-2xl md:text-3xl font-semibold text-[#326789] hover:text-[#e65c4f] transition-colors duration-300 group"
            >
              <span className="inline-block w-3 h-3 rounded-full bg-[#e65c4f] group-hover:scale-125 transition-transform" />
              JMVallante@gmail.com
            </a>
          </motion.div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="py-10 border-t border-[#326789]/5 bg-white">
        <div className="max-w-7xl mx-auto px-6 text-center text-[#326789]/30 text-sm">
          © {new Date().getFullYear()} Jake Vallante. All rights reserved.
        </div>
      </footer>
    </>
  );
}
