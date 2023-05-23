// DOCUMENTATION: http://styletron.org

import { styled, useStyletron } from "styletron-react";

// statically styled component
const Title = styled("h1", {
  color: "Pink",
  fontSize: "82px",
});

// dynamically styled component
const SubTitle = styled("h2", ({ $size }) => ({
  color: "teal",
  fontSize: `${$size}px`,
}));

export default function Home() {
  // an alternative hook based API
  const [css] = useStyletron();
  return (
    <div>
      <Title>Home</Title>
      <SubTitle $size={50}>Just text</SubTitle>
      <p className={css({ fontSize: "32px" })}>Nothing more</p>
    </div>
  );
}
