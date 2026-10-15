## 2025-03-01 - [Zustand Multiple Store Property Reads]

**Learning:** Selecting multiple properties individually from a Zustand store (e.g. `const a = useStore(s => s.a); const b = useStore(s => s.b);`) causes unnecessary component re-renders if other unrelated state in the store changes.
**Action:** When accessing multiple properties from a Zustand store, batch them into a single selector using `useShallow` from `zustand/react/shallow` (e.g., `const { a, b } = useStore(useShallow(s => ({ a: s.a, b: s.b })))`).

## 2025-03-01 - [React.memo on Components with Children]

**Learning:** Using `React.memo` on wrapper components that accept a `children` prop (e.g. `View`, `Text`, `Card`) provides no performance benefit and actually adds overhead. Because `children` evaluates to a new React Element reference on every render, the shallow comparison will always fail.
**Action:** Remove `React.memo` from container/wrapper components that receive `children` props to avoid useless shallow comparison overhead.
