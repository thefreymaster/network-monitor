import React from "react";

export const Context = React.createContext({
  isDay: false,
  setIsDay: (v: boolean) => {},
});

export const useIsDay = () => React.useContext(Context);

export const IsDayProvider = (props: { children: React.ReactNode }) => {
  const [isDay, setIsDay] = React.useState(false);

  const handleSetDay = (v: boolean) => {
    if (v) {
      // @ts-ignore
      document!.querySelector('meta[name="theme-color"]')!.content = "white";
    } else {
      // @ts-ignore
      document!.querySelector('meta[name="theme-color"]')!.content = "#1a202c";
    }
    setIsDay(v);
  };

  React.useLayoutEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour <= 17) {
      setIsDay(true);
    }
  }, []);

  return (
    <Context.Provider value={{ isDay, setIsDay: handleSetDay }}>
      {props.children}
    </Context.Provider>
  );
};
