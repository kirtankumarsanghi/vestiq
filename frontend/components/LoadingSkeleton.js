export default function LoadingSkeleton({ lines = 4 }) {
  return (
    <div className="skeleton-block" aria-hidden>
      {Array.from({ length: lines }).map((_, index) => (
        <span key={index} className="skeleton-line" />
      ))}
    </div>
  );
}
