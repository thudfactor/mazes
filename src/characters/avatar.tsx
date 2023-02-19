type AvatarProps = {
  x: number;
  y: number;
  size: number;
};

export function Avatar({ x, y, size }: AvatarProps) {
  const adjust = size / 2;
  return <circle fill="black" cx={x + adjust} cy={y + adjust} r={adjust * 0.6} />;
}
