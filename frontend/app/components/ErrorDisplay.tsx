const ErrorDisplay: React.FC<{ error: string }> = ({ error }) => (
  <div className="mb-4 p-4 rounded-lg bg-red-100 text-red-700">{error}</div>
);

export default ErrorDisplay;
