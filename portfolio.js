import emoji from "react-easy-emoji";

export const greetings = {
	name: "Brendan Glancy",
	title: "Hello there, I'm Brendan",
	description:
		"Developer, learning Full Stack Web Development and Cyber Security. I have experience building Web applications with JavaScript / React / Vue / Node / Java / Spring Boot / Python / Django and some other cool libraries and frameworks.",
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
};

export const skillsSection = {
	title: "What I do",
	subTitle:
		"FULL STACK DEVELOPER WHO WANTS TO EXPLORE EVERY TECH STACK",
	skills: [
		emoji(
			"⚡ Develop highly interactive Front end / User Interfaces for your web and mobile applications."
		),
		emoji(
			"⚡ Progressive Web Applications ( PWA ) in normal and SPA Stacks."
		),
		emoji(
			"⚡ Cyber Security, skilled in scripting for hacking, reverse engineering, and web exploitation."
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
			skillName: "typescript",
			fontAwesomeClassname: "logos:typescript-icon",
		},
		{
			skillName: "nodejs",
			fontAwesomeClassname: "logos:nodejs-icon",
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
			skillName: "swift",
			fontAwesomeClassname: "vscode-icons:file-type-swift",
		},
		{
			skillName: "cpp",
			fontAwesomeClassname: "vscode-icons:file-type-cpp",
		},
		{
			skillName: "go",
			fontAwesomeClassname: "logos:go",
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
			skillName: 'aws',
			fontAwesomeClassname: "logos:aws",
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
		progressPercentage: "90",
	},
	{
		Stack: "Frontend/Design", //Insert stack or technology you have experience in
		progressPercentage: "85", //Insert relative proficiency in percentage
	},
	{
		Stack: "Backend",
		progressPercentage: "80",
	},
	{
		Stack: "Security",
		progressPercentage: "75",
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
		github: "https://github.com/BrendanGlancy/akron/tree/master/logic-programming",
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
		role: "Web Developer",
		company: "Chamber of Commerce",
		companylogo: "/img/icons/common/program.svg",
		date: "June 2019 – Present",
		desc: "Attract users to websites with attractive, user-friendly designs and clean code for high-performance operation. Work on multiple high traffic domains, deployed to AWS.",
	},
	{
		role: "CTO",
		company: "KissLandscaping",
		companylogo: "/img/icons/common/svg-6.svg",
		date: "june 2020 – present",
		desc: "Developed and maintain website, cyber-security, design, marketing, anything tech related.",
    },
	{
		role: "Akron CTF Team",
		company: "Akron University",
		companylogo: "/img/icons/common/hacker.svg",
		date: "August 2021 – present",
		desc: "Pen tester for CTF and CDCC club, find and exploit vunerablities in web, stego, crypto, reverse engineering. 23 out of 300+ teams in National Ohio State hacking competition.",
	},
	{
		role: "Intern",
		company: "CodeMash 2022",
		companylogo: "/img/icons/common/codemash.svg",
		date: "January 2022",
		desc: " Top 15 in CTF CodeMash is a unique event that educates developers on current practices, methodologies and technology trends in a variety of platforms and development languages. Attendees will be able to attend a world-class technical conference.",
	},
];

export const English = [
	{
		title: "Defintion of Good Writing",
		class: "English Composition I",
		companylogo: "/img/icons/common/goodwriting.svg",
		datewritten: "Fall Semester 2021",
		desc: "The Big Short details a small group of insiders who predicted the crash and clarifies how they saw what the investment banks, rating agencies, and the government overlooked; through humor and emotion, Lewis takes us through the complex events leading up to this meltdown.",
		github: "https://github.com/BrendanGlancy/dev-port/blob/master/public/eng_port/Definition%20of%20good%20writing_.pdf",
	},
	{
		title: "Documentry Short Response",
		class: "English Composition I",
		companylogo: "/img/icons/common/documentry.svg",
		datewritten: "Fall Semester 2021",
		desc: "Through their quick thinking and effective strategizing, Carville and Stephanopoulos helped Bill Clinton win his Presidential campaign and are painted as the film’s heroes.",
		github: "https://github.com/BrendanGlancy/dev-port/blob/master/public/eng_port/Documentary%20Short%20Response.pdf",
	},
	{
		title: "Glass Castle",
		class: "English Composition I",
		companylogo: "/img/icons/common/glasscastle.svg",
		datewritten: "Fall Semester 2021",
		desc: "Jeanette’s maturing voice in the Glass Castle plays a considerable role in how readers perceive events in the book. This maturing voice adds depth to Jeanette’s character, making the book more engaging;  the story would have been monotone written from the present, recalling her childhood.",
		github: "https://github.com/BrendanGlancy/dev-port/blob/master/public/eng_port/Glass_Castle_Essay-revised.pdf",
	},
];

export const projects = [
	{
		name: "Kiss Landscaping",
		desc: "Custom landscaping site, react scroll and react styled-components. Great template for business react site. Kiss Landscaping is a company based out of North Canton, founded by Dylan Kiss. KissLandscaping makes getting a quote for your job easy, dozens of satisfied customers.",
		GitHub: "https://github.com/BrendanGlancy/KissLandscaping",
		link: "https://kisslandscaping.com/",
		tags: [
			"Design  | ",
			"Reactjs | ",
			"Bootstrap ",
		]
	},
	{
		name: "Empyrial",
		desc: "Contributor on Empyrial, Empyrial is a Python-based open-source quantitative investment library dedicated to financial institutions and retail investors, officially released in March 2021. Already used by thousands of people working in the finance industry, Empyrial aims to become an all-in-one platform for portfolio management, analysis, and optimization.",
		GitHub: "https://github.com/ssantoshp/Empyrial",
		link: "https://ssantoshp.github.io/Empyrial/",
		tags: [
			"python | ",
			"finace | ",
			"machine learning",
		]
	},
	{
		name: "Crypto Tracker",
		desc: "Crypto Tracker is a Next.js app, utilizing an API to gather real-time prices of hundreds of cryptocurrencies; I created this app because I invest in crypto and wanted a place to see a lot of them at once.",
		link: "https://crypto-tracker-7lqmdu936-brendanglancy.vercel.app/",
		tags: [
			"Crypto | ",
			"Reactjs | ",
			"Nextjs",
		]
	},
	{
		name: "Hall of Fame",
		desc: "Design and attract customers to profootballhof.com, maintain site that generates a large amount of traffic. Mitigate Cyber Security threats.",
		link: "https://www.profootballhof.com/",
		tags: [
			"NFL | ",
			"Cybersecurity | ",
			"Wordpress",
		]
	},
];

export const feedbacks = [
	{
		name: "Dylan Kiss",
		feedback:
			"We have been very happy with our new website! It looks professional and very easy to navigate. Our experience with the customer service at Brendan tauqeer has been great. They handle things very efficiently and are available for any questions we have. They also keep us updated on daily reports so we know how our site is doing. I would recommend that u have choose hanzla web developer services for u.",
	},
	{
		name: "Austin Coontz",
		feedback:
			"the website is very nice, everything was perfectly made as i need. it just loads in moments, without giving u the chance to wait. the quality is also very amazing. i am using it without any problem. great job",
	},
];
