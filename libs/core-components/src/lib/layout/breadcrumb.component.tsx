type BreadcrumbProps = {
  breadcrumb: string;
  heading?: string;
};
export const Breadcrumb = ({ breadcrumb, heading }: BreadcrumbProps) => {
  return (
    <section className="breadcrumb-area">
      <div className="container">
        <div className="breadcrumb-content" data-aos="fade-up">
          <p>{breadcrumb}</p>
          <h1 className="section-heading">
            <img src="/assets/star-2.png" alt="star" /> {heading}{' '}
            <img src="/assets/star-2.png" alt="star" />
          </h1>
        </div>
      </div>
    </section>
  );
};
