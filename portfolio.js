import emoji from "react-easy-emoji";

export const greetings = {
  name: "Brendan Glancy",
  title: "Welcome.",
  description:
    "I am Student / Software Developer, learning Full Stack Web Development and Cyber Security. I have experience building Applications with Vanilla JavaScript, React,  Vue,  Node,  Java,  Spring Boot, Python,  Django and some other cool libraries and frameworks.",
  resumeLink: "https://brendanglancy.github.io/Resume/",
};

export const openSource = {
  githubUserName: "brendanglancy",
};

export const contact = {};

export const socialLinks = {
  instagram: "https://www.instagram.com/brendanglance/",
  github: "https://github.com/brendanglancy",
  linkedin: "https://www.linkedin.com/in/brendan-glancy/",
  discord: "https://www.hackerrank.com/Bglance68",
  blog: "https://brendanglancy.github.io/",
};

export const skillsSection = {
  title: "What I do",
  subTitle: "FULL STACK DEVELOPER WHO WANTS TO EXPLORE EVERY TECH STACK",
  skills: [
    emoji(
      "⚡ Develop highly interactive Front end / User Interfaces for your web and mobile applications."
    ),
    emoji("⚡ Progressive Web Applications ( PWA ) in normal and SPA Stacks."),
    emoji(
      "⚡ Cyber Security, HackTheBox Globally Ranked 534, Top 2% in PicoCTF 2022"
    ),
  ],

  softwareSkills: [
    {
      skillName: "python",
      fontAwesomeClassname: "logos:python",
    },
    {
      skillName: "html-5",
      fontAwesomeClassname: "vscode-icons:file-type-html",
    },
    {
      skillName: "css3",
      fontAwesomeClassname: "vscode-icons:file-type-css",
    },
    {
      skillName: "JavaScript",
      fontAwesomeClassname: "logos:javascript",
    },
    {
      skillName: "Java",
      fontAwesomeClassname: "logos:java",
    },
    {
      skillName: "reactjs",
      fontAwesomeClassname: "vscode-icons:file-type-reactjs",
    },
    {
      skillName: "vuejs",
      fontAwesomeClassname: "logos:vue",
    },
    {
      skillName: "nodejs",
      fontAwesomeClassname: "logos:nodejs-icon",
    },
    {
      skillName: "astro",
      fontAwesomeClassname: "vscode-icons:file-type-astro",
    },
    {
      skillName: "c",
      fontAwesomeClassname: "logos:c",
    },
    {
      skillName: "visual-basic",
      fontAwesomeClassname: "vscode-icons:file-type-vb",
    },
    {
      skillName: "Vim",
      fontAwesomeClassname: "logos:vim",
    },
    {
      skillName: "cpp",
      fontAwesomeClassname: "vscode-icons:file-type-cpp",
    },
    {
      skillName: "npm",
      fontAwesomeClassname: "vscode-icons:file-type-npm",
    },
    {
      skillName: "spring-boot",
      fontAwesomeClassname: "logos:spring",
    },
    {
      skillName: "PostgreSQL",
      fontAwesomeClassname: "logos:postgresql",
    },
    {
      skillName: "git",
      fontAwesomeClassname: "logos:git-icon",
    },
    {
      skillName: "php",
      fontAwesomeClassname: "logos:php",
    },
  ],
};

export const SkillBars = [
  {
    Stack: "Programming",
  },
  {
    Stack: "Frontend/Design", //Insert stack or technology you have experience in
  },
  {
    Stack: "Backend",
  },
  {
    Stack: "Security",
  },
];

export const educationInfo = [
  {
    schoolName: "Akron University",
    subHeader: "Bachelor of Science in Computer Science",
    duration: "August 2021 - Present",
    desc: "Programming CIS degree, Current GPA: 3.8",
    descBullets: [
      "The Bachelor of Science in Computer Information Systems (CIS) - Programming degree option allows students to attain knowledge of effective software application development, client/server application development, and database application development and management for businesses.",
    ],
    github: "https://github.com/BrendanGlancy/akron/",
  },
  {
    schoolName: "Tech Elevator",
    subHeader: "Full Stack Web Development",
    duration: "September 2020 - December 2020",
    desc: "Programming Bootcamp to learn Full Stack Web Development",
    descBullets: [
      "  Object-Oriented Programming: Java",
      "  Web Application Development: HTML, CSS, JavaScript, Vue.js, APIs using Spring Boot, Tomcat",
      "  Database Programming: Spring JDBC/DAO, Table Design, SQL, PostgreSQL, E/R diagrams",
    ],
    github: "https://github.com/BrendanGlancy/BreweryLocater",
  },
];

export const experience = [
  {
    role: "Information Technology",
    company: "Chamber of Commerce",
    companylogo: "/img/icons/common/program.svg",
    date: "June 2019 – Present",
    desc: "Attract users to websites with attractive, user-friendly designs and clean code for high-performance operation. Work on multiple high traffic domains, deployed to AWS.",
  },
  {
    role: "Intern",
    company: "CodeMash 2022",
    companylogo: "/img/icons/common/codemash.svg",
    date: "January 2022",
    desc: " Top 15 in CTF CodeMash is a unique event that educates developers on current practices, methodologies and technology trends in a variety of platforms and development languages. Attendees will be able to attend a world-class technical conference.",
  },
];

export const projects = [
  {
    name: "Brewery Locator",
    desc: "A web application that allows users to search and review breweries in the United States. Users can search for breweries by name, city, state, or zip code. Users can also add breweries to their favorites list and leave reviews for breweries.",
    Github: "https://github.com/BrendanGlancy/BreweryLocater",
    tags: ["Java", "VueJS", "PostgreSQL"],
  },
  {
    name: "Empyrial",
    desc: "Contributor on Empyrial, Empyrial is a Python-based open-source quantitative investment library dedicated to financial institutions and retail investors, officially released in March 2021. Already used by thousands of people working in the finance industry, Empyrial aims to become an all-in-one platform for portfolio management, analysis, and optimization.",
    Github: "https://github.com/ssantoshp/Empyrial",
    link: "https://ssantoshp.github.io/Empyrial/",
    tags: ["python", "finace", "machine learning"],
  },
  {
    name: "0xCoontz",
    desc: "Personal Website built with Astro, Svelte, and JavaScript. Collaborated with a fellow Akron University student to build a website for a friend. Contains a blog of writeups for challenges done by the CTF team",
    link: "https://0xcoontz.vercel.app/",
    Github: "https://github.com/Coontz1/0xCoontz",
    tags: ["Astro", "Svelte", "JavaScript"],
  },
  {
    name: "University of Akron Security",
    desc: "A website for everything cyber security at University of Akron. The development is student led and is the university's first open source project.",
    Github: "https://github.com/avrha/uakronsec",
    tags: ["College", "Cybersecurity", "Open Source"],
  },
];

export const feedbacks = [
  {
    name: "Joey Ferenchak",
    feedback:
      "I collaborated with Brendan on the University of Akron's first open source project UakronSec, I was very pleased with the design we were able to implement. Brendan was very professional and was able to work with me to get the project done on time.",
  },
  {
    name: "Austin Coontz",
    feedback:
      "Brendan and I worked closely together in the development of my own personal website and I can say that he is a very talented developer. He is very knowledgeable in many different languages and frameworks and is able to work with a variety of different people. I would highly recommend Brendan for any development work.",
  },
];
