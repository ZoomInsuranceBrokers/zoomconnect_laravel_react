"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Timeline-like component for GMC FAQs
export const GMCFAQTimeline = ({ data }) => {
  const ref = useRef(null);
  const containerRef = useRef(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) setHeight(ref.current.getBoundingClientRect().height);
  }, [ref]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const heightTransform = useTransform(scrollYProgress, [0, 1], [0, height]);
  const opacityTransform = useTransform(scrollYProgress, [0, 0.1], [0, 1]);

  return (
    <div className="w-full bg-white dark:bg-neutral-950 font-sans md:px-10" ref={containerRef}>
      <div className="max-w-7xl mx-auto py-16 px-4 md:px-8 lg:px-10">
        <h2 className="text-lg md:text-4xl mb-4 text-black dark:text-white font-bold">
          Group Medical Cover - FAQs
        </h2>
        <p className="text-neutral-700 dark:text-neutral-300 text-sm md:text-base max-w-sm mb-12">
          Explore common questions about group medical cover policies for employees in India.
        </p>
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto pb-20">
        {data.map((item, index) => (
          <div key={index} className="flex justify-start pt-10 md:pt-32 md:gap-10">
            {/* Sticky question */}
            <div className="sticky flex flex-col md:flex-row z-40 items-center top-40 self-start max-w-xs lg:max-w-sm md:w-full">
              <div className="h-10 absolute left-3 md:left-3 w-10 rounded-full bg-white dark:bg-black flex items-center justify-center">
                <div className="h-4 w-4 rounded-full bg-neutral-200 dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-700 p-2" />
              </div>
              <h3 className="hidden md:block text-xl md:pl-20 md:text-3xl font-bold text-neutral-500 dark:text-neutral-500">
                {item.question}
              </h3>
            </div>

            {/* Answer */}
            <div className="relative pl-20 pr-4 md:pl-4 w-full">
              <h3 className="md:hidden block text-2xl mb-4 text-left font-bold text-neutral-500 dark:text-neutral-500">
                {item.question}
              </h3>
              <div className="text-sm text-neutral-700 dark:text-neutral-300">{item.answer}</div>
            </div>
          </div>
        ))}

        {/* Vertical progress line */}
        <div
          style={{ height: height + "px" }}
          className="absolute md:left-8 left-8 top-0 w-[2px] bg-[linear-gradient(to_bottom,var(--tw-gradient-stops))] from-transparent via-neutral-200 dark:via-neutral-700 to-transparent"
        >
          <motion.div
            style={{ height: heightTransform, opacity: opacityTransform }}
            className="absolute inset-x-0 top-0 w-[2px] bg-gradient-to-t from-purple-500 via-blue-500 to-transparent rounded-full"
          />
        </div>
      </div>
    </div>
  );
};

// Demo component for page usage
export const GMCFAQDemo = () => {
  const faqData = [
    {
      question: "What is group medical cover?",
      answer: (
        <p>
          Group medical cover provides comprehensive medical coverage to employees of an
          organization under a single policy. It covers hospitalization, treatments, and can
          include dependents like spouses, children, and parents.
        </p>
      ),
    },
    {
      question: "Why is a group medical cover policy for employees necessary?",
      answer: (
        <p>
          Offering group medical cover helps attract and retain talent, ensures employee
          well-being, and fulfills statutory requirements. It provides financial security
          during medical emergencies and boosts morale.
        </p>
      ),
    },
    {
      question: "How does a group medical cover policy work in India?",
      answer: (
        <p>
          Employers purchase a master policy covering all employees. Premiums are often paid
          by the employer, and coverage continues as long as the employee is part of the
          organization. Claims can be cashless or reimbursed, and dependents may be included.
        </p>
      ),
    },
    // {
    //   question: "Best group medical cover plans in India",
    //   answer: (
    //     <ul className="list-disc ml-6">
    //       <li>Aditya Birla Group Medical Cover</li>
    //       <li>Acko Group Medical Cover</li>
    //       <li>Care Group Medical Cover</li>
    //       <li>HDFC ERGO Group Medical Cover</li>
    //       <li>SBI Group Medical Cover</li>
    //       <li>Niva Bupa Group Medical Cover</li>
    //     </ul>
    //   ),
    // },
    // {
    //   question: "Explore employee medical cover policy in major cities in India",
    //   answer: (
    //     <p>
    //       Group medical cover is available in all major cities including Bangalore, Delhi,
    //       Mumbai, Pune, Chennai, Kolkata, Jaipur, Kochi, and more. Local offices and support
    //       teams help customize policies for regional needs.
    //     </p>
    //   ),
    // },
    {
      question: "Who should buy group medical cover?",
      answer: (
        <p>
          Startups, SMEs, and large organizations with 7 or more employees should consider
          group medical cover to protect their teams and offer competitive benefits.
        </p>
      ),
    },
    {
      question: "Advantages of group medical cover policies",
      answer: (
        <ul className="list-disc ml-6">
          <li>Lower premiums due to risk pooling</li>
          <li>No waiting period for pre-existing diseases</li>
          <li>Tax benefits for employers</li>
          <li>Coverage for dependents</li>
          <li>Easy claims process</li>
        </ul>
      ),
    },
    {
      question: "Features of a group medical cover",
      answer: (
        <ul className="list-disc ml-6">
          <li>Day 1 coverage for critical illnesses</li>
          <li>Cashless hospitalization</li>
          <li>Digital claims and support</li>
          <li>Customizable policy options</li>
        </ul>
      ),
    },
    {
      question: "Buy group medical cover online - Points to remember",
      answer: (
        <ul className="list-disc ml-6">
          <li>Choose coverage type: employee only, employee + family, or employee + extended family</li>
          <li>Compare plans and claim settlement ratios</li>
          <li>Check for maternity and wellness add-ons</li>
          <li>Ensure responsive claims support</li>
        </ul>
      ),
    },
    {
      question: "Why should you buy group medical cover from us?",
      answer: (
        <ul className="list-disc ml-6">
          <li>Personalized policy design and expert support</li>
          <li>Easy dashboard for HR and employees</li>
          <li>24x7 claims assistance</li>
          <li>Transparent pricing and terms</li>
        </ul>
      ),
    },
    // {
    //   question: "FAQs on group medical cover for employees in India",
    //   answer: (
    //     <ul className="list-disc ml-6">
    //       <li>Minimum 7 employees required for group medical cover</li>
    //       <li>Group medical cover is mandatory for some organizations</li>
    //       <li>Premiums depend on coverage, age, and add-ons</li>
    //       <li>Claims can be cashless or reimbursed</li>
    //     </ul>
    //   ),
    // },
  ];

  return (
    <div className="min-h-screen w-full">
      <GMCFAQTimeline data={faqData} />
    </div>
  );
};
