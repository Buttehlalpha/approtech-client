import { Link } from "react-router-dom";

interface CategoryCardProps {
  id: string;
  name: string;
  icon: string;
  count: number;
}

const CategoryCard = ({ id, name, icon, count }: CategoryCardProps) => {
  return (
    <Link to={`/marketplace?category=${id}`}>
      <div className="group flex flex-col items-center gap-3 rounded-xl border border-border bg-card p-6 shadow-soft transition-all duration-300 hover:shadow-elevated hover:-translate-y-1 hover:border-primary/30">
        <span className="text-4xl transition-transform duration-300 group-hover:scale-110">
          {icon}
        </span>
        <h3 className="font-display text-base font-semibold text-card-foreground">{name}</h3>
        <span className="font-body text-sm text-muted-foreground">{count} products</span>
      </div>
    </Link>
  );
};

export default CategoryCard;