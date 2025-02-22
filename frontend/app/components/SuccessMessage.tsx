const SuccessMessage: React.FC<{ message: string }> = ({ message }) => (
    <div className="mb-4 p-4 rounded-lg bg-green-100 text-green-700">
      <strong>Success:</strong> {message}
    </div>
  );
  
  export default SuccessMessage;
  