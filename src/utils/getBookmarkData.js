export const getFirstHeadingText = () => {
    for (let i = 1; i <= 6; i++) {
      const heading = document.querySelector(`h${i}`);
      if (heading) {
        return heading.textContent.trim();
      }
    }
    return document.title; // Fallback to document.title if no heading found
  };