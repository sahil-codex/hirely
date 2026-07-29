type SkillBadgeProps = {
  skill: string;
};

export default function SkillBadge({
  skill,
}: SkillBadgeProps) {
  return (
    <span
      className="
      inline-flex
      items-center
      rounded-full
      border
      border-indigo-500/20
      bg-indigo-500/10
      px-3
      py-1
      text-sm
      font-medium
      text-indigo-300
      transition-all
      duration-200
      hover:border-indigo-400
      hover:bg-indigo-500/20
      hover:-translate-y-0.5
      "
    >
      {skill}
    </span>
  );
}