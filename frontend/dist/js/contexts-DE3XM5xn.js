import { r as reactExports, j as jsxRuntimeExports } from './react-vendor-CILUtiK9.js';
import { a as fetchTestData } from './services-BHoYLIlq.js';

const AppContext = reactExports.createContext();
const AppProvider = ({ children }) => {
  const [testData, setTestData] = reactExports.useState(null);
  const [loading, setLoading] = reactExports.useState(true);
  const [error, setError] = reactExports.useState(null);
  reactExports.useEffect(() => {
    const getTestData = async () => {
      try {
        setLoading(true);
        const data = await fetchTestData();
        setTestData(data);
        setError(null);
      } catch (err) {
        setError(err.message);
        setTestData(null);
      } finally {
        setLoading(false);
      }
    };
    getTestData();
  }, []);
  const value = {
    testData,
    loading,
    error
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(AppContext.Provider, { value, children });
};

export { AppProvider as A };
