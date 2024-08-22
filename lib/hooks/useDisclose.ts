import React from "react";

const useDisclose = (initialState = false) => {
  const [isVisible, setIsVisible] = React.useState(initialState);

  const onOpen = () => setIsVisible(true);
  const onClose = () => setIsVisible(false);
  const onToggle = () => setIsVisible((prevState) => !prevState);

  return {
    isVisible,
    onOpen,
    onClose,
    onToggle,
    isOpen:isVisible
  };
};

export default useDisclose;