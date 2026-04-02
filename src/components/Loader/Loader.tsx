import css from "./Loader.module.css";

interface LoaderProps {
  size?: "small" | "medium" | "large";
}

function Loader({ size = "medium" }: LoaderProps) {
  const sizeClass =
    size === "small" ? css.small : size === "large" ? css.large : "";

  return (
    <div className={css.loaderWrapper}>
      <div className={`${css.loader} ${sizeClass}`} />
    </div>
  );
}

export default Loader;
