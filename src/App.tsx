import React, { PropsWithChildren } from "react";
// @ts-ignore
import jsxToString from "jsx-to-string";

import { Conditional, Cond } from "./components";
import "./App.css";

const { If, Maybe, Either } = Conditional;

const rectStyles: React.CSSProperties = {
  color: "white",
  fontWeight: 500,

  minHeight: "50px",
  minWidth: "50px",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

function BlueRect({ text }: { text?: string }) {
  return (
    <div style={{ ...rectStyles, backgroundColor: "blue" }}>
      <Maybe data={text}>{(t) => <span>{t}</span>}</Maybe>
    </div>
  );
}

function RedRect({ text }: { text?: string }) {
  return (
    <div style={{ ...rectStyles, backgroundColor: "red" }}>
      <Maybe data={text}>{(t) => <span>{t}</span>}</Maybe>
    </div>
  );
}

function YellowRect({ text }: { text?: string }) {
  return (
    <div style={{ ...rectStyles, backgroundColor: "yellow" }}>
      <Maybe data={text}>{(t) => <span>{t}</span>}</Maybe>
    </div>
  );
}

function App() {
  return (
    <div className="App">
      <Example title="If" description="Simplest conditional component. Renders child if cond if truthy">
        <If cond={true}>
          <BlueRect />
        </If>

        {`
<If cond={true}>
  <BlueRect />
</If>
        `}
      </Example>

      <Example title={"Maybe"} description="Renders the child if data exists.">
        <Maybe data={"api call result"}>
          <BlueRect />
        </Maybe>

        {`
<Maybe data={"api call result"}>
  <BlueRect />
</Maybe>
        `}
      </Example>

      <Example title={"Maybe with a promise"} description="Renders the child if data resolves to truthy.">
        <Maybe data={Promise.resolve("api call result")}>
          <BlueRect />
        </Maybe>

        {`
<Maybe data={Promise.resolve("api call result")}>
  <BlueRect />
</Maybe> `}
      </Example>

      <Example title={"Maybe with resolved data"} description="Runs the inner function with resolved data.">
        <Maybe data={Promise.resolve("I am delegated")}>{(data) => <BlueRect text={data} />}</Maybe>

        {`
<Maybe data={Promise.resolve("I am delegated")}>
  {(data) => <BlueRect text={data} />}
</Maybe>
`}
      </Example>

      <Example title={"Either"} description="Renders top if value is truthy, bottom if not.">
        <Either top="Error" bottom="Ignored">
          <RedRect />
          <BlueRect />
        </Either>

        {`
<Either top="Error" bottom="Ignored">
  <RedRect />
  <BlueRect />
</Either>
        `}
      </Example>

      <Example title={"Either"} description="Runs top function if value is truthy, renders bottom if not.">
        <Either top={"Some Error"} bottom={"Ignored"}>
          {(err) => <RedRect text={err} />}
          <BlueRect />
        </Either>

        {`
<Either top={"Some Error"} bottom={"Ignored"}>
  {(err) => <RedRect text={err} />}
  <BlueRect />
</Either>
        `}
      </Example>

      <Example title={"Either"} description="Runs top function if value is truthy, bottom if not.">
        <Either top={undefined} bottom={"Success"}>
          {(err) => <RedRect text={err} />}
          {(data) => <BlueRect text={data} />}
        </Either>

        {`
<Either top={undefined} bottom={"Success"}>
  {(err) => <RedRect text={err} />}
  {(data) => <BlueRect text={data} />}
</Either>
        `}
      </Example>

      <Example title={"Cond"} description="Renders the first child that matches its condition.">
        <Cond match={{ role: "admin" }}>
          <Cond.Test cond={(m: any) => m.role === "regular"}>
            <RedRect text={"Regular"} />
          </Cond.Test>

          <Cond.Test cond={(m: any) => m.role === "admin"}>
            <BlueRect text={"Admin"} />
          </Cond.Test>

          <Cond.Test cond={() => true}>
            <YellowRect text={"Not Authenticated"} />
          </Cond.Test>
        </Cond>

        {`
<Cond match={{ role: "admin" }}>
  <Cond.Test cond={(m) => m.role === "regular"}>
    <RedRect text={"Regular"} />
  </Cond.Test>

  <Cond.Test cond={(m) => m.role === "admin"}>
    <BlueRect text={"Admin"} />
  </Cond.Test>

  <Cond.Test cond={() => true}>
    <YellowRect text={"Not Authenticated"} />
  </Cond.Test>
</Cond>
        `}
      </Example>
    </div>
  );
}

function Example({ children, title, description }: PropsWithChildren<{ title: string; description: string }>) {
  const [example, source] = Array.isArray(children) ? children : [children];
  const stringified = source ? source : jsxToString(example);

  return (
    <div className="example">
      <h3 className="example__title">{title}</h3>
      <p>{description}</p>

      <div className="example__content">
        <div className="example__preview">{example}</div>

        <div className="example__code">
          <code>
            <pre>{stringified.toString().trim()}</pre>
          </code>
        </div>
      </div>
    </div>
  );
}

export default App;
