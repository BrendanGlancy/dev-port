// All site content lives here. Edit this file to update the portfolio.

export const profile = {
    name: "Brendan Glancy",
    role: "Software Engineer",
    tagline: "I build reliable software end to end, from production web services down to systems tools written in C and Rust.",
    location: "Akron–Canton, Ohio",
    email: "bglance68@gmail.com",
    github: "https://github.com/BrendanGlancy",
    githubUser: "brendanglancy",
    linkedin: "https://www.linkedin.com/in/brendan-glancy/",
    hackthebox: "https://app.hackthebox.eu/profile/414640",
    resume: "https://brendanglancy.github.io/Resume/",
};

export const about = [
    "I'm a software engineer in Ohio who likes working where systems meet the real world. My background is in IT and systems administration, where I kept production running for businesses that had nobody else to call. That taught me to care about reliability before features.",
];

export const experience = [
    {
        role: "Software Developer",
        company: "DeliverThat",
        date: "2026 – Present",
        summary:
            "Full-stack development on production systems, from backend services and cloud infrastructure to cross-platform front ends.",
        tags: ["Node.js", "AWS", "Svelte", "TypeScript"],
    },
    {
        role: "Software Developer",
        company: "LSI Digital",
        date: "2025 – 2026",
        summary:
            "Built a video plugin that plays one video in sync across multiple LG webOS and Samsung Tizen screens that share nothing but a local network. Screens find each other over UDP and elect a leader, agree on an NTP-corrected clock instead of trusting their own, and start playback at a scheduled timestamp rather than on command, within about a millisecond of each other's clocks.",
        tags: ["Video", "LG webOS", "Samsung Tizen", "Node.js", "UDP", "NTP"],
    },
    {
        role: "System Administrator",
        company: "Tekahna LLC",
        date: "May 2024 – 2025",
        summary:
            "Sole IT contractor responsible for servers, firewalls and 100+ endpoints. Put security protocols in place, handled vendor relationships, and kept production systems up when things went wrong.",
        tags: ["Linux", "Networking", "Security"],
    },
    {
        role: "Software Developer",
        company: "OVS Knife Co.",
        date: "Dec 2022 – Oct 2023",
        summary:
            "Only developer on the company's web application, built from scratch with CI/CD. Worked with the CEO and floor staff on the product, and raised Lighthouse scores by more than 30% in every category.",
        tags: ["Next.js", "React", "MongoDB", "CI/CD"],
    },
    {
        role: "IT Support Specialist",
        company: "Canton Regional Chamber of Commerce",
        date: "Sep 2018 – Oct 2023",
        summary:
            "Set up, diagnosed and maintained office machines and servers, and looked after 20+ websites for the Chamber and local businesses.",
        tags: ["IT", "Web Hosting"],
    },
];

export const featured = [
    {
        name: "RustScan",
        kind: "Open-source contribution",
        lang: "Rust",
        desc: "Added compile-time generated UDP probe payloads to RustScan's service detection. A build.rs script turns the Nmap payload database into a port→payload map embedded in the binary, which made UDP scans more accurate. Merged in Sept 2024 (#643).",
        link: "https://github.com/bee-san/RustScan/pull/643",
        repo: "bee-san/RustScan",
    },
    {
        name: "developer-portfolio",
        kind: "Open-source contribution",
        lang: "JavaScript",
        desc: "Added a contact section to this widely forked Next.js portfolio template. It sends mail through EmailJS without a page reload, keeps credentials in .env, shows success and error alerts, and can be switched on or off from the config. Merged in Nov 2022 (#30).",
        link: "https://github.com/1hanzla100/developer-portfolio/pull/30",
        repo: "1hanzla100/developer-portfolio",
    },
];

export const security = [
    { stat: "Top 2%", label: "picoCTF 2022" },
    { stat: "#534", label: "Hack The Box global rank (peak)", link: "https://app.hackthebox.eu/profile/414640" },
    { stat: "BuckeyeCTF", label: "Competitor", link: "https://github.com/BrendanGlancy/buckeyeCTF" },
    { stat: "Akron", label: "CTF Club & Cyber Defense Club" },
];

export const shoutouts = [
    { name: "Austin Coontz", link: "https://coontzy1.github.io/" },
    { name: "Ethan Tomford", link: "https://www.cipherbuu.net/" },
];

export const pipeline = {
    intro: "An AI-assisted development workflow I designed and use every day. It carries a piece of work from a rough idea to reviewed, tested code. AI agents do the heavy lifting, and an engineer makes every call that matters.",
    stages: [
        { name: "Understand", desc: "Turn a loose idea into a clear problem and a definition of done." },
        { name: "Plan", desc: "Settle the important choices up front, with a person deciding." },
        { name: "Build & verify", desc: "Write the change and prove it works." },
        { name: "Review", desc: "Check the result critically before anyone else has to." },
    ],
    principles: [
        { title: "Human in the loop", desc: "The AI proposes; an engineer decides." },
        { title: "Traceable", desc: "Every change can be traced back to why it was made." },
        { title: "Improves with use", desc: "Each project leaves the next one a little easier." },
    ],
};
