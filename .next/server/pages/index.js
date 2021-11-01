"use strict";
(() => {
var exports = {};
exports.id = 405;
exports.ids = [405];
exports.modules = {

/***/ 1152:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ Home),
  "getStaticProps": () => (/* binding */ getStaticProps)
});

// EXTERNAL MODULE: ./node_modules/next/dynamic.js
var dynamic = __webpack_require__(5152);
;// CONCATENATED MODULE: external "prop-types"
const external_prop_types_namespaceObject = require("prop-types");
var external_prop_types_default = /*#__PURE__*/__webpack_require__.n(external_prop_types_namespaceObject);
// EXTERNAL MODULE: ./portfolio.js + 1 modules
var portfolio = __webpack_require__(4644);
// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9297);
;// CONCATENATED MODULE: external "next/head"
const head_namespaceObject = require("next/head");
var head_default = /*#__PURE__*/__webpack_require__.n(head_namespaceObject);
// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(5282);
;// CONCATENATED MODULE: ./components/SEO.jsx






function SEO({
  data
}) {
  return /*#__PURE__*/(0,jsx_runtime_.jsxs)((head_default()), {
    children: [/*#__PURE__*/jsx_runtime_.jsx("title", {
      children: data.title
    }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
      name: "title",
      content: data.title
    }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
      name: "author",
      content: "Hanzla Tauqeer"
    }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
      name: "description",
      content: data.description
    }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
      name: "keywords",
      content: data.keywords.join(", ")
    }), /*#__PURE__*/jsx_runtime_.jsx("link", {
      rel: "canonical",
      href: data.url
    }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
      property: "og:type",
      content: "website"
    }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
      property: "og:url",
      content: data.url
    }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
      property: "og:title",
      content: data.title
    }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
      property: "og:description",
      content: data.description
    }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
      property: "og:image",
      content: data.image
    }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
      property: "og:site_name",
      content: data.title
    }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
      property: "twitter:card",
      content: "summary_large_image"
    }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
      property: "twitter:url",
      content: data.url
    }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
      property: "twitter:title",
      content: data.title
    }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
      property: "twitter:description",
      content: data.description
    }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
      property: "twitter:image",
      content: data.image
    }), /*#__PURE__*/jsx_runtime_.jsx("meta", {
      name: "robots",
      content: "Index"
    }), /*#__PURE__*/jsx_runtime_.jsx("link", {
      rel: "manifest",
      href: "/manifest.json"
    }), /*#__PURE__*/jsx_runtime_.jsx("link", {
      rel: "apple-touch-icon",
      sizes: "120x120",
      href: "./favicon.png"
    }), /*#__PURE__*/jsx_runtime_.jsx("link", {
      rel: "icon",
      type: "image/png",
      sizes: "32x32",
      href: "./favicon.png"
    }), /*#__PURE__*/jsx_runtime_.jsx("link", {
      rel: "icon",
      type: "image/png",
      sizes: "16x16",
      href: "./favicon.png"
    }), /*#__PURE__*/jsx_runtime_.jsx("script", {
      async: true,
      src: "https://code.iconify.design/1/1.0.4/iconify.min.js"
    })]
  });
}

SEO.prototype = {
  data: external_prop_types_default().shape({
    title: (external_prop_types_default()).string.isRequired,
    description: (external_prop_types_default()).string,
    image: (external_prop_types_default()).string,
    url: (external_prop_types_default()).string,
    keywords: external_prop_types_default().arrayOf((external_prop_types_default()).string)
  }).isRequired
};
/* harmony default export */ const components_SEO = (SEO);
;// CONCATENATED MODULE: ./pages/index.js


const Navigation = (0,dynamic.default)(() => Promise.all(/* import() */[__webpack_require__.e(426), __webpack_require__.e(664), __webpack_require__.e(990)]).then(__webpack_require__.bind(__webpack_require__, 7271)), {
  loadableGenerated: {
    webpack: () => [/*require.resolve*/(7271)],
    modules: ["index.js -> " + "../components/Navigation"]
  }
});
const Greetings = (0,dynamic.default)(() => Promise.all(/* import() */[__webpack_require__.e(794), __webpack_require__.e(185)]).then(__webpack_require__.bind(__webpack_require__, 3185)), {
  loadableGenerated: {
    webpack: () => [/*require.resolve*/(3185)],
    modules: ["index.js -> " + "../containers/Greetings"]
  }
});
const Skills = (0,dynamic.default)(() => __webpack_require__.e(/* import() */ 688).then(__webpack_require__.bind(__webpack_require__, 5688)), {
  loadableGenerated: {
    webpack: () => [/*require.resolve*/(5688)],
    modules: ["index.js -> " + "../containers/Skills"]
  }
});
const Proficiency = (0,dynamic.default)(() => __webpack_require__.e(/* import() */ 716).then(__webpack_require__.bind(__webpack_require__, 3716)), {
  loadableGenerated: {
    webpack: () => [/*require.resolve*/(3716)],
    modules: ["index.js -> " + "../containers/Proficiency"]
  }
});
const Education = (0,dynamic.default)(() => __webpack_require__.e(/* import() */ 758).then(__webpack_require__.bind(__webpack_require__, 8758)), {
  loadableGenerated: {
    webpack: () => [/*require.resolve*/(8758)],
    modules: ["index.js -> " + "../containers/Education"]
  }
});
const Experience = (0,dynamic.default)(() => Promise.all(/* import() */[__webpack_require__.e(426), __webpack_require__.e(675), __webpack_require__.e(974)]).then(__webpack_require__.bind(__webpack_require__, 3974)), {
  loadableGenerated: {
    webpack: () => [/*require.resolve*/(3974)],
    modules: ["index.js -> " + "../containers/Experience"]
  }
});
const Projects = (0,dynamic.default)(() => __webpack_require__.e(/* import() */ 829).then(__webpack_require__.bind(__webpack_require__, 4829)), {
  loadableGenerated: {
    webpack: () => [/*require.resolve*/(4829)],
    modules: ["index.js -> " + "../containers/Projects"]
  }
});
const GithubProfileCard = (0,dynamic.default)(() => Promise.all(/* import() */[__webpack_require__.e(426), __webpack_require__.e(675), __webpack_require__.e(794), __webpack_require__.e(551)]).then(__webpack_require__.bind(__webpack_require__, 9551)), {
  loadableGenerated: {
    webpack: () => [/*require.resolve*/(9551)],
    modules: ["index.js -> " + "../components/GithubProfileCard"]
  }
});




function Home({
  githubProfileData
}) {
  return /*#__PURE__*/(0,jsx_runtime_.jsxs)("div", {
    children: [/*#__PURE__*/jsx_runtime_.jsx(components_SEO, {
      data: {
        title: "Brendan Glancy",
        description: "A passionate Full Stack Web Developer and Mobile App Developer.",
        image: "https://avatars3.githubusercontent.com/u/59178380?v=4",
        url: "https://developer-portfolio-1hanzla100.vercel.app",
        keywords: ["Brendan", "Brendan Glancy", "brendanglancy", "brendanglancy", "Portfolio", "Brendan Portfolio ", "Brendan Glancy Portfolio", "web developer", "full stack", "full stack web developer", "mobile app developer", "android developer", "django", "flask", "django rest framework", "nodejs ", "expressjs", "reactjs ", "contextapi", "redux", "flutter"]
      }
    }), /*#__PURE__*/jsx_runtime_.jsx(Navigation, {}), /*#__PURE__*/jsx_runtime_.jsx(Greetings, {}), /*#__PURE__*/jsx_runtime_.jsx(Skills, {}), /*#__PURE__*/jsx_runtime_.jsx(Proficiency, {}), /*#__PURE__*/jsx_runtime_.jsx(Education, {}), /*#__PURE__*/jsx_runtime_.jsx(Experience, {}), /*#__PURE__*/jsx_runtime_.jsx(Projects, {}), /*#__PURE__*/jsx_runtime_.jsx(GithubProfileCard, {
      prof: githubProfileData
    })]
  });
}
Home.prototype = {
  githubProfileData: (external_prop_types_default()).object.isRequired
};
async function getStaticProps(_) {
  const githubProfileData = await fetch(`https://api.github.com/users/${portfolio/* openSource.githubUserName */.qL.githubUserName}`).then(res => res.json());
  return {
    props: {
      githubProfileData
    }
  };
}

/***/ }),

/***/ 4644:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {


// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Bv": () => (/* binding */ SkillBars),
  "E5": () => (/* binding */ educationInfo),
  "b8": () => (/* binding */ experience),
  "c0": () => (/* binding */ greetings),
  "qL": () => (/* binding */ openSource),
  "q": () => (/* binding */ projects),
  "LO": () => (/* binding */ skillsSection),
  "KT": () => (/* binding */ socialLinks)
});

// UNUSED EXPORTS: contact, feedbacks

;// CONCATENATED MODULE: external "react-easy-emoji"
const external_react_easy_emoji_namespaceObject = require("react-easy-emoji");
var external_react_easy_emoji_default = /*#__PURE__*/__webpack_require__.n(external_react_easy_emoji_namespaceObject);
;// CONCATENATED MODULE: ./portfolio.js

const greetings = {
  name: "Brendan Glancy",
  title: "Hi all, I'm Brendan",
  description: "A passionate Developer, learning Full Stack Web Development and Cyber Security. I having an experience of building Web applications with JavaScript / Reactjs / Nodejs / Python / Django and some other cool libraries and frameworks.",
  resumeLink: "https://brendanglancy.github.io/Resume/"
};
const openSource = {
  githubUserName: "brendanglancy"
};
const contact = {};
const socialLinks = {
  github: "https://github.com/brendanglancy",
  linkedin: "https://www.linkedin.com/in/brendan-glancy/"
};
const skillsSection = {
  title: "What I do",
  subTitle: "CRAZY FULL STACK DEVELOPER WHO WANTS TO EXPLORE EVERY TECH STACK",
  skills: [external_react_easy_emoji_default()("⚡ Develop highly interactive Front end / User Interfaces for your web and mobile applications"), external_react_easy_emoji_default()("⚡ Progressive Web Applications ( PWA ) in normal and SPA Stacks"), external_react_easy_emoji_default()("⚡ Cyber Security, skilled in Python scripting for hacking, reverse engineering, and web explotation")],
  softwareSkills: [{
    skillName: "html-5",
    fontAwesomeClassname: "vscode-icons:file-type-html"
  }, {
    skillName: "css3",
    fontAwesomeClassname: "vscode-icons:file-type-css"
  }, {
    skillName: "JavaScript",
    fontAwesomeClassname: "logos:javascript"
  }, {
    skillName: "Java",
    fontAwesomeClassname: "logos:java"
  }, {
    skillName: "reactjs",
    fontAwesomeClassname: "vscode-icons:file-type-reactjs"
  }, {
    skillName: "nodejs",
    fontAwesomeClassname: "logos:nodejs-icon"
  }, {
    skillName: "swift",
    fontAwesomeClassname: "vscode-icons:file-type-swift"
  }, {
    skillName: "npm",
    fontAwesomeClassname: "vscode-icons:file-type-npm"
  }, {
    skillName: "sql-database",
    fontAwesomeClassname: "vscode-icons:file-type-sql"
  }, {
    skillName: "c-sharp",
    fontAwesomeClassname: "vscode-icons:file-type-csharp"
  }, {
    skillName: "python",
    fontAwesomeClassname: "logos:python"
  }, {
    skillName: "git",
    fontAwesomeClassname: "logos:git-icon"
  }, {
    skillName: "vuejs",
    fontAwesomeClassname: "logos:vue"
  }, {
    skillName: "cpp",
    fontAwesomeClassname: "vscode-icons:file-type-cpp"
  }, {
    skillName: "php",
    fontAwesomeClassname: "logos:php"
  }, {
    skillName: "jquery",
    fontAwesomeClassname: "logos:jquery"
  }]
};
const SkillBars = [{
  Stack: "Programming",
  progressPercentage: "90"
}, {
  Stack: "Frontend/Design",
  //Insert stack or technology you have experience in
  progressPercentage: "80" //Insert relative proficiency in percentage

}, {
  Stack: "Backend",
  progressPercentage: "70"
}];
const educationInfo = [{
  schoolName: "Akron University",
  subHeader: "Bachelor of Science in Computer Science",
  duration: "August 2021 - Present",
  desc: "Participated in the research of XXX and published 3 papers.",
  descBullets: ["The Bachelor of Science in Computer Information Systems (CIS) - Programming degree option allows students to attain knowledge of effective software application development, client/server application development, and database application development and management for businesses."]
}, {
  schoolName: "Tech Elevator",
  subHeader: "Full Stack Web Development",
  duration: "September 2020 - December 2020",
  desc: "Participated in the research of XXX and published 3 papers.",
  descBullets: ["Completed a 14-Week (60+ hrs/week) intensive software development program during the fall of 2020. Below is a list of projects I’ve completed during my time here:", "Tenmo Capstone (Java Postgres, demonstrating knowledge of DAO, JDBC, Spring, MVC, Rest API)"]
}];
const experience = [{
  role: "Web Developer",
  company: "Chamber of Commerce",
  companylogo: "/img/icons/common/program.svg",
  date: "June 2018 – Present",
  desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
}, {
  role: "CTO",
  company: "KissLandscaping",
  companylogo: "/img/icons/common/svg-6.svg",
  date: "june 2018 – present",
  desc: "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
}, {
  role: "Akron CTF Team",
  company: "Akron University",
  companylogo: "/img/icons/common/hacker.svg",
  date: "August 2021 – present",
  desc: "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
}];
const projects = [{
  name: "Kiss Landscaping",
  desc: "Custom landscaping site, react scroll and react styled components. Great template for business react site. Kiss Landscaping is a company based out of North Canton, founded by Dylan Kiss. KissLandscaping makes getting a quote for your job easy, dozens of satisfied customers.",
  link: "https://kisslandscaping.com/"
}, {
  name: "Empyrial",
  desc: "Contributer on Empyrial, Empyrial is a Python-based open-source quantitative investment library dedicated to financial institutions and retail investors, officially released in March 2021. Already used by thousands of people working in the finance industry, Empyrial aims to become an all-in-one platform for portfolio management, analysis, and optimization.",
  github: "https://github.com/ssantoshp/Empyrial"
}];
const feedbacks = [{
  name: "Dylan Kiss",
  feedback: "We have been very happy with our new website! It looks professional and very easy to navigate. Our experience with the customer service at Brendan tauqeer has been great. They handle things very efficiently and are available for any questions we have. They also keep us updated on daily reports so we know how our site is doing. I would recommend that u have choose hanzla web developer services for u."
}, {
  name: "Austin Coontz",
  feedback: "the website is very nice, everything was perfectly made as i need. it just loads in moments, without giving u the chance to wait. the quality is also very amazing. i am using it without any problem. great job"
}];

/***/ }),

/***/ 3548:
/***/ ((module) => {

module.exports = require("color-thief-react");

/***/ }),

/***/ 614:
/***/ ((module) => {

module.exports = require("headroom.js");

/***/ }),

/***/ 9325:
/***/ ((module) => {

module.exports = require("next/dist/server/denormalize-page-path.js");

/***/ }),

/***/ 822:
/***/ ((module) => {

module.exports = require("next/dist/server/image-config.js");

/***/ }),

/***/ 6695:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/head.js");

/***/ }),

/***/ 5378:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/i18n/normalize-locale-path.js");

/***/ }),

/***/ 2307:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/loadable.js");

/***/ }),

/***/ 7162:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/mitt.js");

/***/ }),

/***/ 8773:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router-context.js");

/***/ }),

/***/ 2248:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/get-asset-path-from-route.js");

/***/ }),

/***/ 9372:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/is-dynamic.js");

/***/ }),

/***/ 665:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/parse-relative-url.js");

/***/ }),

/***/ 2747:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/querystring.js");

/***/ }),

/***/ 333:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/route-matcher.js");

/***/ }),

/***/ 3456:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/router/utils/route-regex.js");

/***/ }),

/***/ 556:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/to-base-64.js");

/***/ }),

/***/ 7620:
/***/ ((module) => {

module.exports = require("next/dist/shared/lib/utils.js");

/***/ }),

/***/ 9297:
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ 9102:
/***/ ((module) => {

module.exports = require("react-lottie");

/***/ }),

/***/ 9356:
/***/ ((module) => {

module.exports = require("react-reveal");

/***/ }),

/***/ 5282:
/***/ ((module) => {

module.exports = require("react/jsx-runtime");

/***/ }),

/***/ 6099:
/***/ ((module) => {

module.exports = require("reactstrap");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [152], () => (__webpack_exec__(1152)));
module.exports = __webpack_exports__;

})();