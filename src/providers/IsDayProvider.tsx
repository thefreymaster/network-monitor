import React from 'react';

export const Context = React.createContext({ isDay: false, setIsDay: (v: boolean) => { } });

export const useIsDay = () => React.useContext(Context);

export const IsDayProvider = (props: {
    children: React.ReactNode
}) => {
    const [isDay, setIsDay] = React.useState(false);

    React.useLayoutEffect(() => {
        const hour = new Date().getHours();
        if (hour >= 6 && hour <= 17) {
            setIsDay(true)
        }
    }, [])

    return (
        <Context.Provider value={{ isDay, setIsDay }}>
            {props.children}
        </Context.Provider>
    )
}