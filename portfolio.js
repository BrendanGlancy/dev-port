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
          skillName: "MySQL",
          fontAwesomeClassname: "logos:mysql",
        },
        {
          skillName: "XAMPP",
          fontAwesomeClassname: "logos:xampp",
        },
        {
          skillName: "AWS",
          fontAwesomeClassname: "logos:aws",
        },
        {
          skillName: "spring-boot",
          fontAwesomeClassname: "logos:spring",
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
    role: "Intern",
    company: "CodeMash 2022",
    companylogo: "/img/icons/common/codemash-logo.png",
    date: "January 2022",
    desc: " Top 15 in CTF CodeMash is a unique event that educates developers on current practices, methodologies and technology trends in a variety of platforms and development languages. Attendees will be able to attend a world-class technical conference.",
  },
];

export const projects = [
  {
    name: "Brewery Locator",
    desc: "A web application that allows users to search and review breweries in the United States. Users can search for breweries by name, city, state, or zip code. Users can also add breweries to their favorites list and leave reviews for breweries.",
    github: "https://github.com/BrendanGlancy/BreweryLocater",
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
    name: "University of Akron Security",
    desc: "A website for everything cyber security at University of Akron. The development is student led and is the university's first open source project.",
    github: "https://github.com/avrha/uakronsec",
    tags: ["College", "Cybersecurity", "Open Source"],
  },
];

export const feedbacks = [
  {
    name: "Austin Coontz",
    feedback:
      "I was trying to make a website that is blazingly fast. I had no idea where to start. What did I do? Called my friend Brendan. I had no Idea what i Was doing! He fixed it. Website? Fast. Blazingly. Done.",
  },
];

export const seoData = {
  title: "Brendan's Portfolio",
  description: "Full Stack Developer",
  image: "https://avatars.githubusercontent.com/u/61941978?v=4",
  url: "https://dev-port-lac.vercel.app/",
  keywords: [
    "Brendan",
    "Brendan Glancy",
    "brendanglancy",
    "brendan glancy",
    "Portfolio",
    "Full Stack Developer",
    "Full Stack",
    "Open to work",
    "Developer",
    "Austin Coontz",
    "Brendan Portfolio ",
    "Brendan Glancy Portfolio",
    "web developer",
    "empyrial",
    "Empyrial",
    "ssantoshp/Empyrial",
    "landscaping",
    "LinkedIn",
    "Github",
    "canton",
    "Canton",
    "Ohio",
  ],
};
