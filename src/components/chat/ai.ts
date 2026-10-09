
/**
 * Portfolio assistant.
 *
 * Answers are generated locally from Pawan's portfolio content.
 * No backend is required.
 */

export type ChatLink = { label: string; href: string }
export type AIReply = { text: string; links?: ChatLink[] }

const profile = {
  name: "Pawan",
  role: "full-stack developer",
  college: "NIT Kurukshetra",
  course: "Production and Industrial Engineering",
  email: "YOUR_EMAIL@example.com",

  services: [
    [
      "Full-Stack Development",
      "building complete web applications with modern frontend and backend technologies",
    ],
    [
      "Frontend Development",
      "responsive interfaces, interactive components, and polished user experiences",
    ],
    [
      "Backend Development",
      "REST APIs, authentication, server-side logic, and database integration",
    ],
    [
      "Product Development",
      "turning ideas into practical digital products, SaaS platforms, and useful tools",
    ],
  ],

  skills: [
    "HTML",
    "CSS",
    "JavaScript",
    "React",
    "Next.js",
    "Node.js",
    "Express",
    "MongoDB",
    "Mongoose",
    "Tailwind CSS",
    "C",
    "C++",
  ],

  projects: [
    {
      name: "UniLynk",
      type: "Campus Community Platform",
      description:
        "A campus community platform designed to connect students, clubs, and campus activities through posts, events, and community features.",
      href: "/#work",
    },
    {
      name: "DevDomain",
      type: "Lead Management CRM",
      description:
        "A CRM project focused on organizing leads and making lead management easier.",
      href: "/#work",
    },
    {
      name: "Radhakishan Hospital",
      type: "Hospital Website",
      description:
        "A website built for a hospital, with a focus on presenting its information and services clearly.",
      href: "/#work",
    },
    {
      name: "Yubhi Ayurveda",
      type: "Ayurvedic E-commerce Website",
      description:
        "An e-commerce website for Ayurvedic products.",
      href: "/#work",
    },
  ],
}

type Intent = {
  keys: RegExp
  reply: () => AIReply
}

const intents: Intent[] = [
  {
    keys: /\b(hi|hello|hey|salam|yo|good (morning|evening|afternoon))\b/i,
    reply: () => ({
      text: `Hey! I'm ${profile.name}'s portfolio assistant. Ask me about his background, skills, projects, services, or how to get in touch.`,
    }),
  },
  {
    keys: /\b(who|about|yourself|introduce|background|bio|pawan)\b/i,
    reply: () => ({
      text: `${profile.name} is a ${profile.role} and a student at ${profile.college}, studying ${profile.course}. He enjoys building web applications that combine thoughtful design, solid engineering, and practical functionality.`,
      links: [
        { label: "About Me", href: "/#aboutme" },
        { label: "Explore My Work", href: "/#work" },
      ],
    }),
  },
  {
    keys: /\b(service|offer|help with|what can you do|what do you do|work on)\b/i,
    reply: () => ({
      text:
        "Here are the main services Pawan focuses on:\n\n" +
        profile.services
          .map(([title, description]) => `• ${title}: ${description}`)
          .map((service) => service.join(""))
          .join("\n\n"),
      links: [{ label: "View Services", href: "/#services" }],
    }),
  },
  {
    keys: /\b(project|portfolio|work|built|case study|showcase|unilynk|devdomain|radhakishan|yubhi|hospital|crm|campus community|e-commerce)\b/i,
    reply: () => ({
      text:
        "Here are some projects from Pawan's portfolio:\n\n" +
        profile.projects
          .map(
            (project) =>
              `• ${project.name} — ${project.type}\n${project.description}`,
          )
          .join("\n\n"),
      links: [{ label: "Explore My Work", href: "/#work" }],
    }),
  },
  {
    keys: /\b(skill|stack|technology|technologies|tech stack|programming language|tools)\b/i,
    reply: () => ({
      text:
        "Pawan works with a range of frontend and backend technologies, including:\n\n" +
        profile.skills.join(" · ") +
        "\n\nHis projects involve UI development, API integration, authentication, and database-backed applications.",
    }),
  },
  {
    keys: /\b(experience|years|since|how long|career)\b/i,
    reply: () => ({
      text: "Pawan has been developing projects across web development and product building. For specific details about his professional experience, internships, or timeline, please contact him directly.",
      links: [{ label: "Contact Me", href: "/#contact" }],
    }),
  },
  {
    keys: /\b(where|location|based|live|college|university|nit)\b/i,
    reply: () => ({
      text: `Pawan studies at ${profile.college}, where he is pursuing ${profile.course}.`,
    }),
  },
  {
    keys: /\b(unilynk)\b/i,
    reply: () => ({
      text: "UniLynk is Pawan's campus community platform project. It is designed to bring students, clubs, events, and campus conversations together in one place.",
      links: [{ label: "Explore My Work", href: "/#work" }],
    }),
  },
  {
    keys: /\b(devdomain)\b/i,
    reply: () => ({
      text: "DevDomain is Pawan's lead management CRM project, focused on helping organize and manage leads.",
      links: [{ label: "Explore My Work", href: "/#work" }],
    }),
  },
  {
    keys: /\b(radhakishan|hospital website|hospital project)\b/i,
    reply: () => ({
      text: "Radhakishan Hospital is a hospital website project built by Pawan to present the hospital and its services online.",
      links: [{ label: "Explore My Work", href: "/#work" }],
    }),
  },
  {
    keys: /\b(yubhi|ayurveda|e-commerce|ecommerce|online store)\b/i,
    reply: () => ({
      text: "Yubhi Ayurveda is an Ayurvedic e-commerce website project in Pawan's portfolio.",
      links: [{ label: "Explore My Work", href: "/#work" }],
    }),
  },
  {
    keys: /\b(testimonial|client review|feedback|client experience)\b/i,
    reply: () => ({
      text: "Pawan's portfolio is the best place to explore his projects and development work. For feedback from previous clients or collaborators, please check the published testimonials on his website.",
      links: [{ label: "Explore My Work", href: "/#work" }],
    }),
  },
  {
    keys: /\b(price|cost|rate|budget|quote|charge)\b/i,
    reply: () => ({
      text: "Project pricing depends on the scope, features, and technical requirements. Share your idea with Pawan through the contact section to discuss the details.",
      links: [{ label: "Discuss a Project", href: "/#contact" }],
    }),
  },
  {
    keys: /\b(contact|hire|email|reach|available|collab|collaborate|talk|book|work together|work with)\b/i,
    reply: () => ({
      text: "Interested in working with Pawan or discussing an idea? Use the contact section on his portfolio to get in touch.",
      links: [
        { label: "Contact Me", href: "/#contact" },
        { label: "Send an Email", href: `mailto:${profile.email}` },
      ],
    }),
  },
  {
    keys: /\b(blog|thought|article|writing|post|insight)\b/i,
    reply: () => ({
      text: "Pawan's Thoughts section shares ideas around software development, product building, and turning ideas into useful digital experiences.",
      links: [{ label: "Read My Thoughts", href: "/#thoughts" }],
    }),
  },
]

export const suggestions = [
  "Who is Pawan?",
  "Show me your projects",
  "What technologies do you use?",
  "How can I hire you?",
]

export async function askAI(question: string): Promise<AIReply> {
  const q = question.toLowerCase().trim()

  // Simulated latency for the typing indicator.
  await new Promise((resolve) =>
    setTimeout(resolve, 450 + Math.random() * 350),
  )

  // Prioritize specific questions before general questions.
  const ordered = [
    7, 8, 9, 10, 11, 12, 13, 3, 4, 5, 6, 1, 2, 0,
  ].map((index) => intents[index])

  const match = ordered.find((intent) => intent.keys.test(q))

  if (match) return match.reply()

  return {
    text: `I can tell you about Pawan's background, technical skills, services, and projects such as UniLynk and DevDomain. You can also contact him directly to discuss a project or collaboration.`,
    links: [
      { label: "Explore My Work", href: "/#work" },
      { label: "Contact Me", href: "/#contact" },
    ],
  }
}
