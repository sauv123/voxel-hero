import fs from 'fs';
import path from 'path';

// Comprehensive semantic portfolio content injected into dist/index.html for SEO & AI Crawlers
// Accurately reflects Sauveer Sinha's official CV and selected case studies
const seoContent = `
<noscript>
  <header>
    <h1>Sauveer Sinha — UX & Product Designer • Milan, Italy</h1>
    <p>Product Designer focused on AI-native products, complex workflows, and human-centred systems. Based in Milan, Italy. Crafting scalable experiences across SaaS and consumer products, combining UX strategy, interaction design, and visual direction.</p>
    <p>Contact: <a href="mailto:sauveersinha@gmail.com">sauveersinha@gmail.com</a> | Website: <a href="https://sauveer.com">https://sauveer.com</a> | LinkedIn: <a href="https://www.linkedin.com/in/sauveer">linkedin.com/in/sauveer</a></p>
  </header>

  <main>
    <section>
      <h2>Professional Experience</h2>
      <article>
        <h3>HobbyTribe — Product Designer</h3>
        <p><em>Oct 2023 – Jul 2024 · Mumbai, India</em></p>
        <ul>
          <li>Led end-to-end product design across web and mobile platforms, contributing to 2.5× user growth within 3 months.</li>
          <li>Conducted and synthesized qualitative research with 100+ participants, translating key user insights into product strategy, onboarding flows, discovery algorithms, and engagement loops.</li>
          <li>Partnered directly with the founder, domain experts, and investors to define product direction and communicate design decisions, contributing to a ₹1.2 Cr investment round.</li>
        </ul>
      </article>

      <article>
        <h3>e-tailize — UI/UX Designer (Contract)</h3>
        <p><em>Jul 2023 – Sep 2023 · Mumbai, India</em></p>
        <ul>
          <li>Created a scalable, production-ready UI design system from scratch (design tokens, typography scales, accessibility guidelines, and component libraries) for a B2B SaaS platform.</li>
          <li>Mapped and redesigned complex Product Information Management (PIM) workflows, reducing user friction and contributing to a 12% increase in enterprise-user growth.</li>
        </ul>
      </article>
    </section>

    <section>
      <h2>Selected Case Studies & Design Projects</h2>

      <article>
        <h3><a href="https://sauveer.com/casestudies/trace/index.html">/trace — Live Generative Ethereum Data Visualization</a></h3>
        <p><strong>Recognition:</strong> Selected for STEP Project FuturAbility District, Milano Digital Week 2026.</p>
        <p><strong>Role:</strong> Product & Interaction Designer | <strong>Tags:</strong> UX Research, Interaction Design, Data Visualization, Web3, Generative Systems.</p>
        <p><strong>Overview:</strong> An interactive, sensory installation and web application that translates live Ethereum blockchain mempool activity and transaction throughput into visual and acoustic generative art.</p>
        <p><strong>Design Decisions:</strong> Abstracted intimidating cryptographic hashes into tangible particle physics and organic waveforms, allowing non-technical observers to intuitively comprehend network congestion, gas price fluctuations, and transactional density in real time.</p>
        <p><a href="https://sauveer.com/casestudies/trace/index.html">Read full /trace Case Study &rarr;</a></p>
      </article>

      <article>
        <h3><a href="https://sauveer.com/casestudies/orco/index.html">Redesigning ORCO — Interactive Culinary Experience</a></h3>
        <p><strong>Recognition:</strong> Awarded Best Project at NABA Milan.</p>
        <p><strong>Role:</strong> UX Designer & Strategist | <strong>Tags:</strong> UX Research, Information Architecture, Brand Experience, Web Design.</p>
        <p><strong>Overview:</strong> Comprehensive digital transformation of ORCO, an iconic 100-year-old Italian heritage condiment and culinary brand.</p>
        <p><strong>Design Decisions:</strong> Restructured the product information architecture around ingredient provenance and culinary inspiration. Implemented interactive recipe pairing mechanisms and an editorial storytelling flow that bridged legacy brand heritage with modern e-commerce standards.</p>
        <p><a href="https://sauveer.com/casestudies/orco/index.html">Read full ORCO Case Study &rarr;</a></p>
      </article>

      <article>
        <h3><a href="https://sauveer.com/casestudies/olo/index.html">OLO — Introverted Emotional Co-Housing Platform</a></h3>
        <p><strong>Role:</strong> Product Designer | <strong>Tags:</strong> Emotional Design, User Research, Journey Mapping, Prototyping.</p>
        <p><strong>Overview:</strong> An intergenerational co-housing platform connecting university students with senior homeowners through compatibility matching and mutual value exchange.</p>
        <p><strong>Design Decisions:</strong> Prioritized psychological safety and trust-building over rapid transactions. Formulated low-pressure introductory touchpoints ("small hellos") and transparent lifestyle alignment questionnaires to ease social friction between different generations.</p>
        <p><a href="https://sauveer.com/casestudies/olo/index.html">Read full OLO Case Study &rarr;</a></p>
      </article>

      <article>
        <h3><a href="https://sauveer.com/casestudies/mica/index.html">MICA — Emotionally Intelligent Co-Living Housing</a></h3>
        <p><strong>Role:</strong> Lead UX Designer | <strong>Tags:</strong> UX Design, Co-Living Design, Systems Architecture.</p>
        <p><strong>Overview:</strong> Digital housing system engineered to foster genuine community belonging and minimize roommate friction in high-density urban shared living.</p>
        <p><strong>Design Decisions:</strong> Built intuitive collective chore-delegation tools, proactive shared-space scheduling, and emotional pulse checks that help housemates resolve domestic friction before it escalates.</p>
        <p><a href="https://sauveer.com/casestudies/mica/index.html">Read full MICA Case Study &rarr;</a></p>
      </article>

      <article>
        <h3><a href="https://sauveer.com/casestudies/krizia/index.html">Krizia — Rebranding Luxury Through Structure</a></h3>
        <p><strong>Role:</strong> Brand & Digital Designer | <strong>Tags:</strong> Web Design, Art Direction, Luxury Editorial.</p>
        <p><strong>Overview:</strong> Digital editorial showcase for high-fashion Italian maison Krizia.</p>
        <p><strong>Design Decisions:</strong> Balanced architectural grid discipline with high-fashion whitespace, establishing a brutalist yet sophisticated digital aesthetic fitting luxury heritage.</p>
        <p><a href="https://sauveer.com/casestudies/krizia/index.html">Read full Krizia Case Study &rarr;</a></p>
      </article>
    </section>

    <section>
      <h2>Education & Credentials</h2>
      <ul>
        <li><strong>NABA — Nuova Accademia di Belle Arti (Milan, Italy)</strong>: Master of Arts in User Experience Design (Sep 2024 – Oct 2026 Expected). Focus on service innovation, cognitive systems, human-centered design, and emerging interfaces. Member of AI Academic Integrity Committee. Won 3rd Place — NCA Design Awards.</li>
        <li><strong>Manipal Institute of Technology (Manipal, India)</strong>: Bachelor of Technology in Print & Media Engineering (Jun 2019 – Jun 2023). Focus on color science, visual communication, typography, and production technology.</li>
        <li><strong>Certifications:</strong> Google UX Design Certificate, Google AI Essentials.</li>
      </ul>
    </section>

    <section>
      <h2>Core Skills & Methodologies</h2>
      <p><strong>Core Capabilities:</strong> Product Strategy, Interaction Design, User Research, Information Architecture, Design Systems, Art Direction, Cognitive Psychology, Usability Testing, A/B Testing.</p>
      <p><strong>AI-Native Design:</strong> Conversational UI, UX for LLM Outputs, Autonomous AI Agent Workflows, Generative UI, Creative Prototyping.</p>
      <p><strong>Tools & Technologies:</strong> Figma, Framer, Adobe Creative Cloud, React, GSAP, Three.js, CSS/HTML.</p>
    </section>
  </main>
</noscript>
`;

const indexPath = path.resolve('dist/index.html');

try {
  let html = fs.readFileSync(indexPath, 'utf-8');
  // Inject just before </body>
  html = html.replace('</body>', `${seoContent}\n</body>`);
  fs.writeFileSync(indexPath, html);
  console.log('✅ Comprehensive CV & Case Study SEO content successfully injected into dist/index.html');
} catch (error) {
  console.error('Error injecting SEO content:', error);
}
