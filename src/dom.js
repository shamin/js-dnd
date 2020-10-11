export const getComputedStyle = (element) => {
  const styles = window.getComputedStyle(element);
  return {
    width: parseInt(styles.width),
    height: parseInt(styles.height),
  };
};

export const getBlockNodeWithId = (id) => {
  return document.querySelector('div[data-blockid="' + id + '"]');
};

export const getArrowNodeWithId = (id) => {
  return document.querySelector('div[data-arrowid="' + id + '"]');
};

export const removeAllChildren = (element) => {
  while (element.firstChild) {
    element.removeChild(element.lastChild);
  }
};
