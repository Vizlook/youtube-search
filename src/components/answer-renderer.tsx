import { type SyntheticEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import Link from "next/link";

export const AnswerRenderer = ({
  answer,
  citationUrls,
  onClickLink,
}: {
  answer: string;
  citationUrls: string[];
  onClickLink?: (href: string) => void;
}) => {
  const handleClickLink = (event: SyntheticEvent, href: string) => {
    event.preventDefault();
    onClickLink?.(href);
  };

  return (
    <div className="prose-sm sm:prose !max-w-full">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a({ href, children, ...props }) {
            return !href ? null : citationUrls.includes(href) ? (
              <Link
                {...props}
                href={href}
                onClick={(event) => handleClickLink(event, href)}
                className="!text-primary"
              >
                {children}
              </Link>
            ) : (
              <Link
                {...props}
                href={href}
                target="_blank"
                className="!text-primary"
              >
                {children}
              </Link>
            );
          },
        }}
      >
        {answer}
      </ReactMarkdown>
    </div>
  );
};
