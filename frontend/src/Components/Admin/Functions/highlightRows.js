export const highlightRows = (
  highlightedIds,
  currentItems,
  onHighlightComplete,
  itemPrefix
) => {
  if (!Array.isArray(highlightedIds) || highlightedIds.length === 0) {
    return () => {};
  }

  const currentIds = currentItems.map((item) => item.id);
  const itemsToHighlight = highlightedIds.filter((id) =>
    currentIds.includes(id)
  );


  const timeoutsMap = new Map();

  if (itemsToHighlight.length > 0) {

    itemsToHighlight.forEach((id) => {
      const element = document.getElementById(`${itemPrefix}-${id}`);
      if (element) {
        element.classList.add("highlighted-row");
      }
    });

    const timeoutId = setTimeout(() => {
      itemsToHighlight.forEach((id) => {
        const element = document.getElementById(`${itemPrefix}-${id}`);
        if (element) {
          element.classList.remove("highlighted-row");
        }
      });

      onHighlightComplete(itemsToHighlight);
      const storedIds = JSON.parse(localStorage.getItem("highlightedIds")) || [];
      const updatedStoredIds = storedIds.filter((id) => !itemsToHighlight.includes(id));
      localStorage.setItem("highlightedIds", JSON.stringify(updatedStoredIds));

      timeoutsMap.clear();
    }, 1000);

    timeoutsMap.set("all", timeoutId);
  }

  return () => {
    const timeoutId = timeoutsMap.get("all");
    if (timeoutId) {
      clearTimeout(timeoutId);

      itemsToHighlight.forEach((id) => {
        const element = document.getElementById(`${itemPrefix}-${id}`);
        if (element) {
          element.classList.remove("highlighted-row");
        }
      });

      onHighlightComplete(itemsToHighlight);

      const storedIds = JSON.parse(localStorage.getItem("highlightedIds")) || [];
      const updatedStoredIds = storedIds.filter((highlightedId) => !itemsToHighlight.includes(highlightedId));
      localStorage.setItem("highlightedIds", JSON.stringify(updatedStoredIds));

      timeoutsMap.clear();
    }
  };
};