import { Link, Textarea } from "@chakra-ui/react";

interface Props {
  value: string;
  onChange: (newValue: string) => void;
}

function Additional({ value, onChange }: Props) {
  return (
    <>
      Dopuszczalny format to{" "}
      <Link
        href="https://www.markdownguide.org/basic-syntax/"
        color="blueviolet"
        target="blank"
      >
        Markdown
      </Link>{" "}
      z obsługą{" "}
      <Link
        href="https://github.com/remarkjs/remark-directive?tab=readme-ov-file#use"
        color="blueviolet"
        target="blank"
      >
        Remark Directives
      </Link>
      .
      <Textarea
        placeholder={`:::center
**Zapowiedzi**
:br :br
Jan Kowalski, wolny, zam. Tarnowskie Góry:br
Anna Nowak, wolna, zam. Tarnowskie Góry
:::`}
        minHeight={200}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
      />
    </>
  );
}

export default Additional;
