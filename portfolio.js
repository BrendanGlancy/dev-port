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
  url: 'https://www.ovsknife.com/home',
  instagram: "https://www.instagram.com/brendanglance/",
  github: "https://github.com/brendanglancy",
  linkedin: "https://www.linkedin.com/in/brendan-glancy/",
  discord: "https://www.hackerrank.com/Bglance68",
  blog: "https://brendanglancy.github.io/",
};

export const skillsSection = {
  title: "What I do",
  subTitle: "CRAZY FULL STACK DEVELOPER WHO WANTS TO EXPLORE EVERY TECH STACK",
  data: [
    {
      title: "Full Stack Development",
      lottieAnimationFile: "/lottie/webdev.json", // Path of Lottie Animation JSON File
      skills: [
        emoji(
          "⚡ Develop highly interactive Front end / User Interfaces for your web and mobile applications."
        ),
        emoji(
          "⚡ Progressive Web Applications ( PWA ) in normal and SPA Stacks."
        ),
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
          skillName: "npm",
          fontAwesomeClassname: "logos:npm-icon",
        },
        {
          skillName: "cpp",
          fontAwesomeClassname: "logos:c-plusplus",
        },
        {
          skillName: "php",
          fontAwesomeClassname: "logos:php",
        },
        {
          skillName: "yarn",
          fontAwesomeClassname: "logos:yarn",
        },
        {
          skillName: "PostgreSQL",
          fontAwesomeClassname: "logos:postgresql",
        },
        {
          skillName: "MySQL-icon",
          fontAwesomeClassname: "logos:mysql-icon",
        },
        {
          skillName: "Vercel",
          fontAwesomeClassname: "logos:vercel-icon",
        },
        {
          skillName: "NextJS",
          fontAwesomeClassname: "logos:nextjs-icon",
        },
        {
          skillName: "MongoDB",
          fontAwesomeClassname: "logos:mongodb-icon",
        },
        {
          skillName: "Django",
          fontAwesomeClassname: "logos:django-icon",
        },
        {
          skillName: "spring-boot",
          fontAwesomeClassname: "logos:spring-icon",
        },
      ],
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
    grade: "3.8 GPA",
    desc: "Programming CIS degree",
    descBullets: [
      "The Bachelor of Science in Computer Information Systems (CIS) - Programming degree option allows students to attain knowledge of effective software application development, client/server application development, and database application development and management for businesses.",
      "The CIS - Programming degree option is designed to prepare students for careers in the field of software engineering and development.",
    ],
    github: "https://github.com/BrendanGlancy/akron/",
  },
  {
    schoolName: "Tech Elevator",
    subHeader: "Full Stack Development",
    duration: "September 2020 - December 2020",
    desc: "Programming Bootcamp to learn Full Stack Development",
    descBullets: [
      "  Object-Oriented Programming: Java",
      "  Web Application Development: HTML, CSS, JavaScript, Vue.js, APIs using Spring Boot, Tomcat",
      "  Database Programming: Spring JDBC/DAO, Table Design, SQL, PostgreSQL, E/R diagrams",
      "  Completed 1000+ hours of Java, Spring, SQL, and JavaScript training",
      "  Completed 100+ hours of pair programming on group projects",
    ],
    github: "https://github.com/BrendanGlancy/BreweryLocater",
  },
];

export const experience = [
  {
    role: "Information Technology",
    company: "Chamber of Commerce",
    companylogo: "/img/icons/common/chamber.jpeg",
    date: "June 2019 – Present",
    desc: "Communicate with managers to set up computers used on in the office, Assess and troubleshoot computer problems brought by managers, faculty a. Maintain upkeep of computers, servers, and 20+ websites used by the Chamber and local businesses",
  },
  {
    role: "Software Developer Intern",
    company: "OVS Knife Co.",
    companylogo: "/img/icons/common/ovs.png",
    date: "December 2022",
    descBullets: [
      "  As a Software Developer Intern at OVS Knife Co, I am responsible for the development and maintenance of the company's web application. Utilizing my skills in Next.js, React, MongoDB, Node.js, Django, and Express.js.",
      "  I work independently to implement new features, improve the overall user experience and make sure the platform is reliable and fast for our customers.",
    ],
  },
];

export const projects = [
  {
    name: "Ronis Hair Forum",
    desc: "Custom website for a local hair salon",
    link: "https://ronishair.com/",
    tags: ["Java", "VueJS", "PostgreSQL"],
  },
  {
    name: "Empyrial",
    desc: "Contributor on Empyrial, Empyrial is a Python-based open-source quantitative investment library dedicated to financial institutions and retail investors, officially released in March 2021. Already used by thousands of people working in the finance industry, Empyrial aims to become an all-in-one platform for portfolio management, analysis, and optimization.",
    github: "https://github.com/ssantoshp/Empyrial",
    link: "https://ssantoshp.github.io/Empyrial/",
    tags: ["python", "finace", "machine learning"],
  },
  {
    name: "Coontz-Web",
    desc: "Personal Website built with Astro, Svelte, and JavaScript. Collaborated with a fellow Akron University student to build a website for a friend. Contains a blog of writeups for challenges done by the CTF team",
    github: "https://github.com/Coontz1/myWebsite",
    link: "https://austin-coontz.vercel.app/",
    tags: ["Astro", "TypeScript", "JavaScript"],
  },
  {
    name: "OVS Knife Co.",
    desc: "As a Software Developer Intern at OVS Knife Co, I am responsible for the development and maintenance of the company's web application. Utilizing my skills in Next.js, React, MongoDB, Node.js, Django, and Express.js, I work independently to implement new features, improve the overall user experience and make sure the platform is reliable and fast for our customers.",
    link: "https://ovsknife.com/home",
    tags: ["Intern", "Full Stack", "E-Commerce"],
  },
];

export const feedbacks = [
  {
    name: "Austin Coontz",
    feedback:
      "I was trying to make a website that is blazingly fast. I had no idea where to start. What did I do? Called my friend Brendan. I had no Idea what i Was doing! He fixed it. Website? Fast. Blazingly. Done.",
  },
  {
    name: "Andrew Rose",
    feedback:
      "Brendan Glancy, the website developer I worked with was exceptional. He took the time to understand my needs and goals, and created a website that not only met, but exceeded my expectations. Their communication was clear and timely throughout the process, and I would highly recommend them to anyone in need of an exceptional website.",
  },
];

export const seoData = {
  title: "Brendan's Portfolio",
  description: "Full Stack Developer showcasing my work and experience.",
  image: "https://avatars.githubusercontent.com/u/61941978?v=4",
  url: "https://brendanglancy.software/",
  keywords: [
    "Brendan Glancy",
    "Portfolio",
    "Full Stack Developer",
    "Open to work",
    "Ronis Hair Forum",
    "Developer",
    "web developer",
    "Empyrial",
    "OVS Grinding",
    "OVS Knife Co.",
    "Canton Regional Chamber of Commerce",
    "Akron",
    "Ohio",
  ],
};
