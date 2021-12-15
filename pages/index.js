import dynamic from "next/dynamic";
import PropTypes from "prop-types";
const Navigation = dynamic(() => import("../components/Navigation"));
const Greetings = dynamic(() => import("../containers/Greetings"));
const Skills = dynamic(() => import("../containers/Skills"));
const Proficiency = dynamic(() => import("../containers/Proficiency"));
const Education = dynamic(() => import("../containers/Education"));
const Experience = dynamic(() => import("../containers/Experience"));
const Projects = dynamic(() => import("../containers/Projects"));
const GithubProfileCard = dynamic(() =>
	import("../components/GithubProfileCard")
);
import Landing from '../components/EmailCard'
import Carisousel from '../components/Carsousel'
import { openSource } from "../portfolio";
import SEO from "../components/SEO";


export default function Home({ githubProfileData }) {
	return (
		<div>
			<SEO
				data={{
					title: "Brendan Glancy",
					description:
						"A passionate Full Stack Web Developer and Mobile App Developer.",
					image: "https://avatars.githubusercontent.com/u/61941978?v=4",
					url: "https://dev-port-lac.vercel.app/",
					keywords: [
						"Brendan",
						"Brendan Glancy",
						"brendanglancy",
						"brendan glancy",
						"Portfolio",
						"dylan",
						"Dylan Kiss",
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
						"crytpo",
						"crypto tracker",
						"stocks",
						"api",
						"bitcoin",
						"ethereum",
						"Cardano",
						"Football",
						"Hall of Fame",
						"AWS",
						"Stock price prediction",
						"Neural Networks",
						"Machine Learning",
						"full stack",
						"full stack web developer",
						"mobile app developer",
						"android developer",
						"django",
						"flask",
						"django rest framework",
						"nodejs ",
						"expressjs",
						"reactjs ",
						"contextapi",
						"redux",
						"dev-port",
						"vercel",
						"flutter",
					],
				}}
			/>
			<Navigation />
			<Greetings />
			<Skills />
			<Proficiency />
			<Education />
			<Experience />
			<Landing />
			<Projects />
			<GithubProfileCard prof={githubProfileData} />
		</div>
	);
}

Home.prototype = {
	githubProfileData: PropTypes.object.isRequired,
};


export async function getStaticProps(_) {
	const githubProfileData = await fetch(
		`https://api.github.com/users/${openSource.githubUserName}`
	).then((res) => res.json());

	return {
		props: { githubProfileData },
	};
}
