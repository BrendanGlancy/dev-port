"use strict";
exports.id = 974;
exports.ids = [974];
exports.modules = {

/***/ 3974:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ containers_Experience)
});

// EXTERNAL MODULE: external "react"
var external_react_ = __webpack_require__(9297);
// EXTERNAL MODULE: ./portfolio.js + 1 modules
var portfolio = __webpack_require__(4644);
// EXTERNAL MODULE: external "reactstrap"
var external_reactstrap_ = __webpack_require__(6099);
// EXTERNAL MODULE: external "react-reveal"
var external_react_reveal_ = __webpack_require__(9356);
// EXTERNAL MODULE: external "color-thief-react"
var external_color_thief_react_ = __webpack_require__(3548);
var external_color_thief_react_default = /*#__PURE__*/__webpack_require__.n(external_color_thief_react_);
// EXTERNAL MODULE: ./node_modules/next/image.js
var next_image = __webpack_require__(5675);
// EXTERNAL MODULE: external "react/jsx-runtime"
var jsx_runtime_ = __webpack_require__(5282);
;// CONCATENATED MODULE: ./components/ExperienceCard.jsx








const ExperienceCard = ({
  data
}) => {
  return /*#__PURE__*/jsx_runtime_.jsx(external_reactstrap_.Col, {
    lg: "4",
    children: /*#__PURE__*/jsx_runtime_.jsx(external_react_reveal_.Fade, {
      left: true,
      duration: 1000,
      distance: "40px",
      children: /*#__PURE__*/(0,jsx_runtime_.jsxs)(external_reactstrap_.Card, {
        style: {
          flex: 1
        },
        className: "shadow-lg--hover shadow border-0 text-center rounded",
        children: [/*#__PURE__*/jsx_runtime_.jsx((external_color_thief_react_default()), {
          src: data.companylogo,
          format: "hex",
          children: color => /*#__PURE__*/jsx_runtime_.jsx(external_reactstrap_.CardHeader, {
            style: {
              background: color.data
            },
            children: /*#__PURE__*/jsx_runtime_.jsx("h5", {
              className: "text-white",
              children: data.company
            })
          })
        }), /*#__PURE__*/(0,jsx_runtime_.jsxs)(external_reactstrap_.CardBody, {
          className: "py-5",
          children: [/*#__PURE__*/jsx_runtime_.jsx("div", {
            className: "bg-white rounded-circle mb-3 img-center img-fluid shadow-lg ",
            style: {
              width: "100px",
              height: "100px"
            },
            children: /*#__PURE__*/jsx_runtime_.jsx(next_image.default, {
              src: data.companylogo,
              width: "100px",
              height: "100px",
              alt: data.companylogo
            })
          }), /*#__PURE__*/jsx_runtime_.jsx(external_reactstrap_.CardTitle, {
            tag: "h5",
            children: data.role
          }), /*#__PURE__*/jsx_runtime_.jsx(external_reactstrap_.CardSubtitle, {
            children: data.date
          }), /*#__PURE__*/(0,jsx_runtime_.jsxs)(external_reactstrap_.CardText, {
            className: "description my-3 text-left",
            children: [data.desc, /*#__PURE__*/jsx_runtime_.jsx("ul", {
              children: data.descBullets ? data.descBullets.map(desc => {
                return /*#__PURE__*/jsx_runtime_.jsx("li", {
                  children: desc
                }, desc);
              }) : null
            })]
          })]
        })]
      })
    })
  });
};

/* harmony default export */ const components_ExperienceCard = (ExperienceCard);
;// CONCATENATED MODULE: ./containers/Experience.jsx








const Experience = () => {
  return /*#__PURE__*/jsx_runtime_.jsx("section", {
    className: "section section-lg",
    children: /*#__PURE__*/jsx_runtime_.jsx(external_reactstrap_.Container, {
      children: /*#__PURE__*/(0,jsx_runtime_.jsxs)(external_react_reveal_.Fade, {
        bottom: true,
        duration: 1000,
        distance: "40px",
        children: [/*#__PURE__*/(0,jsx_runtime_.jsxs)("div", {
          className: "d-flex p-4",
          children: [/*#__PURE__*/jsx_runtime_.jsx("div", {
            children: /*#__PURE__*/jsx_runtime_.jsx("div", {
              className: "icon icon-lg icon-shape bg-gradient-white shadow rounded-circle text-info",
              children: /*#__PURE__*/jsx_runtime_.jsx("i", {
                className: "ni ni-briefcase-24 text-info"
              })
            })
          }), /*#__PURE__*/jsx_runtime_.jsx("div", {
            className: "pl-4",
            children: /*#__PURE__*/jsx_runtime_.jsx("h4", {
              className: "display-3 text-info",
              children: "Experience"
            })
          })]
        }), /*#__PURE__*/jsx_runtime_.jsx(external_reactstrap_.Row, {
          className: "row-grid align-items-center",
          children: portfolio/* experience.map */.b8.map((data, i) => {
            return /*#__PURE__*/jsx_runtime_.jsx(components_ExperienceCard, {
              data: data
            }, i);
          })
        })]
      })
    })
  });
};

/* harmony default export */ const containers_Experience = (Experience);

/***/ })

};
;