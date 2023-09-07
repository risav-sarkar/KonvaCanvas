import { faMagnifyingGlass, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "./styles.css";

const Searchbar = ({ searchterm, setSearchterm, placeholder, type }) => {
  return (
    <div
      className={`searchBarContainer ${
        type === "dark" ? "searchbarDark" : "searchbarLight"
      }`}
    >
      <FontAwesomeIcon icon={faMagnifyingGlass} />
      <input
        placeholder={placeholder}
        type="text"
        required
        className="inputField"
        value={searchterm}
        onChange={(e) => {
          setSearchterm(e.target.value);
        }}
      />

      {searchterm && (
        <button
          onClick={() => {
            setSearchterm("");
          }}
        >
          <FontAwesomeIcon icon={faXmark} />
        </button>
      )}
    </div>
  );
};

export default Searchbar;
