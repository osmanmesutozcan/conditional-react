import React, { ReactElement, ReactNode, useEffect, useState, Children } from "react";

export type ChildFunction<T> = (just: NonNullable<T>) => React.ReactElement;
export type ChildrenOrFunction<T> = ReactNode | ChildFunction<T>;

/**
 * Hook to resolve a promise.
 */
function useAwait<T>(promise: T | Promise<T>): T | null {
  const [canceled, setCanceled] = useState(false);
  const [result, setResult] = useState<T | null>(null);

  useEffect(() => {
    (async () => {
      if (!canceled) {
        setResult(await promise);
      }

      return () => setCanceled(true);
    })();
  }, [canceled, promise]);

  return result;
}

/**
 * Renders children when cond is `truthy`.
 * Does not pass result to children.
 */
const If: React.FC<{ cond: any }> = ({ children, cond }) => {
  if (!Boolean(cond)) {
    return null;
  }

  if (!children) {
    return null;
  }

  return <>{children}</>;
};

export interface MaybeProps<T> {
  data: T | Promise<T>;
  children: ChildrenOrFunction<T>;
}

/**
 * Renders children only when data is truthy.
 */
const Maybe = <T,>({ children, data }: MaybeProps<T>) => {
  const _data = useAwait(data);

  if (!Boolean(_data)) {
    return null;
  }

  if (!children) {
    return null;
  }

  if (typeof children !== "function") {
    return <>{children}</>;
  }

  return children(_data as NonNullable<T>);
};

export interface EitherProps<L, R> {
  top: L;
  bottom?: R;
  children: [ChildrenOrFunction<L>, ChildrenOrFunction<R>];
}

/**
 * Renders top child if 'either' is truthy, bottom child otherwise.
 */
const Either = <L, R>({ children, top, bottom }: EitherProps<L, R>) => {
  if (!children || children.length !== 2) {
    throw Error("Either requires exactly 2 children");
  }

  const [topChild, bottomChild] = children;

  if (!Boolean(top) && !Boolean(bottom)) {
    return null;
  }

  if (Boolean(top)) {
    return <Maybe data={top}>{topChild}</Maybe>;
  } else {
    return <Maybe data={bottom}>{bottomChild}</Maybe>;
  }
};

// -- COND

type CondType<M> = (m: M) => any;
type CondChildType<M> = React.ReactElement<CondTestProps<M>, typeof Cond.Test>;

interface CondTestProps<M> {
  children: any;
  cond: CondType<M>;
}

/**
 * Renders the first child that matches their condition.
 */
export const Cond = <M,>({ children, match }: { match?: M | Promise<M>; children: CondChildType<M>[] }) => {
  const _match = useAwait(match);

  if (!_match) {
    return null;
  }

  const _children = (React.Children.toArray(children) as any) as CondChildType<M>[];
  const childrenToRender = _children.find((c) => {
    if (typeof c.props.cond === "function") {
      return c.props.cond(_match);
    }

    return c.props.cond;
  });

  return <>{childrenToRender}</>;
};

Cond.Test = <M,>({ children }: CondTestProps<M>) => {
  return <>{children}</>;
};

// -- EXPORTS

export const Conditional = {
  If,
  Maybe,
  Either,
};
