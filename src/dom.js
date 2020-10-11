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
