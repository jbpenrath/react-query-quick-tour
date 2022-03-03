type ErrorToastProps = {
  message: string
};

const ErrorToast = ({ message }: ErrorToastProps) => (
  <div className="toast toast--error">
    <h6>Error !</h6>
    <p>{message}</p>
  </div>
);

export default ErrorToast;