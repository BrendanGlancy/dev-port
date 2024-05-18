import Hero 		from '../components/sections/index/hero'
import GitRecentProjects from '../components/sections/projects/recent'

import Color 		from '../components/utils/page.colors.util'

import colors 		from '../content/index/_colors.json'
import settings from '../content/_settings.json'

export default function HomePage({ user, repos }) {

	return (
		<>
			<Color colors={colors} />
			<Hero />
		    <GitRecentProjects user={user} repos={repos} />
		</>
	);
}

// This gets called on every request
export async function getServerSideProps({ res }) {

	res.setHeader(
		'Cache-Control',
		'public, s-maxage=600, stale-while-revalidate=59'
	)

	const [ gitUserRes, gitReposRes] = await Promise.all( [
		fetch(`https://api.github.com/users/${settings.username.github}`),
		fetch(`https://api.github.com/users/${settings.username.github}/repos`),
	] )

	let [ user, repos] = await Promise.all( [
		gitUserRes.json(),
		gitReposRes.json(),
	] )

	if (user.login) {
		user = [user].map(
			({ login, name, avatar_url, html_url }) => ({ login, name, avatar_url, html_url })
		)
	}

	if (repos.length) {
		repos = repos.map(
			({ name, fork, description, forks_count, html_url, language, watchers, default_branch, homepage, pushed_at, topics }) => {
				const timestamp = Math.floor(new Date(pushed_at) / 10000)
				return ({ name, fork, description, forks_count, html_url, language, watchers, default_branch, homepage, timestamp, topics, pushed_at })
			}
		)

		repos.sort( (a, b) => b.watchers - a.watchers )

		repos = repos.filter( (e) => {
			if ( e.watchers >= 3 ) return e
			return false
		})
	}

	if (!repos || !user) { return { notFound: true,	} }

	return { props: { repos, user } }
}
