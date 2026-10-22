import { Fragment } from "react";

export function RevealWords({
  text,
  offset = 0,
}: {
  text: string;
  offset?: number;
}) {
  return text.split(" ").map((word, i) => (
    <Fragment key={`${i}-${word}`}>
      {i > 0 && " "}
      <span className="word-mask">
        <span
          data-rise
          style={{ "--word-index": i + offset } as React.CSSProperties}
        >
          {word}
        </span>
      </span>
    </Fragment>
  ));
}

export function CompileText({ text }: { text: string }) {
  return (
    <span data-compile>
      {text.split(" ").map((word, i) => (
        <Fragment key={`${i}-${word}`}>
          {i > 0 && " "}
          <span className="compile-word">
            <span className="compile-original">{word}</span>
            <span
              className="compile-symbols"
              aria-hidden="true"
              data-word={word}
            />
          </span>
        </Fragment>
      ))}
    </span>
  );
}

export function IlluminateWords({ text }: { text: string }) {
  return (
    <span data-illuminate>
      {text.split(" ").map((word, i) => (
        <Fragment key={`${i}-${word}`}>
          {i > 0 && " "}
          <span>{word}</span>
        </Fragment>
      ))}
    </span>
  );
}
