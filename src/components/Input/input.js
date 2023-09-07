import "./styles.css";

const Type = {
  password: "password",
  text: "text",
  email: "email",
};

const Input = ({ type, placeholder, label, objectKey, state, setState }) => {
  return (
    <div className="inputContainer">
      <p>{label}</p>
      <input
        placeholder={placeholder}
        type={Type[type]}
        required
        className="inputField"
        value={state[objectKey]}
        onChange={(e) => {
          setState({ ...state, [objectKey]: e.target.value });
        }}
      />
    </div>
  );
};

export default Input;
