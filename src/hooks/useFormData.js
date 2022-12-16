import { useState } from "reactn";
import set from "lodash.set";

export function useFormData(defaultValues) {
  const [formData, setFormData] = useState({ ...defaultValues });
  const [hasChanged, setHasChanged] = useState(false);

  const onChange = (event) => {
    setHasChanged(true);
    const changes = { ...formData };
    set(changes, event.target.name, event.target.value);
    setFormData(changes);
  };

  const resetChange = () => {
    setHasChanged(false);
  };

  const setData = (data, merge = false) => {
    setHasChanged(true);
    setFormData(merge ? { ...formData, ...data } : data);
  };

  return { formData, hasChanged, onChange, resetChange, setData };
}
