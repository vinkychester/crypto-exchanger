import { useState, useCallback, useEffect } from "react";
import { useHistory } from "react-router-dom";
import queryString from "query-string";

const useFilter = (sign = "") => {
  const history = useHistory();
  const searchParams = queryString.parse(history.location.search);

  const [filter, setFilter] = useState(Object.fromEntries(Object.entries(searchParams).filter(([_, v]) => v != null && v !== "")));
  const field = `${sign}page`;

  const handleChangeFilter = useCallback(
    (name, value) => {
      let object = name !== field ? { [name]: value, [field]: 1 } : { [name]: value };
      setFilter((prevState) => ({
        ...prevState,
        ...object
      }));
    },
    [filter]
  );

  const handleClearFilter = useCallback(() => {
    setFilter({});
  }, [filter]);

  useEffect(() => {
    let filtered = Object.fromEntries(Object.entries(filter).filter(([_, v]) => v != null && v !== ""));
    history.replace({
      search: queryString.stringify({ ...filtered })
    });
  }, [filter]);

  return [filter, handleClearFilter, handleChangeFilter]
};

export { useFilter };