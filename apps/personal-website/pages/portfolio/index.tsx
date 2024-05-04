import { Layout } from '@brendanglancy/core-components';
import { Post } from '@brendanglancy/store';
import fs from 'fs';
import matter from 'gray-matter';
import { GetStaticProps } from 'next';
import Link from 'next/link';
import path from 'path';
import Moment from 'react-moment';
import { CASE_STUDIES_PATH, caseStudiesFilePaths } from '../../utils/mdx.utils';

export const getStaticProps: GetStaticProps<PortfolioPageProps> = () => {
  const caseStudies = caseStudiesFilePaths
    // Parse content
    .map((filePath) => {
      const fileContents = fs.readFileSync(
        path.join(CASE_STUDIES_PATH, filePath)
      );
      const fileMetadata = fs.statSync(path.join(CASE_STUDIES_PATH, filePath));
      const { content, data } = matter(fileContents);

      return {
        content,
        metadata: {
          ...data,
          created: fileMetadata.ctime.toISOString(),
          modified: fileMetadata.mtime.toISOString(),
        },
        filePath,
      };
    });

  return { props: { caseStudies } };
};

type PortfolioPageProps = {
  caseStudies: Post[];
};

const PortfolioPage = ({ caseStudies }: PortfolioPageProps) => {
  return (
    <Layout wrapperClass="main-workspage">
      <section className="projects-area">
        <div className="container">
          <h1 className="section-heading" data-aos="fade-up">
            <img src="/assets/star-2.png" alt="Star" /> Portfolio{' '}
            <img src="/assets/star-2.png" alt="Star" />
          </h1>
          <div className="row">
            <div className="col-md-4">
              {caseStudies.slice(0, 2).map((study, i) => (
                <div data-aos="zoom-in" key={i}>
                  <div className="project-item shadow-box">
                    <Link
                      className="overlay-link"
                      as={`/portfolio/${study.filePath.replace(/\.mdx?$/, '')}`}
                      href={`/portfolio/[entry]`}
                    />
                    <img src="/assets/bg1.png" alt="BG" className="bg-img" />
                    <div className="project-img">
                      <img src={study.metadata.thumbnail} alt="thumbnail" />
                    </div>
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="project-info">
                        <p>{study.metadata.category}</p>
                        <h1>{study.metadata.title}</h1>
                        <Moment format="L - h:mm a">
                          {study.metadata.modified}
                        </Moment>
                      </div>
                      <Link
                        as={`/portfolio/${study.filePath.replace(
                          /\.mdx?$/,
                          ''
                        )}`}
                        href={`/portfolio/[entry]`}
                        className="project-btn"
                      >
                        <img src="/assets/icons/cta-icon.svg" alt="Button" />
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="col-md-8">
              <h1 className="section-heading" data-aos="fade-up">
                <img src="/assets/star-2.png" alt="Star" /> Portfolio{' '}
                <img src="/assets/star-2.png" alt="Star" />
              </h1>
              <div className="d-flex align-items-start gap-24">
                {caseStudies.slice(2, 4).map((study, i) => (
                  <div data-aos="zoom-in" className="flex-1" key={i}>
                    <div className="project-item shadow-box">
                      <Link
                        className="overlay-link"
                        as={`/portfolio/${study.filePath.replace(
                          /\.mdx?$/,
                          ''
                        )}`}
                        href={`/portfolio/[entry]`}
                      />
                      <img src="/assets/bg1.png" alt="BG" className="bg-img" />
                      <div className="project-img">
                        <img src={study.metadata.thumbnail} alt="thumbnail" />
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="project-info">
                          <p>{study.metadata.category}</p>
                          <h1>{study.metadata.title}</h1>
                          <Moment format="L - h:mm a">
                            {study.metadata.created}
                          </Moment>
                        </div>
                        <Link
                          as={`/portfolio/${study.filePath.replace(
                            /\.mdx?$/,
                            ''
                          )}`}
                          href={`/portfolio/[entry]`}
                          className="project-btn"
                        >
                          <img src="/assets/icons/cta-icon.svg" alt="Button" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="d-flex align-items-start gap-24">
                {caseStudies.slice(4, 6).map((study, i) => (
                  <div data-aos="zoom-in" className="flex-1" key={i}>
                    <div className="project-item shadow-box">
                      <Link
                        className="overlay-link"
                        as={`/portfolio/${study.filePath.replace(
                          /\.mdx?$/,
                          ''
                        )}`}
                        href={`/portfolio/[entry]`}
                      />
                      <img src="/assets/bg1.png" alt="BG" className="bg-img" />
                      <div className="project-img">
                        <img src={study.metadata.thumbnail} alt="thumbnail" />
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="project-info">
                          <p>{study.metadata.category}</p>
                          <h1>{study.metadata.title}</h1>
                          <Moment format="L - h:mm a">
                            {study.metadata.created}
                          </Moment>
                        </div>
                        <Link
                          as={`/portfolio/${study.filePath.replace(
                            /\.mdx?$/,
                            ''
                          )}`}
                          href={`/portfolio/[entry]`}
                          className="project-btn"
                        >
                          <img src="/assets/icons/cta-icon.svg" alt="Button" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="d-flex align-items-start gap-24">
                {caseStudies.slice(6, 8).map((study, i) => (
                  <div data-aos="zoom-in" className="flex-1" key={i}>
                    <div className="project-item shadow-box">
                      <Link
                        className="overlay-link"
                        as={`/portfolio/${study.filePath.replace(
                          /\.mdx?$/,
                          ''
                        )}`}
                        href={`/portfolio/[entry]`}
                      />
                      <img src="/assets/bg1.png" alt="BG" className="bg-img" />
                      <div className="project-img">
                        <img src={study.metadata.thumbnail} alt="thumbnail" />
                      </div>
                      <div className="d-flex align-items-center justify-content-between">
                        <div className="project-info">
                          <p>{study.metadata.category}</p>
                          <h1>{study.metadata.title}</h1>
                          <Moment format="L - h:mm a">
                            {study.metadata.created}
                          </Moment>
                        </div>
                        <Link
                          as={`/portfolio/${study.filePath.replace(
                            /\.mdx?$/,
                            ''
                          )}`}
                          href={`/portfolio/[entry]`}
                          className="project-btn"
                        >
                          <img src="/assets/icons/cta-icon.svg" alt="Button" />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default PortfolioPage;
