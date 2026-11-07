import { IconStar } from "./Icons";
export default function Stars({ value = 0, size = 16 }) {
  return (
    <span className="stars" aria-label={`${value} / 5`}>
      {[1, 2, 3, 4, 5].map((i) => <IconStar key={i} size={size} filled={i <= Math.round(value)} />)}
    </span>
  );
}
