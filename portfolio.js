import emoji from "react-easy-emoji";

export const greetings = {
	name: "Brendan Glancy",
	title: "Hello there, I'm Brendan",
	description:
		"A passionate Developer, learning Full Stack Web Development and Cyber Security. I have experience building Web applications with JavaScript / Reactjs / Nodejs / Python / Django and some other cool libraries and frameworks.",
	resumeLink: "https://brendanglancy.github.io/Resume/",
};

export const openSource = {
	githubUserName: "brendanglancy",
};

export const contact = {};

export const socialLinks = {
	github: "https://github.com/brendanglancy",
	linkedin: "https://www.linkedin.com/in/brendan-glancy/",
};

export const skillsSection = {
	title: "What I do",
	subTitle:
		"FULL STACK DEVELOPER WHO WANTS TO EXPLORE EVERY TECH STACK",
	skills: [
		emoji(
			"⚡ Develop highly interactive Front end / User Interfaces for your web and mobile applications"
		),
		emoji(
			"⚡ Progressive Web Applications ( PWA ) in normal and SPA Stacks"
		),
		emoji(
			"⚡ Cyber Security, skilled in Python scripting for hacking, reverse engineering, and web explotation"
		),
	],

	softwareSkills: [
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
			skillName: "nodejs",
			fontAwesomeClassname: "logos:nodejs-icon",
		},
		{
			skillName: "swift",
			fontAwesomeClassname: "vscode-icons:file-type-swift",
		},
		{
			skillName: "npm",
			fontAwesomeClassname: "vscode-icons:file-type-npm",
		},
		{
			skillName: "sql-database",
			fontAwesomeClassname: "vscode-icons:file-type-sql",
		},
		{
			skillName: "c-sharp",
			fontAwesomeClassname: "vscode-icons:file-type-csharp",
		},
		{
			skillName: "python",
			fontAwesomeClassname: "logos:python",
		},
		{
			skillName: "git",
			fontAwesomeClassname: "logos:git-icon",
		},
		{
			skillName: "vuejs",
			fontAwesomeClassname: "logos:vue",
		},
		{
			skillName: "cpp",
			fontAwesomeClassname: "vscode-icons:file-type-cpp",
		},
		{
			skillName: "php",
			fontAwesomeClassname: "logos:php",
		},
		{
			skillName: "jquery",
			fontAwesomeClassname: "logos:jquery",
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
		progressPercentage: "80", //Insert relative proficiency in percentage
	},
	{
		Stack: "Cyber Security",
		progressPercentage: "75",
	},
	{
		Stack: "Backend",
		progressPercentage: "70",
	},
];

export const educationInfo = [
	{
		schoolName: "Akron University",
		subHeader: "Bachelor of Science in Computer Science",
		duration: "August 2021 - Present",
		desc: "Programming CIS degree, Current GPA: 4.0",
		descBullets: [
			"The Bachelor of Science in Computer Information Systems (CIS) - Programming degree option allows students to attain knowledge of effective software application development, client/server application development, and database application development and management for businesses.",
		],
	},
	{
		schoolName: "Tech Elevator",
		subHeader: "Full Stack Web Development",
		duration: "September 2020 - December 2020",
		desc: "Programming Bootcamp to learn Full Stack Web Development",
		descBullets: [
			"Completed a 14-Week (60+ hrs/week) intensive software development program during the fall of 2020. Below is a list of projects I’ve completed during my time here:",
			"Tenmo Capstone (Java Postgres, demonstrating knowledge of DAO, JDBC, Spring, MVC, Rest API)",
		],
	},
];

export const experience = [
	{
		role: "Web Developer",
		company: "Chamber of Commerce",
		companylogo: "/img/icons/common/program.svg",
		date: "June 2018 – Present",
		desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
	},
	{
		role: "CTO",
		company: "KissLandscaping",
		companylogo: "/img/icons/common/svg-6.svg",
		date: "june 2018 – present",
		desc: "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
	},
	{
		role: "Akron CTF Team",
		company: "Akron University",
		companylogo: "/img/icons/common/hacker.svg",
		date: "August 2021 – present",
		desc: "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
	},
];

export const projects = [
	{
		name: "Kiss Landscaping",
		desc: "Custom landscaping site, react scroll and react styled components. Great template for business react site. Kiss Landscaping is a company based out of North Canton, founded by Dylan Kiss. KissLandscaping makes getting a quote for your job easy, dozens of satisfied customers.",
		link: "https://kisslandscaping.com/",
	},
	{
		name: "Empyrial",
		desc: "Contributer on Empyrial, Empyrial is a Python-based open-source quantitative investment library dedicated to financial institutions and retail investors, officially released in March 2021. Already used by thousands of people working in the finance industry, Empyrial aims to become an all-in-one platform for portfolio management, analysis, and optimization.",
		github: "https://github.com/ssantoshp/Empyrial",
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

