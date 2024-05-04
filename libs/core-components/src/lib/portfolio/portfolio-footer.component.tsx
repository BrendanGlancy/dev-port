import Link from 'next/link';

export const PortfolioFooter = () => {
  return (
    <div
      className="container d-flex align-items-center justify-content-center"
      data-aos="zoom-in"
    >
      <Link href="/portfolio" className="theme-btn">
        Back to Portfolio Entries
      </Link>
    </div>
  );
};
