
import React, { ReactNode } from 'react';

interface SectionProps {
  title: string;
  children: ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
  return (
    <section className="my-16 md:my-24">
      <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center mb-12">
        {title}
      </h2>
      {children}
    </section>
  );
};

export default Section;
